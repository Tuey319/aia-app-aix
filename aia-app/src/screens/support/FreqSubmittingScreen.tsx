import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SpinnerArc } from '../../components/SpinnerArc';
import { colors, fontFamily, screenPadding } from '../../tokens';
import { useAppStore } from '../../store';

export function FreqSubmittingScreen() {
  const language = useAppStore((state) => state.language);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    }).start();
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBg }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: screenPadding, gap: 24 }}>
        <SpinnerArc size={64} color={colors.primary} thickness={3.5} />
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 20, color: colors.ink, textAlign: 'center' }}>
            {language === 'en' ? 'Updating your payment frequency...' : 'กำลังเปลี่ยนงวดการชำระเบี้ยฯ'}
          </Text>
          <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 21 }}>
            {language === 'en' ? 'This will only take a moment' : 'ระบบกำลังดำเนินการ กรุณารอสักครู่'}
          </Text>
        </View>
        <View style={{ width: '100%', maxWidth: 240 }}>
          <View style={{ height: 4, backgroundColor: colors.hairline2, borderRadius: 2, overflow: 'hidden' }}>
            <Animated.View style={{ height: 4, width: barWidth, backgroundColor: colors.primary, borderRadius: 2 }} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
