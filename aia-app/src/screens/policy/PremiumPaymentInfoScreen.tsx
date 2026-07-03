import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding, cardShadow } from '../../tokens';
import { primaryButtonShadow } from '../../tokens/shadows';
import { SpinnerArc } from '../../components/SpinnerArc';
import { useStrings } from '../../i18n';

type Nav = NativeStackNavigationProp<any>;

export function PremiumPaymentInfoScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const s = useStrings();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.screenBg }}>
        <View style={{ backgroundColor: colors.primary, paddingTop: insets.top + 12, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: screenPadding, gap: 8 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}>
              <MaterialIcons name="arrow-back-ios" size={20} color={colors.white} />
            </TouchableOpacity>
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.titleLg, color: colors.white, flex: 1 }}>
              {s.policy.paymentInfoTitle}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <SpinnerArc size={40} color={colors.primary} thickness={3} />
          <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.bodyMd, color: colors.textSecondary }}>
            {s.common.loadingPaymentInfo}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.screenBg }}>
      <View style={{ backgroundColor: colors.primary, paddingTop: insets.top + 12, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: screenPadding, gap: 8 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}>
            <MaterialIcons name="arrow-back-ios" size={20} color={colors.white} />
          </TouchableOpacity>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.titleLg, color: colors.white, flex: 1 }}>
            {s.policy.paymentInfoTitle}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: screenPadding, paddingTop: 16, paddingBottom: insets.bottom + 100, gap: 16 }}
      >
        <View style={{ backgroundColor: colors.card, borderRadius: radius.cardLg, padding: 16, gap: 12, ...cardShadow }}>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 14, color: colors.ink }}>
            {s.policy.paymentInfoSection}
          </Text>
          <InfoRow label={s.policy.freqLabel} value="รายปี" />
          <InfoRow label={s.policy.nextDueDateLabel} value="14 ธ.ค. 2565" />
          <InfoRow label={s.policy.premiumDueLabel} value="60,000.00 บาท" bold />
          <InfoRow label={s.policy.paymentMethodLabel} value={s.policy.selfPay} />
        </View>

        <View style={{ backgroundColor: colors.card, borderRadius: radius.cardLg, padding: 16, gap: 12, ...cardShadow }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 14, color: colors.ink }}>
              {s.policy.lastPaymentSection}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('HomeTab' as any, { screen: 'History' } as any)}>
              <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 12, color: colors.primary }}>
                {s.home.viewAll}
              </Text>
            </TouchableOpacity>
          </View>
          <InfoRow label={s.policy.lastPaymentDateLabel} value="14 ธ.ค. 2565" />
          <InfoRow label={s.policy.paymentAmountLabel} value="2,500.55 บาท" />
          <InfoRow label={s.policy.paymentMethodLabel} value={s.payment.creditCard} />
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: screenPadding,
          paddingBottom: insets.bottom + 16,
          paddingTop: 12,
          backgroundColor: colors.screenBg,
          borderTopWidth: 1,
          borderTopColor: colors.hairline2,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ChangeFreq')}
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
            {s.policy.changeFreqBtn}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InfoRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.caption, color: colors.textSecondary }}>
        {label}
      </Text>
      <Text
        style={{
          fontFamily: bold ? fontFamily.jakarta.bold : fontFamily.anuphan.medium,
          fontSize: bold ? fontSize.bodyMd : fontSize.caption,
          color: colors.ink2,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
