import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding, cardGap } from '../../tokens';
import { cardShadow } from '../../tokens/shadows';
import { StatusPill } from '../../components/StatusPill';
import { useStrings } from '../../i18n';
import { useAppStore } from '../../store';

type FilterType = 'all' | 'bill' | 'policy';

interface PaymentRecord {
  id: string;
  month: string;
  policyName: string;
  date: string;
  method: string;
  amount: number;
  type: 'bill' | 'policy';
}

function getPayments(language: string): PaymentRecord[] {
  const cardMethod = language === 'en' ? 'Card ••••4242' : 'บัตร ••••4242';
  if (language === 'en') {
    return [
      { id: '1', month: 'June 2026', policyName: 'AIA Health Happy', date: '17 Jun', method: 'PromptPay', amount: 4250, type: 'bill' },
      { id: '2', month: 'June 2026', policyName: 'AIA Unit Linked', date: '5 Jun', method: cardMethod, amount: 8000, type: 'policy' },
      { id: '3', month: 'May 2026', policyName: 'AIA Health Happy', date: '17 May', method: 'PromptPay', amount: 4250, type: 'bill' },
      { id: '4', month: 'May 2026', policyName: 'AIA Unit Linked', date: '5 May', method: cardMethod, amount: 8000, type: 'policy' },
      { id: '5', month: 'April 2026', policyName: 'AIA Health Happy', date: '17 Apr', method: 'PromptPay', amount: 4250, type: 'bill' },
    ];
  }
  return [
    { id: '1', month: 'มิถุนายน 2569', policyName: 'AIA Health Happy', date: '17 มิ.ย.', method: 'PromptPay', amount: 4250, type: 'bill' },
    { id: '2', month: 'มิถุนายน 2569', policyName: 'AIA Unit Linked', date: '5 มิ.ย.', method: cardMethod, amount: 8000, type: 'policy' },
    { id: '3', month: 'พฤษภาคม 2569', policyName: 'AIA Health Happy', date: '17 พ.ค.', method: 'PromptPay', amount: 4250, type: 'bill' },
    { id: '4', month: 'พฤษภาคม 2569', policyName: 'AIA Unit Linked', date: '5 พ.ค.', method: cardMethod, amount: 8000, type: 'policy' },
    { id: '5', month: 'เมษายน 2569', policyName: 'AIA Health Happy', date: '17 เม.ย.', method: 'PromptPay', amount: 4250, type: 'bill' },
  ];
}


export function HistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const s = useStrings();
  const language = useAppStore((state) => state.language);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const PAYMENTS = getPayments(language);

  const FILTER_LABELS: { key: FilterType; label: string }[] = [
    { key: 'all', label: s.history.filterAll },
    { key: 'bill', label: s.history.filterBill },
    { key: 'policy', label: s.history.filterPolicy },
  ];

  const filtered = activeFilter === 'all'
    ? PAYMENTS
    : PAYMENTS.filter((p) => p.type === activeFilter);

  // Group by month
  const grouped: { month: string; records: PaymentRecord[] }[] = [];
  filtered.forEach((p) => {
    const existing = grouped.find((g) => g.month === p.month);
    if (existing) {
      existing.records.push(p);
    } else {
      grouped.push({ month: p.month, records: [p] });
    }
  });

  const totalPaid = PAYMENTS.reduce((sum, p) => sum + p.amount, 0);
  const onTimeCount = 6; // 6 instalments on-time per screenshot

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBg }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: screenPadding,
          paddingTop: 12,
          paddingBottom: 16,
          gap: 8,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.ink} />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: fontFamily.anuphan.bold,
            fontSize: fontSize.titleLg,
            color: colors.ink,
            flex: 1,
          }}
        >
          {s.history.title}
        </Text>
        <TouchableOpacity hitSlop={12}>
          <MaterialIcons name="filter-list" size={22} color={colors.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: screenPadding,
          paddingBottom: insets.bottom + 32,
          gap: cardGap,
        }}
      >
        {/* Summary card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...cardShadow,
          }}
        >
          <View style={{ gap: 4 }}>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.regular,
                fontSize: fontSize.caption,
                color: colors.textSecondary,
              }}
            >
              {s.history.paidThisYear('2569', '')}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.jakarta.extraBold,
                fontSize: 26,
                color: colors.ink,
                letterSpacing: -0.8,
              }}
            >
              ฿{totalPaid.toLocaleString('en-US')}
            </Text>
          </View>
          <StatusPill label={s.history.onTimeStreak(String(onTimeCount))} variant="success" />
        </View>

        {/* Filter chips */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {FILTER_LABELS.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveFilter(key)}
              activeOpacity={0.75}
              style={{
                backgroundColor: activeFilter === key ? colors.primary : colors.card,
                borderRadius: radius.pill,
                paddingHorizontal: 14,
                paddingVertical: 7,
                ...cardShadow,
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamily.anuphan.semiBold,
                  fontSize: fontSize.body,
                  color: activeFilter === key ? colors.white : colors.inkBody2,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Grouped list */}
        {grouped.map((group) => (
          <View key={group.month} style={{ gap: 8 }}>
            <Text
              style={{
                fontFamily: fontFamily.jakarta.bold,
                fontSize: 11,
                color: colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                marginLeft: 4,
              }}
            >
              {group.month}
            </Text>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: radius.card,
                overflow: 'hidden',
                ...cardShadow,
              }}
            >
              {group.records.map((record, i) => (
                <View key={record.id}>
                  {i > 0 && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: colors.hairline,
                        marginLeft: 50,
                      }}
                    />
                  )}
                  <PaymentRow record={record} />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Sub-components ─── */

function PaymentRow({ record }: { record: PaymentRecord }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 13,
        gap: 12,
      }}
    >
      {/* Green check circle */}
      <MaterialIcons name="check-circle" size={22} color={colors.success} />

      {/* Info */}
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            fontFamily: fontFamily.anuphan.semiBold,
            fontSize: fontSize.bodyMd,
            color: colors.ink2,
          }}
        >
          {record.policyName}
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.anuphan.regular,
            fontSize: fontSize.caption,
            color: colors.textSecondary,
          }}
        >
          {record.date} · {record.method}
        </Text>
      </View>

      {/* Amount */}
      <Text
        style={{
          fontFamily: fontFamily.jakarta.bold,
          fontSize: fontSize.bodyMd,
          color: colors.ink2,
          letterSpacing: -0.2,
        }}
      >
        ฿{record.amount.toLocaleString('en-US')}
      </Text>

      {/* Download icon */}
      <TouchableOpacity hitSlop={10}>
        <MaterialIcons name="file-download" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}
