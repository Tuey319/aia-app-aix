import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding, cardShadow } from '../../tokens';
import { SpinnerArc } from '../../components/SpinnerArc';
import { useStrings } from '../../i18n';
import { useAppStore } from '../../store';

type Nav = NativeStackNavigationProp<any>;

const POLICIES = [
  {
    id: '1',
    icon: 'umbrella-outline' as const,
    nameTh: 'เอไอเอ ตลอดชีพ ชำระเบี้ยประกันภัย 20 ปี (ไม่มีเงินปันผล)',
    nameEn: 'AIA Whole Life 20-Year Payment (No Dividend)',
    policyNo: 'TXXXXXXXXXX',
    sumAssured: '3,100,200.00',
    dateTh: '1 ต.ค. 2565',
    dateEn: '1 Oct 2022',
    insuredTh: 'นิตย์xxxx รัตนxxxxxxx',
    insuredEn: 'Nit xxxx Ratxxxxxxx',
  },
  {
    id: '2',
    icon: 'chart-line' as const,
    nameTh: 'เอไอเอ อิสระ พลัส (ยูนิต ลิงค์)',
    nameEn: 'AIA Issara Plus (Unit Linked)',
    policyNo: 'UXXXXXXXXXX',
    sumAssured: '3,100,200.00',
    dateTh: '1 ต.ค. 2565',
    dateEn: '1 Oct 2022',
    insuredTh: 'นิตย์xxxx รัตนxxxxxxx',
    insuredEn: 'Nit xxxx Ratxxxxxxx',
  },
];

export function AllPoliciesScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const s = useStrings();
  const language = useAppStore((state) => state.language);
  const [tab, setTab] = useState<'active' | 'expired'>('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.screenBg }}>
      <View style={{ backgroundColor: colors.primary, paddingTop: insets.top + 12, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: screenPadding, gap: 8 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}>
            <MaterialIcons name="arrow-back-ios" size={20} color={colors.white} />
          </TouchableOpacity>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.titleLg, color: colors.white, flex: 1 }}>
            {s.policy.allPoliciesTitle}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', paddingHorizontal: screenPadding, paddingTop: 16, gap: 24, borderBottomWidth: 1, borderBottomColor: colors.hairline2 }}>
        {(['active', 'expired'] as const).map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={{ paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: tab === t ? colors.primary : 'transparent' }}>
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.bodyMd, color: tab === t ? colors.primary : colors.textSecondary }}>
              {t === 'active' ? `${s.policy.activeTab} (${POLICIES.length})` : s.policy.expiredTab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: screenPadding, paddingVertical: 14 }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.hairline2, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.card }}>
          <MaterialIcons name="filter-list" size={16} color={colors.ink2} />
          <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 12.5, color: colors.ink2 }}>{s.policy.filterBtn}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.hairline2, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.card }}>
          <MaterialIcons name="swap-vert" size={16} color={colors.ink2} />
          <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 12.5, color: colors.ink2 }}>{s.policy.sortBtn}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: screenPadding, paddingBottom: insets.bottom + 32, gap: 12 }}
      >
        {loading ? (
          <View style={{ alignItems: 'center', paddingTop: 72, gap: 12 }}>
            <SpinnerArc size={40} color={colors.primary} thickness={3} />
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.bodyMd, color: colors.textSecondary }}>
              {s.common.loadingPolicies}
            </Text>
          </View>
        ) : tab === 'active' ? (
          POLICIES.map((p) => (
            <TouchableOpacity
              key={p.id}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('PolicyDetail')}
              style={{ backgroundColor: colors.card, borderRadius: radius.cardLg, padding: 16, gap: 8, ...cardShadow }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <MaterialCommunityIcons name={p.icon} size={22} color={colors.primary} style={{ marginTop: 2 }} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 11, color: colors.primary }}>
                    {s.policy.coverageSection}
                  </Text>
                  <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 13, color: colors.ink, lineHeight: 18 }}>
                    {language === 'en' ? p.nameEn : p.nameTh}
                  </Text>
                </View>
              </View>
              <View style={{ height: 1, backgroundColor: colors.hairline2, marginVertical: 2 }} />
              <InfoRow label={s.policy.policyNoLabel} value={p.policyNo} mono />
              <InfoRow label={s.policy.sumAssuredLabel} value={language === 'en' ? `฿${p.sumAssured}` : `${p.sumAssured} บาท`} />
              <InfoRow label={s.policy.policyDateLabel} value={language === 'en' ? p.dateEn : p.dateTh} />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.caption, color: colors.textSecondary }}>
                  {s.policy.statusLabel}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />
                  <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: fontSize.caption, color: colors.successDeep }}>
                    {s.policy.statusActive}
                  </Text>
                </View>
              </View>
              <InfoRow label={s.policy.insuredPerson} value={language === 'en' ? p.insuredEn : p.insuredTh} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={{ alignItems: 'center', paddingTop: 60, gap: 10 }}>
            <MaterialIcons name="inbox" size={40} color={colors.textTertiary} />
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.bodyMd, color: colors.textSecondary }}>
              {s.policy.expiredTab}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.caption, color: colors.textSecondary }}>
        {label}
      </Text>
      <Text style={{ fontFamily: mono ? fontFamily.mono.regular : fontFamily.anuphan.medium, fontSize: fontSize.caption, color: colors.ink2 }}>
        {value}
      </Text>
    </View>
  );
}
