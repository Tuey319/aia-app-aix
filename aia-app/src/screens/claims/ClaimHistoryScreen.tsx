import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding, cardGap } from '../../tokens';
import { cardShadow } from '../../tokens/shadows';
import { useStrings } from '../../i18n';
import { useAppStore } from '../../store';

type Nav = NativeStackNavigationProp<any>;

interface TimelineStep {
  label: string;
  sub: string;
  status: 'done' | 'active' | 'pending';
}

function StepDot({ status }: { status: TimelineStep['status'] }) {
  if (status === 'done') {
    return (
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: colors.success,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name="check" size={14} color={colors.white} />
      </View>
    );
  }
  if (status === 'active') {
    return (
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: colors.amber,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white }} />
      </View>
    );
  }
  // pending
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: colors.hairline2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.textTertiary }} />
    </View>
  );
}

export function ClaimHistoryScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const s = useStrings();
  const language = useAppStore((state) => state.language);

  const STEPS: TimelineStep[] = [
    { label: s.claims.statusReceived, sub: language === 'en' ? '18 Jun 2026 · CH-41Y.' : '18 มิ.ย. 2569 · CH-41ย.', status: 'done' },
    { label: s.claims.statusReview, sub: s.claims.statusReviewSub, status: 'active' },
    { label: s.claims.statusPaid, sub: language === 'en' ? 'Pending' : 'รอดำเนินการ', status: 'pending' },
  ];

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
          {s.claims.historyTitle}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: screenPadding,
          paddingBottom: insets.bottom + 32,
          gap: cardGap,
        }}
      >
        {/* Amber status banner — rounded card, no left border */}
        <View
          style={{
            backgroundColor: colors.amberTint,
            borderRadius: radius.card,
            padding: 14,
            gap: 6,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialIcons name="schedule" size={14} color={colors.amberDeep} />
              <Text
                style={{
                  fontFamily: fontFamily.anuphan.bold,
                  fontSize: fontSize.body,
                  color: colors.amberDeep,
                }}
              >
                {language === 'en' ? 'Processing' : 'กำลังดำเนินการ'}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: fontFamily.mono.regular,
                fontSize: fontSize.caption,
                color: colors.amberDeep,
                letterSpacing: 1,
              }}
            >
              E0053728
            </Text>
          </View>
          <Text
            style={{
              fontFamily: fontFamily.anuphan.regular,
              fontSize: fontSize.caption,
              color: colors.amberDeeper,
            }}
          >
            {language === 'en'
              ? 'Out-patient Treatment · Somchai Meethong · 01 Jun 2026'
              : 'ค่ารักษาผู้ป่วยนอก · สมชาย มีทอง · 01 มิ.ย. 2569'}
          </Text>
        </View>

        {/* Amount card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            padding: 18,
            ...cardShadow,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.anuphan.regular,
              fontSize: fontSize.caption,
              color: colors.textSecondary,
              marginBottom: 6,
            }}
          >
            {language === 'en' ? 'Out-patient Treatment' : 'ค่ารักษาผู้ป่วยนอก'}
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.anuphan.regular,
              fontSize: fontSize.caption,
              color: colors.textSecondary,
              marginBottom: 2,
            }}
          >
            {language === 'en' ? 'Statement status as of' : 'สถานะใบแจ้ง ใน'}{' '}
            <Text style={{ color: colors.amberDeep }}>
              {language === 'en' ? '01 Jun 2026' : '01 มิ.ย. 2569'}
            </Text>
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.jakarta.extraBold,
              fontSize: 36,
              color: colors.ink,
              letterSpacing: -1,
              marginTop: 4,
            }}
          >
            ฿3,200.00
          </Text>
        </View>

        {/* Timeline card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            padding: 18,
            ...cardShadow,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.anuphan.bold,
              fontSize: fontSize.body,
              color: colors.ink,
              marginBottom: 16,
            }}
          >
            {language === 'en' ? 'Processing Status' : 'สถานะการดำเนินการ'}
          </Text>

          {STEPS.map((step, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 14 }}>
              {/* Left: dot + connector line */}
              <View style={{ alignItems: 'center', width: 22 }}>
                <StepDot status={step.status} />
                {i < STEPS.length - 1 && (
                  <View
                    style={{
                      width: 2,
                      height: 36,
                      backgroundColor: step.status === 'done' ? colors.success : colors.hairline2,
                      marginTop: 4,
                      marginBottom: 4,
                    }}
                  />
                )}
              </View>

              {/* Right: text */}
              <View style={{ flex: 1, paddingBottom: i < STEPS.length - 1 ? 4 : 0 }}>
                <Text
                  style={{
                    fontFamily: fontFamily.anuphan.semiBold,
                    fontSize: fontSize.bodyMd,
                    color:
                      step.status === 'pending' ? colors.textTertiary : colors.ink,
                    marginBottom: 2,
                    lineHeight: 22,
                  }}
                >
                  {step.label}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.anuphan.regular,
                    fontSize: fontSize.caption,
                    color: colors.textSecondary,
                    lineHeight: 18,
                  }}
                >
                  {step.sub}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Back to home link */}
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeTab' as any)}
          style={{ alignItems: 'center', paddingVertical: 8 }}
        >
          <Text
            style={{
              fontFamily: fontFamily.anuphan.semiBold,
              fontSize: fontSize.bodyMd,
              color: colors.primary,
            }}
          >
            {s.common.backHome}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
