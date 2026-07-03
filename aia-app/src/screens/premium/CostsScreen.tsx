import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { colors, fontFamily, radius, screenPadding, cardGap } from '../../tokens';
import { cardShadow, primaryButtonShadow } from '../../tokens/shadows';
import { BarChart } from '../../components/BarChart';
import { useAppStore } from '../../store';
import { useStrings } from '../../i18n';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Costs'>;

const FORECAST_DATA = [
  { label: '2569', value: 51000, color: colors.amber },
  { label: '2570', value: 54000, color: '#D9791A' },
  { label: '2571', value: 58000, color: '#C46A10' },
  { label: '2572', value: 63000, color: '#AE5A0E' },
  { label: '2573', value: 69000, color: colors.amberDeeper },
];

const FREQ_DISPLAY: Record<string, { labelTh: string; labelEn: string; perPeriod: number }> = {
  monthly: { labelTh: 'รายเดือน', labelEn: 'Monthly', perPeriod: 4250 },
  quarterly: { labelTh: 'ราย 3 เดือน', labelEn: 'Quarterly', perPeriod: 12623 },
  annual: { labelTh: 'รายปี', labelEn: 'Annual', perPeriod: 49470 },
};

export function CostsScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const s = useStrings();
  const language = useAppStore((state) => state.language);
  const billingFrequency = useAppStore((st) => st.billingFrequency);
  const currentFreq = FREQ_DISPLAY[billingFrequency] ?? FREQ_DISPLAY.monthly;

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
            fontSize: 17,
            color: colors.ink,
          }}
        >
          {s.costs.title}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: screenPadding,
          paddingBottom: insets.bottom + 100,
          gap: cardGap,
        }}
      >
        {/* 5-Year Forecast Chart */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            padding: 18,
            gap: 14,
            ...cardShadow,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.bold,
                fontSize: 14,
                color: colors.ink2,
              }}
            >
              {s.costs.forecastTitle}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.mono.regular,
                fontSize: 9,
                color: colors.textSecondary,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
              }}
            >
              {language === 'en' ? 'THB' : 'บาท'}
            </Text>
          </View>

          <BarChart
            data={FORECAST_DATA}
            height={100}
            formatValue={(v) => `฿${(v / 1000).toFixed(0)}k`}
            labelColor={colors.amberDeep}
          />

          <View
            style={{
              backgroundColor: colors.amberTint,
              borderRadius: 10,
              padding: 11,
              flexDirection: 'row',
              gap: 8,
              alignItems: 'flex-start',
            }}
          >
            <MaterialIcons name="trending-up" size={16} color={colors.amberDeep} style={{ marginTop: 1 }} />
            <Text
              style={{
                flex: 1,
                fontFamily: fontFamily.anuphan.regular,
                fontSize: 12,
                color: colors.amberDeeper,
                lineHeight: 18,
              }}
            >
              {language === 'en'
                ? 'Premiums increase by age as set at contract time — this is a pre-designed structure, not a surprise hike. Planning ahead helps you manage it.'
                : 'เบี้ยประกันเพิ่มขึ้นตามช่วงอายุที่กำหนดไว้ตั้งแต่ทำสัญญา — เป็นโครงสร้างเบี้ยที่ออกแบบไว้ล่วงหน้าตามแบบประกัน ไม่ใช่การปรับขึ้นแบบไม่ทันตั้งตัว วางแผนงบล่วงหน้าช่วยให้จัดการได้ง่ายขึ้น'}
            </Text>
          </View>
        </View>

        {/* Current billing frequency — actual change happens in the one canonical
            flow (ChangeFreq -> Confirm -> OTP -> Success), not duplicated here. */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            padding: 16,
            gap: 14,
            ...cardShadow,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.jakarta.bold,
              fontSize: 11,
              color: colors.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}
          >
            {s.costs.freqSection}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 2 }}>
              <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 16, color: colors.ink }}>
                {language === 'en' ? currentFreq.labelEn : currentFreq.labelTh}
              </Text>
              <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 12, color: colors.textSecondary }}>
                {s.costs.periodsPerYear(billingFrequency === 'monthly' ? '12' : billingFrequency === 'quarterly' ? '4' : '1')}
              </Text>
            </View>
            <Text style={{ fontFamily: fontFamily.jakarta.bold, fontSize: 18, color: colors.ink }}>
              ฿{currentFreq.perPeriod.toLocaleString('en-US')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('AccountTab' as any, { screen: 'ChangeFreq' } as any)}
            activeOpacity={0.82}
            style={{
              backgroundColor: colors.primary,
              borderRadius: radius.button,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              ...primaryButtonShadow,
            }}
          >
            <Text style={{ color: colors.white, fontFamily: fontFamily.anuphan.bold, fontSize: 15 }}>
              {s.policy.changeFreqBtn}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: fontFamily.anuphan.regular,
              fontSize: 11,
              color: colors.textSecondary,
              lineHeight: 16,
            }}
          >
            {s.costs.cycleNote}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
