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
  cardPadding,
} from '../../tokens';
import { cardShadow } from '../../tokens/shadows';
import { StatusPill } from '../../components/StatusPill';
import { useStrings } from '../../i18n';
import { useAppStore } from '../../store';

type Nav = NativeStackNavigationProp<any>;

export function ClaimSuccessScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const s = useStrings();
  const language = useAppStore((state) => state.language);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBg }} edges={['top', 'bottom']}>
      {/* Top-right close button */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: screenPadding,
          paddingTop: 12,
          paddingBottom: 8,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate('ClaimStart')} hitSlop={16}>
          <MaterialIcons name="close" size={24} color={colors.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: screenPadding,
          paddingBottom: insets.bottom + 32,
          alignItems: 'center',
          gap: 20,
          paddingTop: 24,
        }}
      >
        {/* Success Icon */}
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: colors.successTint,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name="check-circle" size={42} color={colors.success} />
        </View>

        {/* Title */}
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text
            style={{
              fontFamily: fontFamily.anuphan.bold,
              fontSize: 22,
              color: colors.ink,
            }}
          >
            {s.claims.successTitle}
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.anuphan.regular,
              fontSize: fontSize.bodyMd,
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            {s.claims.successSub}
          </Text>
        </View>

        {/* Reference Card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            padding: cardPadding,
            gap: 14,
            width: '100%',
            ...cardShadow,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.regular,
                fontSize: fontSize.caption,
                color: colors.textSecondary,
              }}
            >
              {language === 'en' ? 'Claim Reference' : 'เลขที่อ้างอิงเคลม'}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.mono.semiBold,
                fontSize: fontSize.bodyMd,
                color: colors.ink,
                letterSpacing: 0.5,
              }}
            >
              E0053728
            </Text>
          </View>

          <View
            style={{ height: 1, backgroundColor: colors.hairline2 }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.regular,
                fontSize: fontSize.caption,
                color: colors.textSecondary,
              }}
            >
              {language === 'en' ? 'Amount Claimed' : 'จำนวนที่เคลม'}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.jakarta.bold,
                fontSize: 17,
                color: colors.ink,
              }}
            >
              ฿3,200.00
            </Text>
          </View>

          <View
            style={{ height: 1, backgroundColor: colors.hairline2 }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.regular,
                fontSize: fontSize.caption,
                color: colors.textSecondary,
              }}
            >
              {s.claims.transactionDate}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.medium,
                fontSize: fontSize.bodyMd,
                color: colors.ink2,
              }}
            >
              {new Date().toLocaleDateString(language === 'en' ? 'en-GB' : 'th-TH', { day: '2-digit', month: 'short', year: 'numeric' })}
              {', '}
              {new Date().toLocaleTimeString(language === 'en' ? 'en-GB' : 'th-TH', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>

          <View
            style={{ height: 1, backgroundColor: colors.hairline2 }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.regular,
                fontSize: fontSize.caption,
                color: colors.textSecondary,
              }}
            >
              {language === 'en' ? 'Status' : 'สถานะ'}
            </Text>
            <StatusPill
              label={language === 'en' ? 'AIA Processing' : 'AIA กำลังดำเนินการ'}
              variant="amber"
            />
          </View>
        </View>

        {/* Track History Link */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ClaimHistory')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
        >
          <Text
            style={{
              fontFamily: fontFamily.anuphan.medium,
              fontSize: fontSize.bodyMd,
              color: colors.primary,
            }}
          >
            {s.claims.trackLink}
          </Text>
          <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Done Button */}
      <View
        style={{
          paddingHorizontal: screenPadding,
          paddingBottom: insets.bottom + 16,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: colors.hairline2,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Home')}
          style={{
            backgroundColor: colors.ink2,
            borderRadius: radius.button,
            height: 52,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontFamily: fontFamily.anuphan.bold,
              fontSize: 16,
            }}
          >
            {s.common.done}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
