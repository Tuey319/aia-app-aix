import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding, cardGap } from '../../tokens';
import { cardShadow, primaryButtonShadow } from '../../tokens/shadows';
import { StatusPill } from '../../components/StatusPill';
import { useStrings } from '../../i18n';
import { useAppStore } from '../../store';
import { IllustrationDataAnalysis } from '../../components/illustrations';

interface RecommendCard {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
  pillLabel: string;
  pillVariant: 'success' | 'amber' | 'mono' | 'info' | 'risk' | 'red';
  buttonLabel: string;
  buttonColor: string;
  onPress: () => void;
}

export function RecommendScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const s = useStrings();
  const language = useAppStore((state) => state.language);

  const cards: RecommendCard[] = [
    {
      icon: 'event-repeat',
      title: language === 'en' ? 'Switch to Annual Billing' : 'เปลี่ยนเป็นชำระรายปี',
      subtitle: language === 'en' ? 'Stop paying monthly fees, save instantly' : 'หยุดจ่ายค่าธรรมเนียมรายเดือน ประหยัดทันที',
      pillLabel: language === 'en' ? 'Save ฿1,530/year' : 'ประหยัด ฿1,530/ปี',
      pillVariant: 'success',
      buttonLabel: language === 'en' ? 'Apply' : 'ใช้คำแนะนำ',
      buttonColor: colors.primary,
      onPress: () => navigation.navigate('Costs'),
    },
    {
      icon: 'tune',
      title: language === 'en' ? 'Right-size Your Coverage' : 'ปรับความคุ้มครองให้พอดีงบ',
      subtitle: language === 'en' ? 'Keep only what you need, lower your premium instantly' : 'เลือกความคุ้มครองที่จำเป็น ลดเบี้ยได้ทันที',
      pillLabel: language === 'en' ? 'Save ฿880/month' : 'ลดลง ฿880/เดือน',
      pillVariant: 'amber',
      buttonLabel: language === 'en' ? 'Adjust Now' : 'ดำเนินการ',
      buttonColor: colors.amber,
      onPress: () => navigation.navigate('LifestyleCheck'),
    },
    {
      icon: 'swap-horiz',
      title: language === 'en' ? 'Switch to a Lighter Plan' : 'เปลี่ยนเป็นแผนที่เบากว่า',
      subtitle: language === 'en' ? 'A basic health plan covering the essentials' : 'แผนสุขภาพพื้นฐานที่ครอบคลุมสิ่งจำเป็น',
      pillLabel: language === 'en' ? 'From ฿2,400/month' : 'เริ่มต้น ฿2,400/เดือน',
      pillVariant: 'success',
      buttonLabel: language === 'en' ? 'View Plans' : 'ดูแผน',
      buttonColor: colors.success,
      onPress: () => navigation.navigate('LifestyleCheck'),
    },
    {
      icon: 'favorite',
      title: language === 'en' ? 'Unlock AIA Vitality' : 'เปิด AIA Vitality',
      subtitle: language === 'en' ? 'Earn health points, get a premium discount' : 'สะสมคะแนนสุขภาพ รับส่วนลดเบี้ยประกัน',
      pillLabel: language === 'en' ? 'Up to 15% discount' : 'ส่วนลดสูงสุด 15%',
      pillVariant: 'mono',
      buttonLabel: language === 'en' ? 'Get Started' : 'เริ่มเลย',
      buttonColor: colors.gold,
      onPress: () => navigation.navigate('PolicyTab', { screen: 'Vitality' }),
    },
  ];

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
          {s.recommend.title}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: screenPadding,
          paddingBottom: insets.bottom + 32,
          gap: cardGap,
        }}
      >
        {/* Dark red hero banner */}
        <View
          style={{
            backgroundColor: colors.primaryDeep,
            borderRadius: radius.cardLg,
            padding: 20,
            gap: 14,
            ...cardShadow,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.15)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons name="auto-awesome" size={24} color={colors.white} />
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: radius.pill,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  alignSelf: 'flex-start',
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamily.jakarta.semiBold,
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.85)',
                    letterSpacing: 0.5,
                  }}
                >
                  {language === 'en' ? 'AI · For You' : 'AI · เฉพาะคุณ'}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: fontFamily.anuphan.bold,
                  fontSize: fontSize.title,
                  color: colors.white,
                  lineHeight: 22,
                }}
              >
                {s.recommend.heroBanner}
              </Text>
            </View>
          </View>
        </View>

        {/* Data-driven recommendation illustration */}
        <View style={{ alignItems: 'center', paddingVertical: 4 }}>
          <IllustrationDataAnalysis width={200} height={160} />
        </View>

        {/* Recommendation cards */}
        {cards.map((card, i) => (
          <View
            key={i}
            style={{
              backgroundColor: colors.card,
              borderRadius: radius.card,
              padding: 16,
              gap: 12,
              ...cardShadow,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <MaterialIcons name={card.icon} size={22} color={colors.primary} style={{ marginTop: 2 }} />
              <View style={{ flex: 1, gap: 4 }}>
                <Text
                  style={{
                    fontFamily: fontFamily.anuphan.bold,
                    fontSize: fontSize.bodyMd,
                    color: colors.ink2,
                  }}
                >
                  {card.title}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.anuphan.regular,
                    fontSize: fontSize.caption,
                    color: colors.textSecondary,
                    lineHeight: 18,
                  }}
                >
                  {card.subtitle}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <StatusPill label={card.pillLabel} variant={card.pillVariant} />
              <TouchableOpacity
                onPress={card.onPress}
                activeOpacity={0.8}
                style={{
                  backgroundColor: card.buttonColor,
                  borderRadius: radius.button,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamily.anuphan.bold,
                    fontSize: fontSize.body,
                    color: colors.white,
                  }}
                >
                  {card.buttonLabel}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Footer disclaimer */}
        <Text
          style={{
            fontFamily: fontFamily.anuphan.regular,
            fontSize: fontSize.caption,
            color: colors.textTertiary,
            textAlign: 'center',
            lineHeight: 18,
            paddingHorizontal: 8,
          }}
        >
          {s.recommend.disclaimer}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
