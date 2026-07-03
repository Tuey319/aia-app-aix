import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { colors, fontFamily, radius, screenPadding, cardGap } from '../../tokens';
import { cardShadow, primaryButtonShadow } from '../../tokens/shadows';
import { StatusPill } from '../../components/StatusPill';
import { SectionGroup } from '../../components/SectionGroup';
import { ListRow } from '../../components/ListRow';
import { useAppStore } from '../../store';
import { useStrings } from '../../i18n';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'PremiumMgmt'>;

export function PremiumMgmtScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const policy = useAppStore((s) => s.selectedPolicy);
  const income = useAppStore((s) => s.income);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const s = useStrings();

  const pctOfIncome = ((policy.monthlyPremium * 12) / (income * 12) * 100).toFixed(0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.screenBg }}>
      {/* Red header bar — matches Policy section theme */}
      <View style={{ backgroundColor: colors.primary, paddingTop: insets.top + 12, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: screenPadding, gap: 8 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}>
            <MaterialIcons name="arrow-back-ios" size={20} color={colors.white} />
          </TouchableOpacity>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 17, color: colors.white, flex: 1 }}>
            {s.premiumMgmt.title}
          </Text>

          {/* Language toggle */}
          <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.pill, padding: 3, gap: 2 }}>
            <TouchableOpacity
              onPress={() => setLanguage('th')}
              style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: language === 'th' ? colors.white : 'transparent' }}
            >
              <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 12, color: language === 'th' ? colors.primary : 'rgba(255,255,255,0.75)' }}>
                ไทย
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLanguage('en')}
              style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: language === 'en' ? colors.white : 'transparent' }}
            >
              <Text style={{ fontFamily: fontFamily.jakarta.semiBold, fontSize: 12, color: language === 'en' ? colors.primary : 'rgba(255,255,255,0.75)' }}>
                EN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: screenPadding, paddingTop: 16, paddingBottom: insets.bottom + 32, gap: cardGap }}>
        {/* 1. Primary Payment Card */}
        <View style={{ backgroundColor: colors.card, borderRadius: radius.cardLg, padding: 18, gap: 12, ...cardShadow }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: 13, color: colors.textSecondary }}>{s.premiumMgmt.nextDue}</Text>
            <StatusPill label={`${s.premiumMgmt.dueLabel} ${policy.dueDate}`} variant="amber" />
          </View>
          <View>
            <Text style={{ fontFamily: fontFamily.jakarta.extraBold, fontSize: 40, color: colors.ink, letterSpacing: -1.2, lineHeight: 44 }}>
              ฿{policy.monthlyPremium.toLocaleString('en-US')}
              <Text style={{ fontFamily: fontFamily.jakarta.regular, fontSize: 16, color: colors.textSecondary, letterSpacing: 0 }}>.00</Text>
            </Text>
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
              {policy.nameTh} · {s.premiumMgmt.billingMonthly} · {s.premiumMgmt.annualPremiumLabel} ฿{policy.annualPremium.toLocaleString('en-US')}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('PaySelect')} activeOpacity={0.82}
            style={{ backgroundColor: colors.primary, borderRadius: radius.button, height: 50, alignItems: 'center', justifyContent: 'center', ...primaryButtonShadow }}>
            <Text style={{ color: colors.white, fontFamily: fontFamily.anuphan.bold, fontSize: 16 }}>{s.premiumMgmt.payBtn}</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Financial Health Row */}
        <TouchableOpacity onPress={() => navigation.navigate('Affordability')} activeOpacity={0.85}
          style={{ backgroundColor: colors.card, borderRadius: 16, ...cardShadow }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.successTint, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="sentiment-satisfied" size={22} color={colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 14, color: colors.ink2, marginBottom: 2 }}>
                {s.premiumMgmt.healthLabel} · <Text style={{ color: colors.success }}>{s.premiumMgmt.healthStatus}</Text>
              </Text>
              <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 12, color: colors.textSecondary }}>
                {s.premiumMgmt.healthSub(pctOfIncome)}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textTertiary} />
          </View>
        </TouchableOpacity>

        {/* 3. Understand group */}
        <SectionGroup label={s.premiumMgmt.groupUnderstand}>
          <ListRow icon="verified-user" title={s.premiumMgmt.rowValue}
            subtitle={s.premiumMgmt.rowValueSub('148k', `${(policy.sumAssured / 1000000).toFixed(0)}M`)}
            onPress={() => navigation.navigate('Value')} />
          <ListRow icon="description" title={s.premiumMgmt.rowIllustration}
            subtitle={s.premiumMgmt.rowIllustrationSub}
            onPress={() => navigation.navigate('Illustration')} />
        </SectionGroup>

        {/* 4. Adjust group */}
        <SectionGroup label={s.premiumMgmt.groupAdjust}>
          <ListRow icon="tune" title={s.premiumMgmt.rowAdjustPlan} subtitle={s.premiumMgmt.rowAdjustPlanSub} onPress={() => navigation.navigate('CoverageOverview')} />
          <ListRow icon="show-chart" title={s.premiumMgmt.rowCosts} subtitle={s.premiumMgmt.rowCostsSub} onPress={() => navigation.navigate('Costs')} />
          <ListRow icon="auto-awesome" title={s.premiumMgmt.rowRecommend} subtitle={s.premiumMgmt.rowRecommendSub} onPress={() => navigation.navigate('Recommend')} badge={s.premiumMgmt.badgeNew} />
        </SectionGroup>

        {/* 5. History group */}
        <SectionGroup label={s.premiumMgmt.groupHistory}>
          <ListRow icon="receipt-long" title={s.premiumMgmt.rowHistory} subtitle={s.premiumMgmt.rowHistorySub} onPress={() => navigation.navigate('History')} />
        </SectionGroup>
      </ScrollView>
    </View>
  );
}
