import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  colors,
  fontFamily,
  fontSize,
  radius,
  screenPadding,
  cardShadow,
} from '../../tokens';
import { useAppStore } from '../../store';
import { useStrings } from '../../i18n';

type Nav = NativeStackNavigationProp<any>;

const COVERAGE_CATEGORIES = [
  { key: 'life' as const, icon: 'beach-access' as const, iconColor: '#7C5CE0', bg: '#EDE9FE', amount: '100,500,000' },
  { key: 'criticalIllnessEarly' as const, icon: 'favorite' as const, iconColor: '#E0527A', bg: '#FDE8EC', amount: '500,000' },
  { key: 'criticalIllnessSevere' as const, icon: 'medical-services' as const, iconColor: '#2E8FD9', bg: '#E3F1FC', amount: null },
  { key: 'accident' as const, icon: 'personal-injury' as const, iconColor: colors.amber, bg: colors.amberTint, amount: '150,000' },
  { key: 'dailyCompensation' as const, icon: 'event-note' as const, iconColor: colors.info, bg: colors.infoTint, amount: '2,000' },
];

const QUICK_ACTIONS = [
  { icon: 'location-on' as const, labelKey: 'qaChangeAddress' as const },
  { icon: 'download' as const, labelKey: 'qaDownloadDocs' as const },
  { icon: 'fact-check' as const, labelKey: 'qaTrackRequest' as const },
  { icon: 'support-agent' as const, labelKey: 'qaContactAgent' as const },
];

export function PolicyScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const policy = useAppStore((s) => s.selectedPolicy);
  const s = useStrings();

  return (
    <View style={{ flex: 1, backgroundColor: colors.screenBg }}>
      {/* ── Red header bar ───────────────────────────────────── */}
      <View style={{ backgroundColor: colors.primary, paddingTop: insets.top + 12, paddingBottom: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: screenPadding,
          }}
        >
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.titleLg, color: colors.white }}>
            {s.policy.yourPolicies}
          </Text>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="person" size={22} color={colors.white} />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: screenPadding,
          paddingTop: 16,
          paddingBottom: insets.bottom + 32,
          gap: 16,
        }}
      >
        {/* ── Coverage summary + view-all row ───────────────────── */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('PolicyDetail')}
            style={{
              flex: 1.4,
              backgroundColor: colors.card,
              borderRadius: radius.cardLg,
              padding: 14,
              gap: 6,
              ...cardShadow,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 11, color: colors.info }}>
                {s.policy.coverageSection}
              </Text>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: colors.primaryTint,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="check" size={13} color={colors.primary} />
              </View>
            </View>
            <Text
              style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 13, color: colors.ink, lineHeight: 18 }}
              numberOfLines={2}
            >
              {policy.name}
            </Text>
            <View style={{ gap: 1 }}>
              <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 10, color: colors.textSecondary }}>
                {s.policy.policyNoLabel}
              </Text>
              <Text style={{ fontFamily: fontFamily.mono.regular, fontSize: 12, color: colors.ink2 }}>
                {policy.policyNo}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AllPolicies')}
            style={{
              flex: 1,
              backgroundColor: colors.card,
              borderRadius: radius.cardLg,
              padding: 14,
              justifyContent: 'space-between',
              ...cardShadow,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: colors.primaryTint,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons name="shield" size={18} color={colors.primary} />
            </View>
            <View style={{ gap: 2 }}>
              <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 12, color: colors.ink2, lineHeight: 16 }}>
                {s.policy.viewAllPolicies}
              </Text>
              <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Quick actions row ─────────────────────────────────── */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.card,
            borderRadius: radius.cardLg,
            paddingVertical: 16,
            ...cardShadow,
          }}
        >
          {QUICK_ACTIONS.map((qa, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.75}
              onPress={qa.labelKey === 'qaDownloadDocs' ? () => navigation.navigate('PolicyDocs') : undefined}
              style={{ flex: 1, alignItems: 'center', gap: 8, paddingHorizontal: 4 }}
            >
              <MaterialIcons name={qa.icon} size={22} color={colors.primary} />
              <Text
                style={{
                  fontFamily: fontFamily.anuphan.medium,
                  fontSize: 10.5,
                  color: colors.inkBody2,
                  textAlign: 'center',
                  lineHeight: 14,
                }}
              >
                {s.policy[qa.labelKey]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Premium management card ───────────────────────────── */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('HomeTab' as any, { screen: 'PremiumMgmt' } as any)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: radius.cardLg,
            padding: 16,
            gap: 12,
            ...cardShadow,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 13,
              backgroundColor: colors.primaryTint,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="account-balance-wallet" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 14, color: colors.ink }}>
              {s.premiumMgmt.title}
            </Text>
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: colors.textSecondary }}>
              {s.policy.premiumMgmtCardSub}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        {/* ── Coverage overview list ────────────────────────────── */}
        <View>
          <Text
            style={{
              fontFamily: fontFamily.anuphan.bold,
              fontSize: 15,
              color: colors.ink,
              marginBottom: 10,
            }}
          >
            {s.policy.coverageOverview}
          </Text>
          <View style={{ backgroundColor: colors.card, borderRadius: radius.cardLg, overflow: 'hidden', ...cardShadow }}>
            {COVERAGE_CATEGORIES.map((cat, i) => (
              <TouchableOpacity
                key={cat.key}
                activeOpacity={0.75}
                onPress={() => navigation.navigate('CoverageDetail')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  gap: 12,
                  borderTopWidth: i > 0 ? 1 : 0,
                  borderTopColor: colors.hairline,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: cat.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialIcons name={cat.icon} size={18} color={cat.iconColor} />
                </View>
                <Text style={{ flex: 1, fontFamily: fontFamily.anuphan.semiBold, fontSize: 13, color: colors.ink2 }}>
                  {s.policy[cat.key]}
                </Text>
                <Text style={{ fontFamily: fontFamily.jakarta.semiBold, fontSize: 13, color: colors.ink2 }}>
                  {cat.amount ?? '-'}
                </Text>
                <MaterialIcons name="chevron-right" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
