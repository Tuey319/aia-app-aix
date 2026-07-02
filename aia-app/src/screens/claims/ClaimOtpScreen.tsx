import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding } from '../../tokens';
import { primaryButtonShadow } from '../../tokens/shadows';
import { useStrings } from '../../i18n';

type Nav = NativeStackNavigationProp<any>;

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export function ClaimOtpScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const s = useStrings();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  function handleChange(text: string, index: number) {
    const clean = text.replace(/[^0-9]/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });
    if (clean && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(index: number, key: string) {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  const complete = digits.every((d) => d !== '');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBg }} edges={['top']}>
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
        <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.titleLg, color: colors.ink, flex: 1 }}>
          {s.claims.otpTitle}
        </Text>
      </View>

      <View style={{ paddingHorizontal: screenPadding, gap: 20 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.bodyMd, color: colors.textSecondary, lineHeight: 20 }}>
            {s.claims.otpDesc}
          </Text>
          <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: fontSize.caption, color: colors.textTertiary }}>
            xxx-xxx-4040 · cuxxxxxx@aia.com
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'space-between' }}>
          {digits.map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => { inputs.current[i] = ref; }}
              value={digit}
              onChangeText={(t) => handleChange(t, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              style={{
                width: 46,
                height: 54,
                borderRadius: radius.button,
                borderWidth: 1.5,
                borderColor: digit ? colors.primary : colors.hairline2,
                backgroundColor: colors.card,
                textAlign: 'center',
                fontFamily: fontFamily.jakarta.bold,
                fontSize: 20,
                color: colors.ink,
              }}
            />
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity disabled={secondsLeft > 0} onPress={() => setSecondsLeft(RESEND_SECONDS)}>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.medium,
                fontSize: fontSize.caption,
                color: secondsLeft > 0 ? colors.textTertiary : colors.primary,
              }}
            >
              {secondsLeft > 0 ? `${s.claims.otpResend} (${secondsLeft})` : s.claims.otpResend}
            </Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.caption, color: colors.textTertiary }}>
            {s.claims.otpRefLabel}: XXXXXX
          </Text>
        </View>
      </View>

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
          disabled={!complete}
          onPress={() => {
            navigation.navigate('ClaimSubmitting');
            setTimeout(() => navigation.navigate('ClaimSuccess'), 2500);
          }}
          style={{
            backgroundColor: complete ? colors.primary : colors.hairline2,
            borderRadius: radius.button,
            height: 52,
            alignItems: 'center',
            justifyContent: 'center',
            ...(complete ? primaryButtonShadow : {}),
          }}
        >
          <Text
            style={{
              color: complete ? colors.white : colors.textTertiary,
              fontFamily: fontFamily.anuphan.bold,
              fontSize: 16,
            }}
          >
            {s.claims.otpSendBtn}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
