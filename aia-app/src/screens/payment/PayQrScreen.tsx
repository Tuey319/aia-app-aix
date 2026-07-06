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
  cardGap,
} from '../../tokens';
import { cardShadow, primaryButtonShadow } from '../../tokens/shadows';
import { useStrings } from '../../i18n';
import { useAppStore } from '../../store';
import { AiaLogo } from '../../components/AiaLogo';

type Nav = NativeStackNavigationProp<any>;

/** Minimal fake QR grid rendered with Views */
function FakeQrCode() {
  const pattern = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1],
  ];
  const cell = 12;
  return (
    <View
      style={{
        backgroundColor: colors.white,
        padding: 10,
        borderRadius: 8,
        alignSelf: 'center',
        position: 'relative',
      }}
    >
      {pattern.map((row, ri) => (
        <View key={ri} style={{ flexDirection: 'row' }}>
          {row.map((v, ci) => (
            <View
              key={ci}
              style={{
                width: cell,
                height: cell,
                backgroundColor: v ? '#000000' : '#FFFFFF',
              }}
            />
          ))}
        </View>
      ))}
      {/* AIA label overlay in center */}
      <View
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [{ translateX: -16 }, { translateY: -16 }],
          backgroundColor: colors.white,
          borderRadius: 6,
          padding: 4,
        }}
      >
        <AiaLogo size={24} />
      </View>
    </View>
  );
}

export function PayQrScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
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
          paddingBottom: insets.bottom + 120,
          gap: cardGap,
        }}
      >
        {/* Title */}
        <Text
          style={{
            fontFamily: fontFamily.anuphan.bold,
            fontSize: fontSize.title,
            color: colors.ink,
            textAlign: 'center',
          }}
        >
          {s.payment.qrTitle}
        </Text>

        {/* Dark THAI QR banner */}
        <View
          style={{
            backgroundColor: '#1A2A4A',
            borderRadius: radius.card,
            paddingVertical: 12,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <MaterialIcons name="qr-code-2" size={22} color={colors.white} />
          <Text
            style={{
              fontFamily: fontFamily.jakarta.bold,
              fontSize: fontSize.bodyMd,
              color: colors.white,
              letterSpacing: 2,
            }}
          >
            THAI QR PAYMENT
          </Text>
        </View>

        {/* PromptPay label */}
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: radius.pill,
              paddingHorizontal: 14,
              paddingVertical: 5,
              borderWidth: 1,
              borderColor: colors.hairline2,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.jakarta.semiBold,
                fontSize: fontSize.caption,
                color: colors.inkBody2,
                letterSpacing: 0.5,
              }}
            >
              PromptPay
            </Text>
          </View>
        </View>

        {/* QR code centered */}
        <View style={{ alignItems: 'center' }}>
          <FakeQrCode />
          <Text
            style={{
              fontFamily: fontFamily.anuphan.semiBold,
              fontSize: fontSize.body,
              color: colors.textSecondary,
              marginTop: 10,
            }}
          >
            {language === 'en' ? 'Scan QR to pay' : 'สแกน QR เพื่อชำระเงิน'}
          </Text>
        </View>

        {/* Info rows card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            overflow: 'hidden',
            ...cardShadow,
          }}
        >
          {/* Amount row prominent */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 14,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.anuphan.regular,
                fontSize: fontSize.body,
                color: colors.textSecondary,
              }}
            >
              {language === 'en' ? 'Amount (THB)' : 'จำนวนเงิน (บาท)'}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.jakarta.bold,
                fontSize: 18,
                color: colors.ink,
                letterSpacing: -0.5,
              }}
            >
              17,380.00
            </Text>
          </View>

          {/* Info rows */}
          {[
            { label: language === 'en' ? 'Company' : 'บริษัท', value: 'AIA Thailand' },
            { label: language === 'en' ? 'Payer' : 'ผู้ชำระเงิน', value: 'Somchai Meethong' },
            { label: language === 'en' ? 'Reference No. (1/2)' : 'เลขที่อ้างอิง (1/2)', value: '92XXXXXXXX' },
            { label: language === 'en' ? 'Reference No. (2/2)' : 'เลขที่อ้างอิง (2/2)', value: '83XXXXX' },
          ].map((row, i) => (
            <View key={i}>
              <View style={{ height: 1, backgroundColor: colors.hairline, marginHorizontal: 16 }} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamily.anuphan.regular,
                    fontSize: fontSize.body,
                    color: colors.textSecondary,
                  }}
                >
                  {row.label}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.jakarta.medium,
                    fontSize: fontSize.body,
                    color: colors.ink2,
                  }}
                >
                  {row.value}
                </Text>
              </View>
            </View>
          ))}

          {/* Mobile banking note */}
          <View style={{ height: 1, backgroundColor: colors.hairline, marginHorizontal: 16 }} />
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <MaterialIcons name="smartphone" size={14} color={colors.textSecondary} />
            <Text
              style={{
                fontFamily: fontFamily.anuphan.regular,
                fontSize: fontSize.caption,
                color: colors.textSecondary,
              }}
            >
              Payvia mobile banking apps
            </Text>
          </View>
        </View>

        {/* Expiry */}
        <Text
          style={{
            fontFamily: fontFamily.anuphan.regular,
            fontSize: fontSize.caption,
            color: colors.textSecondary,
            textAlign: 'center',
          }}
        >
          {language === 'en' ? 'You must complete payment by 16 May 2025, 13:53.' : 'คุณต้องทำการชำระเงินใน 16 พ.ค. 2568, 13:53 น.'}
        </Text>

        {/* Disclaimer */}
        <Text
          style={{
            fontFamily: fontFamily.anuphan.regular,
            fontSize: fontSize.caption,
            color: colors.textTertiary,
            lineHeight: fontSize.caption * 1.6,
            textAlign: 'center',
          }}
        >
          {language === 'en'
            ? 'This QR Code is single-use and valid only until the time shown above. The company reserves the right to cancel the transaction if not confirmed within the specified time.'
            : 'QR Code นี้ใช้ได้เพียงครั้งเดียวและมีอายุตามที่ระบุด้านบน\n          บริษัทขอสงวนสิทธิ์ยกเลิกรายการหากไม่ได้รับการยืนยันภายในเวลาที่กำหนด'}
        </Text>
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
          flexDirection: 'row',
          gap: 10,
        }}
      >
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
          onPress={() => navigation.navigate('PaySuccess')}
          style={{
            flex: 2,
            height: 52,
            borderRadius: radius.button,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 6,
            ...primaryButtonShadow,
          }}
        >
          <MaterialIcons name="share" size={18} color={colors.white} />
          <Text
            style={{
              color: colors.white,
              fontFamily: fontFamily.anuphan.bold,
              fontSize: fontSize.title,
            }}
          >
            {language === 'en' ? 'Share Image' : 'แชร์รูปภาพ'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
