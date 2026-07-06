import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding, cardShadow } from '../../tokens';
import { primaryButtonShadow } from '../../tokens/shadows';
import { useAppStore } from '../../store';
import { useStrings } from '../../i18n';

type Nav = NativeStackNavigationProp<any>;

export function FreqConfirmScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const billingFrequency = useAppStore((s) => s.billingFrequency);
  const s = useStrings();
  const language = useAppStore((state) => state.language);

  const FREQ_LABELS: Record<string, { label: string; amount: string }> = {
    monthly:   { label: language === 'en' ? 'Monthly' : 'รายเดือน',       amount: '4,250.00' },
    quarterly: { label: language === 'en' ? 'Quarterly' : 'ราย 3 เดือน', amount: '12,700.00' },
    annual:    { label: language === 'en' ? 'Annual' : 'รายปี',           amount: '49,800.00' },
  };

  const freq = FREQ_LABELS[billingFrequency] ?? FREQ_LABELS.monthly;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: screenPadding, paddingTop: 12, paddingBottom: 16, gap: 8 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.ink} />
        </TouchableOpacity>
        <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.titleLg, color: colors.ink, flex: 1 }}>
          {s.policy.confirmChangeTitle}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: screenPadding, paddingBottom: insets.bottom + 100, gap: 16 }}
      >
        <View style={{ backgroundColor: colors.card, borderRadius: radius.cardLg, paddingHorizontal: 16, ...cardShadow }}>
          <Row label={s.policy.changeToLabel} value={freq.label} highlight />
          <Divider />
          <Row label={s.policy.newPremiumLabel} value={language === 'en' ? `฿${freq.amount}/period` : `${freq.amount} บาท/งวด`} highlight />
        </View>

        <View>
          <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: fontSize.bodyMd, color: colors.ink2, marginBottom: 8 }}>
            {s.policy.effectivePolicySection}
          </Text>
          <View style={{ backgroundColor: colors.card, borderRadius: radius.card, padding: 14, ...cardShadow }}>
            <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: fontSize.bodyMd, color: colors.ink }}>
              {language === 'en' ? 'AIA Whole Life 20/20' : 'เอไอเอ ตลอดชีพ 20/20'}
            </Text>
            <Text style={{ fontFamily: fontFamily.mono.regular, fontSize: fontSize.caption, color: colors.textSecondary, marginTop: 2 }}>
              TXXXXXXXXXX
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.screenBg, paddingHorizontal: screenPadding, paddingTop: 12, paddingBottom: insets.bottom + 16, borderTopWidth: 1, borderTopColor: colors.hairline2 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('FreqOtp')}
          activeOpacity={0.82}
          style={{ backgroundColor: colors.primary, borderRadius: radius.button, height: 52, alignItems: 'center', justifyContent: 'center', ...primaryButtonShadow }}
        >
          <Text style={{ color: colors.white, fontFamily: fontFamily.anuphan.bold, fontSize: 16 }}>{s.common.confirm}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 }}>
      <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.bodyMd, color: colors.textSecondary }}>
        {label}
      </Text>
      <Text style={{ fontFamily: fontFamily.jakarta.semiBold, fontSize: fontSize.bodyMd, color: highlight ? colors.primary : colors.ink2 }}>
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.hairline2 }} />;
}
