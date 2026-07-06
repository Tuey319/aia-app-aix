import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { colors, fontFamily, fontSize, radius, screenPadding, cardGap } from '../../tokens';
import { cardShadow, primaryButtonShadow } from '../../tokens/shadows';
import { CoverageRing } from '../../components/CoverageRing';
import { COVERAGE_CATEGORIES } from './coverageCategories';
import { useAppStore } from '../../store';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'CoverageOverview'>;

export function CoverageOverviewScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const language = useAppStore((state) => state.language);

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
        <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.titleLg, color: colors.ink }}>
          {language === 'en' ? 'Your Coverage Overview' : 'ภาพรวมความคุ้มครองของคุณ'}
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
        {/* Intro */}
        <View style={{ gap: 6, marginBottom: 4 }}>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.title, color: colors.ink2 }}>
            {language === 'en' ? 'Is your coverage enough?' : 'ความคุ้มครองของคุณเพียงพอหรือไม่'}
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.anuphan.regular,
              fontSize: fontSize.caption,
              color: colors.textSecondary,
              lineHeight: 18,
            }}
          >
            {language === 'en'
              ? 'Below is a summary of your coverage across 6 categories, based on your total sum insured. Complete information leads to a more accurate calculation.'
              : 'ด้านล่างคือสรุปภาพรวมความคุ้มครอง 6 ประเภท โดยอิงจากจำนวนเงินเอาประกันภัยทั้งหมดของคุณ ซึ่งการให้ข้อมูลครบ จะทำให้การคำนวณแม่นยิ่งขึ้น'}
          </Text>
        </View>

        {/* 2-column grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: cardGap }}>
          {COVERAGE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => navigation.navigate('LifestyleCheck', { category: cat.id })}
              activeOpacity={0.85}
              style={{
                width: '47%',
                flexGrow: 1,
                backgroundColor: colors.card,
                borderRadius: radius.card,
                padding: 14,
                gap: 12,
                ...cardShadow,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                  <MaterialCommunityIcons name={cat.icon} size={18} color={colors.primary} />
                  <View>
                    <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.caption, color: colors.ink2 }}>
                      {language === 'en' ? cat.labelEn : cat.label}
                    </Text>
                    {cat.sublabel && (
                      <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.xs, color: colors.textSecondary }}>
                        {language === 'en' ? cat.sublabelEn : cat.sublabel}
                      </Text>
                    )}
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={18} color={colors.textTertiary} />
              </View>

              <View style={{ alignItems: 'center', gap: 8 }}>
                <CoverageRing pct={cat.pct} />
                <Text style={{ fontFamily: fontFamily.jakarta.bold, fontSize: fontSize.bodyMd, color: colors.ink }}>
                  {cat.amount.toLocaleString('en-US')}
                  {cat.unit === 'daily' && (
                    <Text style={{ fontFamily: fontFamily.jakarta.medium, fontSize: fontSize.sm, color: colors.textSecondary }}>
                      /{language === 'en' ? 'day' : 'วัน'}
                    </Text>
                  )}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recalculate button */}
        <TouchableOpacity
          activeOpacity={0.82}
          style={{
            backgroundColor: colors.primary,
            borderRadius: radius.button,
            height: 52,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4,
            ...primaryButtonShadow,
          }}
        >
          <Text style={{ color: colors.white, fontFamily: fontFamily.anuphan.bold, fontSize: 16 }}>
            {language === 'en' ? 'Recalculate' : 'คำนวณอีกครั้ง'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
