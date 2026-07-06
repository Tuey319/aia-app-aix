import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding, cardShadow } from '../../tokens';
import { StatusPill } from '../../components/StatusPill';
import { useStrings } from '../../i18n';
import { useAppStore } from '../../store';

type Nav = NativeStackNavigationProp<any>;

export function PolicyDetailScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const policy = useAppStore((s) => s.selectedPolicy);
  const s = useStrings();
  const language = useAppStore((state) => state.language);

  const QUICK_ACTIONS = [
    { icon: 'receipt-long' as const, label: s.policy.premiumPaymentQa, onPress: () => navigation.navigate('PremiumPaymentInfo') },
    // PremiumMgmt lives in HomeStack, not PolicyStack -- reached cross-tab via the tab navigator.
    { icon: 'trending-up' as const, label: s.policy.policyValueQa, onPress: () => navigation.navigate('HomeTab' as any, { screen: 'PremiumMgmt' } as any) },
    { icon: 'description' as const, label: s.policy.changeContractQa, onPress: () => {} },
    { icon: 'download' as const, label: s.policy.documents, onPress: () => navigation.navigate('PolicyDocs') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.screenBg }}>
      <View style={{ backgroundColor: colors.primary, paddingTop: insets.top + 12, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: screenPadding, gap: 8 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}>
            <MaterialIcons name="arrow-back-ios" size={20} color={colors.white} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.bodyMd, color: colors.white }}>
              {s.policy.policyDetailTitle}
            </Text>
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>
              {s.policy.policyNoLabel}: {policy.policyNo}
            </Text>
          </View>
          <MaterialIcons name="help-outline" size={20} color={colors.white} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: screenPadding, paddingTop: 16, paddingBottom: insets.bottom + 32, gap: 16 }}
      >
        <View style={{ backgroundColor: colors.card, borderRadius: radius.cardLg, padding: 16, gap: 10, ...cardShadow }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 11, color: colors.info }}>
              {s.policy.coverageSection}
            </Text>
            <StatusPill label={s.policy.statusActive} variant="success" />
          </View>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 15, color: colors.ink, lineHeight: 20 }}>
            {policy.name}
          </Text>

          <View style={{ height: 1, backgroundColor: colors.hairline2, marginVertical: 2 }} />

          <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 12, color: colors.textSecondary, marginBottom: 2 }}>
            {language === 'en' ? 'Policy & Coverage Information' : 'ข้อมูลกรมธรรม์และความคุ้มครอง'}
          </Text>
          <DetailRow label={s.policy.insuredPerson} value={language === 'en' ? 'Nit xxxx Ratxxxxxxx' : 'นิตย์xxxx รัตนxxxxxxx'} />
          <DetailRow label={s.policy.policyOwnerLabel} value={language === 'en' ? 'Som xxxx Ratxxxxxxx' : 'สมxxxx รัตนxxxxxxx'} />
          <DetailRow label={s.policy.policyNoLabel} value={policy.policyNo} mono />
          <DetailRow label={s.policy.sumAssuredLabel} value={language === 'en' ? '฿3,100,200.00' : '3,100,200.00 บาท'} />

          <TouchableOpacity
            activeOpacity={0.75}
            style={{
              marginTop: 6,
              borderWidth: 1.5,
              borderColor: colors.primary,
              borderRadius: radius.pill,
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 13, color: colors.primary }}>
              {s.policy.viewPolicyDetailBtn}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: colors.card, borderRadius: radius.cardLg, paddingVertical: 8, ...cardShadow }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {QUICK_ACTIONS.map((qa, i) => (
              <TouchableOpacity
                key={i}
                onPress={qa.onPress}
                activeOpacity={0.75}
                style={{ width: '50%', alignItems: 'center', paddingVertical: 16, gap: 8 }}
              >
                <MaterialIcons name={qa.icon} size={24} color={colors.primary} />
                <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 12, color: colors.inkBody2, textAlign: 'center' }}>
                  {qa.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.caption, color: colors.textSecondary }}>
        {label}
      </Text>
      <Text style={{ fontFamily: mono ? fontFamily.mono.regular : fontFamily.jakarta.semiBold, fontSize: fontSize.caption, color: colors.ink2 }}>
        {value}
      </Text>
    </View>
  );
}
