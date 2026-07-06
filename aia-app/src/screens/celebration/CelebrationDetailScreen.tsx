/**
 * Celebration Detail — full detail screen after milestone.
 * Shows AI chat, payment trend graph, milestone info, CTA to rewards.
 * Delight Mak doc: Screen 3 "ตัวอย่างหน้า AI Celebration"
 */
import React, { useRef, useEffect } from 'react';
import { View, Platform, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding, cardGap } from '../../tokens';
import { cardShadow, primaryButtonShadow } from '../../tokens/shadows';

import { BarChart } from '../../components/BarChart';
import { useAppStore } from '../../store';

type Nav = NativeStackNavigationProp<any>;

function getPaymentHistory(language: string) {
  const labels = language === 'en'
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    : ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'];
  return labels.map((label, i) => ({
    label,
    value: 4250,
    color: i === labels.length - 1 ? colors.primary : colors.primaryTintDark,
    isLast: i === labels.length - 1,
  }));
}

interface ChatBubble {
  from: 'ai' | 'user';
  text: string;
  delay: number;
}

const CHAT: ChatBubble[] = [
  { from: 'ai', text: 'สวัสดีคุณสมชาย! 🎉 วันนี้คุณชำระเบี้ยครบ 12 งวดแล้ว', delay: 0 },
  { from: 'user', text: 'ใช่ค่ะ รู้สึกดีมากเลย!', delay: 400 },
  { from: 'ai', text: 'คุณคือ "Always On Time" ไม่เคยขาดสักงวด 🏆\nAIA ภูมิใจที่ได้ดูแลคุณมาตลอด ❤️', delay: 800 },
];

function ChatMessage({ bubble, index }: { bubble: ChatBubble; index: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: Platform.OS !== "web" }),
        Animated.timing(translateY, { toValue: 0, duration: 350, useNativeDriver: Platform.OS !== "web" }),
      ]).start();
    }, bubble.delay + index * 100);
    return () => clearTimeout(timer);
  }, []);

  const isAI = bubble.from === 'ai';
  return (
    <Animated.View style={{ opacity, transform: [{ translateY }], flexDirection: 'row', justifyContent: isAI ? 'flex-start' : 'flex-end', marginBottom: 10 }}>
      {isAI && (
        <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 8, flexShrink: 0, marginTop: 2 }}>
          <MaterialIcons name="smart-toy" size={16} color={colors.white} />
        </View>
      )}
      <View style={{
        maxWidth: '75%',
        backgroundColor: isAI ? colors.card : colors.primary,
        borderRadius: 14,
        borderBottomLeftRadius: isAI ? 4 : 14,
        borderBottomRightRadius: isAI ? 14 : 4,
        paddingHorizontal: 13,
        paddingVertical: 9,
        ...cardShadow,
      }}>
        <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.body, color: isAI ? colors.inkBody : colors.white, lineHeight: 20 }}>
          {bubble.text}
        </Text>
      </View>
    </Animated.View>
  );
}

export function CelebrationDetailScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const language = useAppStore((state) => state.language);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBg }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: screenPadding, paddingTop: 12, paddingBottom: 16, gap: 8 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.ink} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 17, color: colors.ink }}>{language === 'en' ? 'Celebration Details' : 'รายละเอียดการฉลอง'}</Text>
          <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: colors.textSecondary }}>AI Celebration Detail</Text>
        </View>
        
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: screenPadding, paddingBottom: insets.bottom + 150, gap: cardGap }}>
        {/* Milestone hero */}
        <View style={{ borderRadius: radius.cardLg, overflow: 'hidden' }}>
          <LinearGradient colors={[colors.primary, '#7A0029']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ padding: 22, alignItems: 'center', gap: 14 }}>
            {/* Decorative glow accents */}
            <View style={{ position: 'absolute', top: -50, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)' }} />
            <View style={{ position: 'absolute', bottom: -60, left: -40, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.05)' }} />

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,205,90,0.18)', borderRadius: 99, paddingHorizontal: 14, paddingVertical: 6 }}>
              <MaterialIcons name="military-tech" size={14} color={colors.gold} />
              <Text style={{ fontFamily: fontFamily.mono.semiBold, fontSize: 10, color: colors.gold, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Milestone Reached
              </Text>
            </View>
            <Text style={{ fontFamily: fontFamily.jakarta.extraBold, fontSize: 42, color: '#fff', letterSpacing: -1 }}>
              {language === 'en' ? '12 payments' : '12 งวด'}
            </Text>
            <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
              {language === 'en' ? 'Consistently on time · Never a late fee' : 'ชำระตรงเวลาต่อเนื่อง · ไม่มีค่าปรับสักครั้ง'}
            </Text>

            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 14, width: '100%' }}>
              <View style={{ flex: 1, alignItems: 'center', paddingVertical: 14, gap: 4 }}>
                <MaterialIcons name="account-balance-wallet" size={16} color="rgba(255,255,255,0.7)" />
                <Text style={{ fontFamily: fontFamily.jakarta.bold, fontSize: 18, color: '#fff' }}>฿25,500</Text>
                <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>{language === 'en' ? 'Paid' : 'ชำระแล้ว'}</Text>
              </View>
              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.15)' }} />
              <View style={{ flex: 1, alignItems: 'center', paddingVertical: 14, gap: 4 }}>
                <MaterialIcons name="verified-user" size={16} color="rgba(255,255,255,0.7)" />
                <Text style={{ fontFamily: fontFamily.jakarta.bold, fontSize: 18, color: '#fff' }}>฿2.0M</Text>
                <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>{language === 'en' ? 'Coverage active' : 'คุ้มครองอยู่'}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* AI Chat */}
        <View style={{ backgroundColor: colors.screenBg }}>
          <Text style={{ fontFamily: fontFamily.jakarta.bold, fontSize: 11, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12, marginLeft: 2 }}>
            {language === 'en' ? 'AI says...' : 'AI บอกว่า...'}
          </Text>
          {CHAT.map((b, i) => <ChatMessage key={i} bubble={b} index={i} />)}
        </View>

        {/* Payment trend chart */}
        <View style={{ backgroundColor: colors.card, borderRadius: radius.card, padding: 18, gap: 12, ...cardShadow }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 14, color: colors.ink2 }}>{language === 'en' ? 'Payment Trend' : 'แนวโน้มการชำระ'}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success }} />
              <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: colors.success }}>{language === 'en' ? 'On time every instalment' : 'ตรงเวลาทุกงวด'}</Text>
            </View>
          </View>
          <BarChart data={getPaymentHistory(language)} height={80} formatValue={(v) => `฿${(v / 1000).toFixed(1)}k`} labelColor={colors.primary} />
        </View>

        {/* Protection value */}
        <View style={{ backgroundColor: colors.successTint, borderRadius: radius.card, padding: 16, gap: 8, borderWidth: 1, borderColor: colors.success + '30' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialIcons name="shield" size={18} color={colors.success} />
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 14, color: colors.successDeep }}>
              {language === 'en' ? 'Thank you for trusting AIA 🛡️' : 'ขอบคุณที่ไว้วางใจ AIA 🛡️'}
            </Text>
          </View>
          <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 13, color: colors.success, lineHeight: 20 }}>
            {language === 'en'
              ? 'Every baht you pay = ฿784 coverage per ฿1 paid\nYou and your family have been protected for 12 months ❤️'
              : `ทุกบาทที่คุณชำระ = ความคุ้มครอง ฿784 ต่อ ฿1 ที่จ่าย\nคุณและครอบครัวปลอดภัยตลอด 12 เดือนที่ผ่านมา ❤️`}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.screenBg, paddingHorizontal: screenPadding, paddingTop: 12, paddingBottom: insets.bottom + 16, borderTopWidth: 1, borderTopColor: colors.hairline, gap: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate('RewardPrivilege')} activeOpacity={0.82}
          style={{ backgroundColor: colors.primary, borderRadius: radius.button, height: 52, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, ...primaryButtonShadow }}>
          <MaterialIcons name="card-giftcard" size={18} color={colors.white} />
          <Text style={{ color: colors.white, fontFamily: fontFamily.anuphan.bold, fontSize: 16 }}>{language === 'en' ? 'View Your Privileges 🎁' : 'ดูสิทธิพิเศษของคุณ 🎁'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SharePride')} activeOpacity={0.7}
          style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 13, color: colors.primary }}>{language === 'en' ? 'Share your pride →' : 'แชร์ความภาคภูมิใจ →'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
