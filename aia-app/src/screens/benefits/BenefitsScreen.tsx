import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontFamily, fontSize, radius, screenPadding, cardGap } from '../../tokens';
import { shadows } from '../../tokens/shadows';
import { useAppStore } from '../../store';
import { AiaLogo } from '../../components/AiaLogo';

const CATEGORIES_TH = ['ทั้งหมด', 'สุขภาพ', 'ไลฟ์สไตล์', 'อาหาร', 'ท่องเที่ยว', 'ช้อปปิ้ง'];
const CATEGORIES_EN = ['All', 'Health', 'Lifestyle', 'Food', 'Travel', 'Shopping'];

interface Benefit {
  id: string;
  category: string; // always Thai key for filter matching
  brand: string;
  titleTh: string;
  titleEn: string;
  discount: string;
  discountEn?: string;
  tagTh?: string;
  tagEn?: string;
  monogram: string;
  logo?: number;
  iconBg: string;
  iconColor: string;
  expiryTh?: string;
  expiryEn?: string;
}

const BENEFITS: Benefit[] = [
  {
    id: '1',
    category: 'สุขภาพ',
    brand: 'Bumrungrad Hospital',
    titleTh: 'ส่วนลดค่าตรวจสุขภาพประจำปี',
    titleEn: 'Annual health check discount',
    discount: '15% OFF',
    tagTh: 'AIA Vitality',
    tagEn: 'AIA Vitality',
    monogram: 'BH',
    logo: require('../../../assets/partners/bumrungrad.webp'),
    iconBg: '#EAF7F0',
    iconColor: colors.success,
    expiryTh: '31 ธ.ค. 2569',
    expiryEn: '31 Dec 2026',
  },
  {
    id: '2',
    category: 'สุขภาพ',
    brand: 'Synphaet Hospital',
    titleTh: 'ส่วนลดค่า Lab & X-Ray',
    titleEn: 'Lab & X-Ray discount',
    discount: '20% OFF',
    monogram: 'SH',
    logo: require('../../../assets/partners/synphaet.png'),
    iconBg: '#EAF7F0',
    iconColor: colors.success,
  },
  {
    id: '3',
    category: 'ไลฟ์สไตล์',
    brand: 'Virgin Active',
    titleTh: 'ฟิตเนสไม่จำกัดครั้ง / เดือน',
    titleEn: 'Unlimited gym access / month',
    discount: '฿499/เดือน',
    discountEn: '฿499/month',
    tagTh: 'ยอดนิยม',
    tagEn: 'Popular',
    monogram: 'VA',
    logo: require('../../../assets/partners/virgin-active.webp'),
    iconBg: '#EAF1FB',
    iconColor: colors.info,
  },
  {
    id: '4',
    category: 'ไลฟ์สไตล์',
    brand: 'Lemon Farm',
    titleTh: 'ส่วนลดสินค้าออร์แกนิค',
    titleEn: 'Organic products discount',
    discount: '10% OFF',
    monogram: 'LF',
    logo: require('../../../assets/partners/lemon-farm.jpg'),
    iconBg: '#EAF7F0',
    iconColor: colors.success,
  },
  {
    id: '5',
    category: 'อาหาร',
    brand: 'After You',
    titleTh: 'เครื่องดื่มฟรี 1 แก้ว เมื่อสั่งครบ ฿200',
    titleEn: 'Free drink when you spend ฿200',
    discount: 'FREE Drink',
    monogram: 'AY',
    logo: require('../../../assets/partners/after-you.jpeg'),
    iconBg: '#FBF4DA',
    iconColor: colors.gold,
    expiryTh: '30 มิ.ย. 2569',
    expiryEn: '30 Jun 2026',
  },
  {
    id: '6',
    category: 'อาหาร',
    brand: 'The Pizza Company',
    titleTh: 'ส่วนลดพิซซ่า L ฟรีเครื่องดื่ม',
    titleEn: 'Large pizza + free drink',
    discount: '฿99 ลด',
    discountEn: '฿99 off',
    monogram: 'PZ',
    logo: require('../../../assets/partners/pizza-company.webp'),
    iconBg: '#FFF3E4',
    iconColor: colors.amber,
  },
  {
    id: '7',
    category: 'ท่องเที่ยว',
    brand: 'Agoda',
    titleTh: 'ส่วนลดที่พักทั่วโลก',
    titleEn: 'Worldwide hotel discount',
    discount: '12% OFF',
    tagTh: 'ใหม่',
    tagEn: 'New',
    monogram: 'AG',
    logo: require('../../../assets/partners/agoda.webp'),
    iconBg: '#EAF1FB',
    iconColor: colors.info,
  },
  {
    id: '8',
    category: 'ท่องเที่ยว',
    brand: 'Thai Airways',
    titleTh: 'ส่วนลดตั๋วเครื่องบินภายในประเทศ',
    titleEn: 'Domestic flight discount',
    discount: '8% OFF',
    monogram: 'TG',
    logo: require('../../../assets/partners/thai-airways.webp'),
    iconBg: '#EAF1FB',
    iconColor: colors.info,
  },
  {
    id: '9',
    category: 'ช้อปปิ้ง',
    brand: 'Central Department Store',
    titleTh: 'ส่วนลดสินค้าแฟชั่น & ไลฟ์สไตล์',
    titleEn: 'Fashion & lifestyle discount',
    discount: '5% + 5%',
    monogram: 'CD',
    logo: require('../../../assets/partners/central.webp'),
    iconBg: '#FCEDF1',
    iconColor: colors.primary,
  },
  {
    id: '10',
    category: 'ช้อปปิ้ง',
    brand: 'Watson',
    titleTh: 'แต้มสะสมพิเศษจาก AIA Vitality',
    titleEn: 'Bonus points via AIA Vitality',
    discount: '2X Points',
    tagTh: 'AIA Vitality',
    tagEn: 'AIA Vitality',
    monogram: 'WT',
    logo: require('../../../assets/partners/watson.webp'),
    iconBg: '#EAF7F0',
    iconColor: colors.success,
  },
];

function BenefitCard({ benefit, language }: { benefit: Benefit; language: string }) {
  const title = language === 'en' ? benefit.titleEn : benefit.titleTh;
  const tag = language === 'en' ? benefit.tagEn : benefit.tagTh;
  const expiry = language === 'en' ? benefit.expiryEn : benefit.expiryTh;
  const discount = language === 'en' && benefit.discountEn ? benefit.discountEn : benefit.discount;

  return (
    <Pressable
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      style={({ pressed }) => ({
        backgroundColor: colors.card,
        borderRadius: radius.card,
        overflow: 'hidden',
        opacity: pressed ? 0.92 : 1,
        ...shadows.md,
      })}
    >
      <View style={{ flexDirection: 'row', padding: 14, gap: 12, alignItems: 'center' }}>
        {/* Brand logo (falls back to a monogram if none provided) */}
        {benefit.logo ? (
          <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.hairline2, alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 7 }}>
            <Image source={benefit.logo} style={{ width: '100%', height: '100%' }} contentFit="contain" />
          </View>
        ) : (
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: benefit.iconBg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Text style={{ fontFamily: fontFamily.jakarta.extraBold, fontSize: 15, color: benefit.iconColor, letterSpacing: 0.2 }}>
              {benefit.monogram}
            </Text>
          </View>
        )}

        {/* Text */}
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: 11, color: colors.textSecondary }}>
              {benefit.brand}
            </Text>
            {tag && (
              <View style={{ backgroundColor: colors.primaryTint, borderRadius: 99, paddingHorizontal: 6, paddingVertical: 1 }}>
                <Text style={{ fontFamily: fontFamily.jakarta.bold, fontSize: 8, color: colors.primary, letterSpacing: 0.3 }}>
                  {tag}
                </Text>
              </View>
            )}
          </View>
          <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 13, color: colors.ink2, lineHeight: 19 }}>
            {title}
          </Text>
          {expiry && (
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 10, color: colors.textTertiary }}>
              {language === 'en' ? `Until ${expiry}` : `ถึง ${expiry}`}
            </Text>
          )}
        </View>

        {/* Discount badge */}
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <View style={{ backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, minWidth: 56, alignItems: 'center' }}>
            <Text style={{ fontFamily: fontFamily.jakarta.bold, fontSize: 11, color: colors.white, letterSpacing: 0.3 }}>
              {discount}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function BenefitsScreen() {
  const insets = useSafeAreaInsets();
  const language = useAppStore((state) => state.language);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);

  const CATEGORIES = language === 'en' ? CATEGORIES_EN : CATEGORIES_TH;
  // Always filter by the Thai key (index 0 = all)
  const activeCategoryTh = CATEGORIES_TH[activeCategoryIdx];
  const filtered = activeCategoryIdx === 0
    ? BENEFITS
    : BENEFITS.filter((b) => b.category === activeCategoryTh);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBg }} edges={['top']}>
      {/* Header */}
      <View style={{ paddingHorizontal: screenPadding, paddingTop: 14, paddingBottom: 12 }}>
        <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 20, color: colors.ink }}>
          {language === 'en' ? 'Benefits' : 'สิทธิพิเศษ'}
        </Text>
        <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
          {language === 'en'
            ? `${BENEFITS.length} benefits for you`
            : `${BENEFITS.length} สิทธิประโยชน์สำหรับคุณ`}
        </Text>
      </View>

      {/* Category chips */}
      <View style={{ position: 'relative' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}
          contentContainerStyle={{ paddingHorizontal: screenPadding, gap: 8, paddingBottom: 14 }}>
          {CATEGORIES.map((cat, idx) => {
            const isActive = idx === activeCategoryIdx;
            return (
              <TouchableOpacity key={cat} onPress={() => setActiveCategoryIdx(idx)} activeOpacity={0.75}
                style={{ height: 34, paddingHorizontal: 16, borderRadius: radius.pill, backgroundColor: isActive ? colors.primary : colors.card, borderWidth: 1, borderColor: isActive ? colors.primary : colors.hairline2, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: fontSize.caption, color: isActive ? colors.white : colors.inkBody2 }}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <LinearGradient
          pointerEvents="none"
          colors={['transparent', colors.screenBg]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={{ position: 'absolute', right: 0, top: 0, bottom: 14, width: 28 }}
        />
      </View>

      {/* Benefits list */}
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: screenPadding, paddingBottom: insets.bottom + 32, gap: cardGap }}>

        {/* AIA Vitality promo banner */}
        <View style={{ backgroundColor: colors.primaryDeep, borderRadius: radius.card, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
            <AiaLogo size={32} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 14, color: colors.white }}>
              {language === 'en' ? 'AIA Vitality Earn Points' : 'AIA Vitality สะสมแต้ม'}
            </Text>
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
              {language === 'en'
                ? 'Combine with Vitality to unlock extra discounts'
                : 'ใช้สิทธิ์ร่วมกับ Vitality เพื่อรับส่วนลดเพิ่มเติม'}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
        </View>

        {filtered.map((b) => <BenefitCard key={b.id} benefit={b} language={language} />)}
      </ScrollView>
    </SafeAreaView>
  );
}
