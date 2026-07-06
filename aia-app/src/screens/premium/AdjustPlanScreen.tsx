import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { colors, fontFamily, radius, screenPadding, cardGap } from '../../tokens';
import { cardShadow, primaryButtonShadow } from '../../tokens/shadows';
import { useAppStore } from '../../store';
import { useStrings } from '../../i18n';
import { getCoverageCategory } from './coverageCategories';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'AdjustPlan'>;
type Route = RouteProp<HomeStackParamList, 'AdjustPlan'>;

function pctIncome(monthly: number, income: number) { return (monthly * 12) / (income * 12) * 100; }

type Verdict = 'safe' | 'caution' | 'risk';

function getVerdict(pct: number): Verdict {
  if (pct <= 10) return 'safe';
  if (pct <= 13) return 'caution';
  return 'risk';
}

const VERDICT_CONFIG = {
  safe: { bg: colors.successTint, text: colors.success, label: 'ปลอดภัย' },
  caution: { bg: colors.amberTint, text: colors.amberDeep, label: 'ระวัง' },
  risk: { bg: colors.primaryTint, text: colors.primary, label: 'เสี่ยง' },
};

interface LighterPlan {
  id: string;
  name: string;
  coverage: number; // millions
  monthly: number;
  savings: number;
  keeps: string[];
  keepsEn: string[];
  changes: string[];
  changesEn: string[];
}

const LIGHTER_PLANS: LighterPlan[] = [
  {
    id: 'a',
    name: 'AIA Health Shield',
    coverage: 1.5,
    monthly: 3200,
    savings: 1050,
    keeps: ['ความคุ้มครองชีวิต ฿1.5M', 'สิทธิ์รักษาพยาบาลใน รพ.', 'AIA Vitality'],
    keepsEn: ['Life coverage ฿1.5M', 'Hospitalization benefits', 'AIA Vitality'],
    changes: ['ทุนประกันลด ฿500k', 'ผลประโยชน์การเสียชีวิตอุบัติเหตุ'],
    changesEn: ['Sum insured reduced by ฿500k', 'Accidental death benefit removed'],
  },
  {
    id: 'b',
    name: 'AIA Life Essential',
    coverage: 1.0,
    monthly: 2100,
    savings: 2150,
    keeps: ['ความคุ้มครองชีวิต ฿1.0M', 'AIA Vitality'],
    keepsEn: ['Life coverage ฿1.0M', 'AIA Vitality'],
    changes: ['ทุนประกันลด ฿1M', 'ผลประโยชน์ผู้ป่วยใน', 'มูลค่าเงินสดสะสม'],
    changesEn: ['Sum insured reduced by ฿1M', 'Inpatient benefit removed', 'Cash value accumulation removed'],
  },
];

function formatCoverage(amount: number, unit: 'lump' | 'daily', language: string) {
  if (unit === 'daily') return `฿${amount.toLocaleString('en-US')}/${language === 'en' ? 'day' : 'วัน'}`;
  return amount >= 1000000 ? `฿${(amount / 1000000).toFixed(1)}M` : `฿${amount.toLocaleString('en-US')}`;
}

export function AdjustPlanScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const income = useAppStore((s) => s.income);
  const policy = useAppStore((s) => s.selectedPolicy);
  const language = useAppStore((state) => state.language);
  const s = useStrings();

  const category = getCoverageCategory(route.params?.category);
  const isLife = category.id === 'life';

  const [coverageLevel, setCoverageLevel] = useState(category.amount);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const newMonthly = Math.round(coverageLevel * category.bahtPerUnitMonthly);
  const currentMonthly = Math.round(category.amount * category.bahtPerUnitMonthly);
  const pct = pctIncome(newMonthly, income);
  const verdict = getVerdict(pct);
  const delta = newMonthly - currentMonthly;

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
          {language === 'en'
            ? (isLife ? 'Adjust Your Plan' : `Adjust Coverage · ${category.labelEn}`)
            : (isLife ? 'ปรับแผนให้พอดี' : `ปรับความคุ้มครอง · ${category.label}`)}
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
        {/* Info Banner */}
        <View
          style={{
            backgroundColor: colors.infoTint,
            borderRadius: 12,
            padding: 13,
            flexDirection: 'row',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <MaterialIcons name="info-outline" size={18} color={colors.info} style={{ marginTop: 1 }} />
          <Text
            style={{
              flex: 1,
              fontFamily: fontFamily.anuphan.regular,
              fontSize: 12,
              color: colors.infoDeep,
              lineHeight: 18,
            }}
          >
            {s.adjustPlan.infoBanner}
          </Text>
        </View>

        {/* Live Result Card */}
        <View
          style={{
            backgroundColor: colors.ink,
            borderRadius: radius.cardLg,
            padding: 20,
            gap: 14,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.anuphan.medium,
              fontSize: 13,
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            {s.adjustPlan.newMonthly}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
            <Text
              style={{
                fontFamily: fontFamily.jakarta.extraBold,
                fontSize: 42,
                color: colors.white,
                letterSpacing: -1.5,
              }}
            >
              ฿{newMonthly.toLocaleString('en-US')}
            </Text>
            {delta !== 0 && (
              <Text
                style={{
                  fontFamily: fontFamily.jakarta.semiBold,
                  fontSize: 14,
                  color: delta < 0 ? colors.successDot : '#FF7B9C',
                }}
              >
                {delta > 0 ? '+' : ''}
                {delta.toLocaleString('en-US')}
              </Text>
            )}
          </View>
          {delta === 0 && (
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              {s.adjustPlan.sameCurrent}
            </Text>
          )}

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: 12,
                gap: 3,
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamily.anuphan.regular,
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                {s.adjustPlan.coverage}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.jakarta.bold,
                  fontSize: 15,
                  color: colors.white,
                }}
              >
                {formatCoverage(coverageLevel, category.unit, language)}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: VERDICT_CONFIG[verdict].bg + '30',
                borderRadius: 10,
                padding: 12,
                gap: 3,
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamily.anuphan.regular,
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                {s.adjustPlan.pctIncome}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.jakarta.bold,
                  fontSize: 15,
                  color: VERDICT_CONFIG[verdict].text,
                }}
              >
                {pct.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Slider Card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            padding: 18,
            gap: 14,
            ...cardShadow,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.bold,
                fontSize: 14,
                color: colors.ink2,
              }}
            >
              {s.adjustPlan.sliderLabel}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.jakarta.bold,
                fontSize: 14,
                color: colors.primary,
              }}
            >
              {formatCoverage(coverageLevel, category.unit, language)}
            </Text>
          </View>

          <Slider
            minimumValue={category.sliderMin}
            maximumValue={category.sliderMax}
            step={category.sliderStep}
            value={coverageLevel}
            onValueChange={(v) => {
              setCoverageLevel(v);
              setSelectedPlan(null);
            }}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.hairline2}
            thumbTintColor={colors.primary}
            style={{ marginHorizontal: -4 }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fontFamily.jakarta.medium, fontSize: 11, color: colors.textSecondary }}>
              {formatCoverage(category.sliderMin, category.unit, language)}
            </Text>
            <Text style={{ fontFamily: fontFamily.jakarta.medium, fontSize: 11, color: colors.textTertiary }}>
              {formatCoverage(category.amount, category.unit, language)} ({language === 'en' ? 'current' : 'ปัจจุบัน'})
            </Text>
            <Text style={{ fontFamily: fontFamily.jakarta.medium, fontSize: 11, color: colors.textSecondary }}>
              {formatCoverage(category.sliderMax, category.unit, language)}
            </Text>
          </View>

          {/* Verdict Pill */}
          <View
            style={{
              backgroundColor: VERDICT_CONFIG[verdict].bg,
              borderRadius: 10,
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <MaterialIcons
              name={verdict === 'safe' ? 'check-circle' : verdict === 'caution' ? 'warning' : 'error'}
              size={16}
              color={VERDICT_CONFIG[verdict].text}
            />
            <Text
              style={{
                fontFamily: fontFamily.anuphan.semiBold,
                fontSize: 13,
                color: VERDICT_CONFIG[verdict].text,
                flex: 1,
              }}
            >
              {verdict === 'safe'
                ? s.adjustPlan.verdictSafe
                : verdict === 'caution'
                ? s.adjustPlan.verdictCaution
                : s.adjustPlan.verdictRisk}
            </Text>
          </View>
        </View>

        {/* Lighter Plans (life coverage only) */}
        {isLife && (
        <Text
          style={{
            fontFamily: fontFamily.anuphan.bold,
            fontSize: 14,
            color: colors.ink2,
            marginTop: 4,
            marginLeft: 2,
          }}
        >
          {s.adjustPlan.lighterPlans}
        </Text>
        )}

        {isLife && LIGHTER_PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <TouchableOpacity
              key={plan.id}
              onPress={() => setSelectedPlan(isSelected ? null : plan.id)}
              activeOpacity={0.85}
              style={{
                backgroundColor: colors.card,
                borderRadius: radius.card,
                borderWidth: 2,
                borderColor: isSelected ? colors.primary : 'transparent',
                ...cardShadow,
              }}
            >
              <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.anuphan.bold,
                      fontSize: 14,
                      color: colors.ink2,
                      marginBottom: 4,
                    }}
                  >
                    {plan.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fontFamily.anuphan.regular,
                      fontSize: 12,
                      color: colors.textSecondary,
                    }}
                  >
                    {s.adjustPlan.coverage} ฿{plan.coverage}M
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 3 }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.jakarta.bold,
                      fontSize: 16,
                      color: colors.ink,
                    }}
                  >
                    ฿{plan.monthly.toLocaleString('en-US')}
                    <Text style={{ fontSize: 12, color: colors.textSecondary, fontFamily: fontFamily.jakarta.regular }}>
                      /{language === 'en' ? 'mo' : 'เดือน'}
                    </Text>
                  </Text>
                  <View
                    style={{
                      backgroundColor: colors.successTint,
                      borderRadius: 99,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fontFamily.jakarta.semiBold,
                        fontSize: 11,
                        color: colors.success,
                      }}
                    >
                      {s.adjustPlan.savingLabel(plan.savings.toLocaleString('en-US'))}
                    </Text>
                  </View>
                </View>
              </View>

              {isSelected && (
                <View
                  style={{
                    marginHorizontal: 16,
                    marginBottom: 16,
                    borderRadius: 12,
                    overflow: 'hidden',
                  }}
                >
                  {/* Keeps */}
                  <View style={{ backgroundColor: colors.successTint, padding: 14 }}>
                    <Text
                      style={{
                        fontFamily: fontFamily.jakarta.bold,
                        fontSize: 12,
                        color: colors.success,
                        marginBottom: 8,
                      }}
                    >
                      ✓ {s.adjustPlan.keeps}
                    </Text>
                    {(language === 'en' ? plan.keepsEn : plan.keeps).map((k, i) => (
                      <Text
                        key={i}
                        style={{
                          fontFamily: fontFamily.anuphan.regular,
                          fontSize: 13,
                          color: colors.successDeep,
                          marginBottom: 3,
                        }}
                      >
                        · {k}
                      </Text>
                    ))}
                  </View>
                  {/* Changes */}
                  <View style={{ backgroundColor: colors.amberTint, padding: 14 }}>
                    <Text
                      style={{
                        fontFamily: fontFamily.jakarta.bold,
                        fontSize: 12,
                        color: colors.amberDeep,
                        marginBottom: 8,
                      }}
                    >
                      ↓ {s.adjustPlan.changes}
                    </Text>
                    {(language === 'en' ? plan.changesEn : plan.changes).map((c, i) => (
                      <Text
                        key={i}
                        style={{
                          fontFamily: fontFamily.anuphan.regular,
                          fontSize: 13,
                          color: colors.amberDeeper,
                          marginBottom: 3,
                        }}
                      >
                        · {c}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sticky Footer */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.screenBg,
          paddingHorizontal: screenPadding,
          paddingTop: 12,
          paddingBottom: insets.bottom + 12,
          borderTopWidth: 1,
          borderTopColor: colors.hairline,
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('PaySelect')}
          activeOpacity={0.82}
          style={{
            backgroundColor: colors.primary,
            borderRadius: radius.button,
            height: 52,
            alignItems: 'center',
            justifyContent: 'center',
            ...primaryButtonShadow,
          }}
        >
          <Text style={{ color: colors.white, fontFamily: fontFamily.anuphan.bold, fontSize: 16 }}>
            {s.adjustPlan.actionBtn}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Recommend')}
          activeOpacity={0.7}
          style={{ alignItems: 'center', paddingVertical: 6 }}
        >
          <Text style={{ color: colors.primary, fontFamily: fontFamily.anuphan.semiBold, fontSize: 14 }}>
            {s.adjustPlan.recommendLink}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
