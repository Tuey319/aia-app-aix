import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
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
  cardGap,
} from '../../tokens';
import { cardShadow, primaryButtonShadow } from '../../tokens/shadows';
import { useStrings } from '../../i18n';
import { useAppStore } from '../../store';

type Nav = NativeStackNavigationProp<any>;

export function PayCardScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [autoPaySelected, setAutoPaySelected] = useState<'yes' | 'no'>('yes');
  const s = useStrings();
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
        <Text
          style={{
            fontFamily: fontFamily.anuphan.bold,
            fontSize: fontSize.titleLg,
            color: colors.ink,
            flex: 1,
          }}
        >
          {language === 'en' ? 'Payment' : 'ชำระเงิน'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} hitSlop={16}>
          <MaterialIcons name="close" size={22} color={colors.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: screenPadding,
          paddingBottom: insets.bottom + 140,
          gap: cardGap,
        }}
      >
        {/* Section heading */}
        <View style={{ gap: 4 }}>
          <Text
            style={{
              fontFamily: fontFamily.anuphan.bold,
              fontSize: fontSize.title,
              color: colors.ink,
            }}
          >
            {language === 'en' ? 'Enter payment details' : 'กรอกข้อมูลการชำระเงินจำนวน'}
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.anuphan.regular,
              fontSize: fontSize.caption,
              color: colors.textSecondary,
            }}
          >
            {language === 'en' ? 'Accepts Visa, Mastercard and JCB only' : 'รับบัตรของแบบ Visa, Mastercard และ JCB เท่านั้น'}
          </Text>
        </View>

        {/* Card brand logos row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* VISA */}
          <View
            style={{
              backgroundColor: '#1A1F71',
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.jakarta.bold,
                fontSize: 14,
                color: colors.white,
                letterSpacing: 1,
              }}
            >
              VISA
            </Text>
          </View>
          {/* Mastercard */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#EB001B',
              }}
            />
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#F79E1B',
                marginLeft: -10,
                opacity: 0.92,
              }}
            />
          </View>
          {/* JCB */}
          <View
            style={{
              backgroundColor: '#003087',
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.jakarta.bold,
                fontSize: 14,
                color: colors.white,
                letterSpacing: 1,
              }}
            >
              JCB
            </Text>
          </View>
        </View>

        {/* Card form */}
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
              fontFamily: fontFamily.anuphan.bold,
              fontSize: fontSize.bodyMd,
              color: colors.ink,
              marginBottom: 2,
            }}
          >
            {language === 'en' ? 'Credit Card Details' : 'ข้อมูลบัตรเครดิต'}
          </Text>

          {/* Card number */}
          <View style={{ gap: 6 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.hairline2,
                borderRadius: radius.input,
                paddingHorizontal: 12,
                height: 48,
                gap: 8,
                backgroundColor: colors.screenBg,
              }}
            >
              <TextInput
                placeholder={language === 'en' ? 'Card Number' : 'เลขบัตรเครดิต'}
                placeholderTextColor={colors.textTertiary}
                keyboardType="numeric"
                maxLength={19}
                style={{
                  flex: 1,
                  fontFamily: fontFamily.jakarta.regular,
                  fontSize: fontSize.bodyMd,
                  color: colors.ink,
                }}
              />
              <MaterialIcons name="credit-card" size={20} color={colors.textTertiary} />
            </View>
          </View>

          {/* Expiry + CVV row */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: colors.hairline2,
                borderRadius: radius.input,
                paddingHorizontal: 12,
                height: 48,
                justifyContent: 'center',
                backgroundColor: colors.screenBg,
              }}
            >
              <TextInput
                placeholder={language === 'en' ? 'MM/YY' : 'วันที่หมดอายุ'}
                placeholderTextColor={colors.textTertiary}
                keyboardType="numeric"
                maxLength={5}
                style={{
                  fontFamily: fontFamily.jakarta.regular,
                  fontSize: fontSize.bodyMd,
                  color: colors.ink,
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: colors.hairline2,
                borderRadius: radius.input,
                paddingHorizontal: 12,
                height: 48,
                justifyContent: 'center',
                backgroundColor: colors.screenBg,
              }}
            >
              <TextInput
                placeholder={language === 'en' ? 'CVV' : 'เลขหลังบัตร'}
                placeholderTextColor={colors.textTertiary}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                style={{
                  fontFamily: fontFamily.jakarta.regular,
                  fontSize: fontSize.bodyMd,
                  color: colors.ink,
                }}
              />
            </View>
          </View>

          {/* Name on card */}
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.hairline2,
              borderRadius: radius.input,
              paddingHorizontal: 12,
              height: 48,
              justifyContent: 'center',
              backgroundColor: colors.screenBg,
            }}
          >
            <TextInput
              placeholder={language === 'en' ? 'Name on card (as printed)' : 'ชื่อ-นามสกุลตามที่ปรากฏบนบัตร (ภาษาอังกฤษ)'}
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="characters"
              style={{
                fontFamily: fontFamily.jakarta.regular,
                fontSize: fontSize.bodyMd,
                color: colors.ink,
              }}
            />
          </View>
        </View>

        {/* AutoPay section */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            padding: 16,
            gap: 14,
            ...cardShadow,
          }}
        >
          <View style={{ gap: 4 }}>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.bold,
                fontSize: fontSize.bodyMd,
                color: colors.ink,
              }}
            >
              {language === 'en' ? 'Auto-debit Service' : 'สมัครบริการหักบัญชีบัตรเครดิตอัตโนมัติ'}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.regular,
                fontSize: fontSize.caption,
                color: colors.textSecondary,
              }}
            >
              {language === 'en' ? 'Never miss a premium payment' : 'ไม่พลาดทุกกำหนดชำระเบี้ย'}
            </Text>
          </View>

          {/* Radio: สมัคร */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setAutoPaySelected('yes')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: autoPaySelected === 'yes' ? colors.primary : colors.textTertiary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {autoPaySelected === 'yes' && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: colors.primary,
                  }}
                />
              )}
            </View>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.medium,
                fontSize: fontSize.bodyMd,
                color: colors.ink,
              }}
            >
              {language === 'en' ? 'Enroll now' : 'สมัครบริการในบิลนี้'}
            </Text>
          </TouchableOpacity>

          {/* Radio: ไม่สมัคร */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setAutoPaySelected('no')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: autoPaySelected === 'no' ? colors.primary : colors.textTertiary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {autoPaySelected === 'no' && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: colors.primary,
                  }}
                />
              )}
            </View>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.medium,
                fontSize: fontSize.bodyMd,
                color: colors.inkBody2,
              }}
            >
              {language === 'en' ? 'Skip for now*' : 'ไม่ต้องการสมัครบริการ*'}
            </Text>
          </TouchableOpacity>

          {/* Disclaimer */}
          <Text
            style={{
              fontFamily: fontFamily.anuphan.regular,
              fontSize: fontSize.caption,
              color: colors.textTertiary,
              lineHeight: fontSize.caption * 1.6,
            }}
          >
            {language === 'en' ? '*Auto-debit enrollment requires CVV (3 digits on back of card) for identity verification. Takes effect from the next billing cycle.' : '*การสมัครบริการหักบัญชี (CVV) หรือหัก 3 หลักที่อยู่ด้านหลังบัตรเพื่อยืนยันตัวตน ผลในรอบบิล'}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom footer */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.screenBg,
          paddingHorizontal: screenPadding,
          paddingTop: 12,
          paddingBottom: insets.bottom + 16,
          borderTopWidth: 1,
          borderTopColor: colors.hairline,
          gap: 10,
        }}
      >
        {/* Amount summary */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: fontFamily.anuphan.regular,
              fontSize: fontSize.body,
              color: colors.textSecondary,
            }}
          >
            {language === 'en' ? 'Amount' : 'จำนวนเงิน'}
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.jakarta.bold,
              fontSize: 18,
              color: colors.primary,
              letterSpacing: -0.5,
            }}
          >
            {language === 'en' ? '฿17,380.00' : '17,380.00 บาท'}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => navigation.goBack()}
            style={{
              flex: 1,
              height: 52,
              borderRadius: radius.button,
              borderWidth: 1.5,
              borderColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: colors.primary,
                fontFamily: fontFamily.anuphan.bold,
                fontSize: fontSize.title,
              }}
            >
              {s.common.cancel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => {
              navigation.navigate('PayProcessing');
              setTimeout(() => navigation.navigate('PayChecking'), 1800);
            }}
            style={{
              flex: 2,
              height: 52,
              borderRadius: radius.button,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              ...primaryButtonShadow,
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontFamily: fontFamily.anuphan.bold,
                fontSize: fontSize.title,
              }}
            >
              {s.payment.pay}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
