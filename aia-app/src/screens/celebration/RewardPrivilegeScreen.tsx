/**
 * Reward / Privilege Screen — shows rewards earned after milestone.
 * Delight Mak doc: Screen 4 "Reward / Privilege"
 * Shows: 5% discount, AIA Thank You 💌, +100 Vitality points
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
import { IllustrationGiftPremium } from '../../components/illustrations';
import { useAppStore } from '../../store';

type Nav = NativeStackNavigationProp<any>;

interface Reward {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
}

export function RewardPrivilegeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const language = useAppStore((state) => state.language);
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  const REWARDS: Reward[] = [
    {
      id: 'discount',
      icon: 'percent',
      iconBg: colors.primaryTint,
      iconColor: colors.primary,
      title: language === 'en' ? 'Premium Discount' : 'ส่วนลดเบี้ยประกัน',
      subtitle: language === 'en' ? 'For your next policy renewal' : 'สำหรับการต่ออายุกรมธรรม์ครั้งถัดไป',
      badge: '5% OFF',
      badgeBg: colors.primary,
      badgeText: '#fff',
    },
    {
      id: 'vitality',
      icon: 'favorite',
      iconBg: colors.successTint,
      iconColor: colors.success,
      title: language === 'en' ? 'AIA Vitality Bonus Points' : 'AIA Vitality คะแนนพิเศษ',
      subtitle: language === 'en' ? 'Points from Milestone Achievement' : 'คะแนนจาก Milestone Achievement',
      badge: '+100 pts',
      badgeBg: colors.success,
      badgeText: '#fff',
    },
    {
      id: 'letter',
      icon: 'mail',
      iconBg: '#FFF0F5',
      iconColor: '#E91E8C',
      title: 'AIA Thank You 💌',
      subtitle: language === 'en' ? 'Personal AI gratitude letter' : 'จดหมายขอบคุณส่วนตัวจาก AI',
      badge: language === 'en' ? 'New' : 'ใหม่',
      badgeBg: '#E91E8C',
      badgeText: '#fff',
    },
    {
      id: 'badge',
      icon: 'emoji-events',
      iconBg: colors.goldTint,
      iconColor: colors.gold,
      title: 'Always On Time Badge',
      subtitle: language === 'en' ? 'Badge for 6 consecutive on-time payments' : 'Badge สำหรับผู้ชำระตรงเวลา 6 งวด',
      badge: '🏅 Earned',
      badgeBg: colors.goldTint,
      badgeText: colors.gold,
    },
  ];

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: Platform.OS !== "web", bounciness: 10 }).start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBg }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: screenPadding, paddingTop: 12, paddingBottom: 16, gap: 8 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.ink} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 17, color: colors.ink }}>{language === 'en' ? 'Your Privileges' : 'สิทธิพิเศษของคุณ'}</Text>
          <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: colors.textSecondary }}>Reward & Privilege</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: screenPadding, paddingBottom: insets.bottom + 150, gap: cardGap }}>
        {/* Hero congratulation card */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <LinearGradient
            colors={['#FF2D6B', colors.primaryDeep]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: 20, padding: 20, alignItems: 'center', gap: 12 }}
          >
            <IllustrationGiftPremium width={200} height={200} />
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 22, color: '#fff', textAlign: 'center' }}>
                {language === 'en' ? 'You have earned privileges! 🎁' : 'คุณได้รับสิทธิพิเศษ! 🎁'}
              </Text>
              <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>
                {language === 'en' ? 'From your 12-instalment on-time Milestone' : 'จาก Milestone การชำระตรงเวลา 12 งวด'}
              </Text>
            </View>
            {/* 5% big highlight */}
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, paddingHorizontal: 24, paddingVertical: 10, flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
              <Text style={{ fontFamily: fontFamily.jakarta.extraBold, fontSize: 44, color: '#fff', letterSpacing: -1 }}>5</Text>
              <Text style={{ fontFamily: fontFamily.jakarta.bold, fontSize: 20, color: 'rgba(255,255,255,0.85)' }}>%</Text>
              <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: 13, color: 'rgba(255,255,255,0.65)', marginLeft: 4 }}>{language === 'en' ? 'premium discount' : 'ส่วนลดเบี้ย'}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Rewards list */}
        <Text style={{ fontFamily: fontFamily.jakarta.bold, fontSize: 12, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 2 }}>
          {language === 'en' ? 'All Rewards Received' : 'รางวัลทั้งหมดที่ได้รับ'}
        </Text>

        <View style={{ gap: 10 }}>
          {REWARDS.map((r) => (
            <TouchableOpacity key={r.id} activeOpacity={0.85}
              onPress={() => r.id === 'letter' ? navigation.navigate('GratitudeLetter') : r.id === 'badge' ? navigation.navigate('BadgeCollection') : undefined}
              style={{ backgroundColor: colors.card, borderRadius: radius.card, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, ...cardShadow }}>
              <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: r.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name={r.icon} size={24} color={r.iconColor} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 14, color: colors.ink2 }}>{r.title}</Text>
                <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 12, color: colors.textSecondary }}>{r.subtitle}</Text>
              </View>
              <View style={{ backgroundColor: r.badgeBg, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontFamily: fontFamily.jakarta.bold, fontSize: 11, color: r.badgeText }}>{r.badge}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Thank You teaser */}
        <TouchableOpacity onPress={() => navigation.navigate('GratitudeLetter')} activeOpacity={0.85}
          style={{ backgroundColor: '#FFF0F5', borderRadius: radius.card, padding: 18, gap: 10, borderWidth: 1, borderColor: '#FFD0E8' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialIcons name="mail" size={18} color={'#E91E8C'} />
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 14, color: '#B0003A' }}>
              AI Thank You 💌
            </Text>
          </View>
          <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 13, color: '#B0003A', lineHeight: 20 }}>
            {language === 'en'
              ? '"Thank you for trusting AIA for 12 months. Every time you pay on time, that is keeping a promise..."'
              : '"ขอบคุณที่ไว้วางใจ AIA มาตลอด 12 เดือน ทุกครั้งที่คุณชำระเบี้ยตรงเวลา นั่นคือการรักษาคำสัญญา..."'}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 12, color: '#E91E8C' }}>{language === 'en' ? 'Read full letter' : 'อ่านจดหมายทั้งหมด'}</Text>
            <MaterialIcons name="chevron-right" size={16} color={'#E91E8C'} />
          </View>
        </TouchableOpacity>

        {/* How to use the 5% */}
        <View style={{ backgroundColor: colors.card, borderRadius: radius.card, padding: 16, gap: 10, ...cardShadow }}>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 14, color: colors.ink2 }}>{language === 'en' ? 'How to use the 5% discount' : 'วิธีใช้ส่วนลด 5%'}</Text>
          {(language === 'en' ? [
            'The discount will be automatically deducted from your premium at the next renewal.',
            'Applicable to your AIA Health Happy policy.',
            'The discount is valid for 12 months from the date received.',
          ] : [
            'ส่วนลดจะถูกนำไปหักจากเบี้ยอัตโนมัติในรอบต่ออายุถัดไป',
            'ใช้ได้กับกรมธรรม์ AIA Health Happy ของคุณ',
            'ส่วนลดมีอายุ 12 เดือน นับจากวันที่ได้รับ',
          ]).map((t, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 }}>
                <Text style={{ fontFamily: fontFamily.jakarta.bold, fontSize: 10, color: colors.primary }}>{i + 1}</Text>
              </View>
              <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 13, color: colors.inkBody, flex: 1, lineHeight: 20 }}>{t}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.screenBg, paddingHorizontal: screenPadding, paddingTop: 12, paddingBottom: insets.bottom + 16, borderTopWidth: 1, borderTopColor: colors.hairline, gap: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate('SharePride')} activeOpacity={0.82}
          style={{ backgroundColor: colors.primary, borderRadius: radius.button, height: 52, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, ...primaryButtonShadow }}>
          <MaterialIcons name="share" size={18} color={colors.white} />
          <Text style={{ color: colors.white, fontFamily: fontFamily.anuphan.bold, fontSize: 16 }}>{language === 'en' ? 'Share Your Pride 🎉' : 'แชร์ความภาคภูมิใจ 🎉'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.popToTop()} activeOpacity={0.7}
          style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 13, color: colors.textSecondary }}>{language === 'en' ? 'Back to Home' : 'กลับหน้าหลัก'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
