/**
 * Badge Collection — achievement badges earned by the user.
 * Delight Mak concept: Always On Time, Yearly Protector, Consistent Payer, etc.
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding, cardGap } from '../../tokens';
import { cardShadow } from '../../tokens/shadows';
import { useAppStore } from '../../store';
import { IllustrationBeHealthy } from '../../components/illustrations';

type Nav = NativeStackNavigationProp<any>;

interface Badge {
  id: string;
  name: string;
  nameTh: string;
  desc: string;
  descEn: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  bg: string;
  earned: boolean;
  earnedDate?: string;
  earnedDateEn?: string;
  tier: 'bronze' | 'silver' | 'gold';
}

const BADGES: Badge[] = [
  {
    id: 'always-on-time',
    name: 'Always On Time',
    nameTh: 'ชำระตรงเวลา',
    desc: 'ชำระเบี้ยตรงเวลาต่อเนื่อง 12 งวด',
    descEn: 'Paid premium on time for 12 consecutive periods',
    icon: 'schedule',
    color: colors.success,
    bg: colors.successTint,
    earned: true,
    earnedDate: '17 มิ.ย. 2569',
    earnedDateEn: '17 Jun 2026',
    tier: 'gold',
  },
  {
    id: 'consistent-payer',
    name: 'Consistent Payer',
    nameTh: 'ชำระต่อเนื่อง',
    desc: 'ไม่ขาดชำระติดต่อกัน 12 เดือน',
    descEn: 'No missed payments for 12 consecutive months',
    icon: 'verified',
    color: colors.info,
    bg: colors.infoTint,
    earned: true,
    earnedDate: 'ม.ค. 2569',
    earnedDateEn: 'Jan 2026',
    tier: 'silver',
  },
  {
    id: 'yearly-protector',
    name: 'Yearly Protector',
    nameTh: 'ปีถัดปี',
    desc: 'ต่ออายุกรมธรรม์ครบ 1 ปี',
    descEn: 'Renewed policy for 1 full year',
    icon: 'shield',
    color: colors.primary,
    bg: colors.primaryTint,
    earned: true,
    earnedDate: 'ม.ค. 2569',
    earnedDateEn: 'Jan 2026',
    tier: 'bronze',
  },
  {
    id: 'loyal-member',
    name: 'Loyal Member',
    nameTh: 'สมาชิกระยะยาว',
    desc: 'เป็นสมาชิก AIA ครบ 3 ปี',
    descEn: 'AIA member for 3 full years',
    icon: 'workspace-premium',
    color: colors.gold,
    bg: colors.goldTint,
    earned: false,
    tier: 'gold',
  },
  {
    id: 'health-lover',
    name: 'Health Lover',
    nameTh: 'รักสุขภาพ',
    desc: 'สะสม Vitality แต้ม 10,000 คะแนน',
    descEn: 'Earned 10,000 AIA Vitality points',
    icon: 'favorite',
    color: '#E91E8C',
    bg: '#FCEDF6',
    earned: true,
    earnedDate: 'มิ.ย. 2569',
    earnedDateEn: 'Jun 2026',
    tier: 'silver',
  },
  {
    id: 'goal-achiever',
    name: 'Goal Achiever',
    nameTh: 'บรรลุเป้าหมาย',
    desc: 'ออกกำลังกาย 150 วันในปีนี้',
    descEn: 'Exercised 150 days this year',
    icon: 'sports-score',
    color: '#9B59B6',
    bg: '#F5EEF8',
    earned: false,
    tier: 'gold',
  },
  {
    id: 'smart-planner',
    name: 'Smart Planner',
    nameTh: 'นักวางแผน',
    desc: 'เปลี่ยนเป็นชำระรายปีเพื่อประหยัด',
    descEn: 'Switched to annual billing to save',
    icon: 'auto-awesome',
    color: colors.amber,
    bg: colors.amberTint,
    earned: false,
    tier: 'silver',
  },
  {
    id: 'top-spender',
    name: 'Top Spender',
    nameTh: 'ผู้ลงทุนชั้นนำ',
    desc: 'ชำระเบี้ยรวมเกิน ฿100,000',
    descEn: 'Paid over ฿100,000 in total premiums',
    icon: 'diamond',
    color: '#1C4F9E',
    bg: '#EAF1FB',
    earned: false,
    tier: 'gold',
  },
];

const TIER_LABEL = { bronze: 'Bronze', silver: 'Silver', gold: 'Gold' };
const TIER_COLOR = { bronze: '#CD7F32', silver: '#9E9E9E', gold: colors.gold };

function BadgeCard({ badge, language }: { badge: Badge; language: string }) {
  const dim = (Dimensions.get('window').width - screenPadding * 2 - 12) / 2;

  return (
    <View style={{
      width: dim,
      backgroundColor: badge.earned ? colors.card : '#FAFAFA',
      borderRadius: radius.card,
      padding: 16,
      alignItems: 'center',
      gap: 10,
      borderWidth: badge.earned ? 0 : 1.5,
      borderColor: badge.earned ? undefined : colors.hairline2,
      borderStyle: badge.earned ? undefined : 'dashed',
      ...( badge.earned ? cardShadow : {} ),
      opacity: badge.earned ? 1 : 0.55,
    }}>
      {/* Tier label */}
      <View style={{ alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
        <MaterialIcons name="stars" size={10} color={TIER_COLOR[badge.tier]} />
        <Text style={{ fontFamily: fontFamily.mono.regular, fontSize: 8, color: TIER_COLOR[badge.tier], letterSpacing: 0.5 }}>
          {TIER_LABEL[badge.tier]}
        </Text>
      </View>

      {/* Badge icon circle */}
      <View style={{
        width: 60, height: 60, borderRadius: 30,
        backgroundColor: badge.earned ? badge.bg : colors.hairline2,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: badge.earned ? 2.5 : 0,
        borderColor: badge.earned ? badge.color : undefined,
      }}>
        <MaterialIcons name={badge.icon} size={28} color={badge.earned ? badge.color : colors.textTertiary} />
        {badge.earned && (
          <View style={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="check" size={12} color="#fff" />
          </View>
        )}
      </View>

      <View style={{ alignItems: 'center', gap: 3 }}>
        <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 13, color: badge.earned ? colors.ink2 : colors.textTertiary, textAlign: 'center' }}>
          {language === 'en' ? badge.name : badge.nameTh}
        </Text>
        <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 10, color: colors.textSecondary, textAlign: 'center', lineHeight: 14 }}>
          {language === 'en' ? badge.descEn : badge.desc}
        </Text>
        {badge.earned && badge.earnedDate && (
          <Text style={{ fontFamily: fontFamily.mono.regular, fontSize: 9, color: badge.color, letterSpacing: 0.3, marginTop: 2 }}>
            ✓ {language === 'en' ? badge.earnedDateEn : badge.earnedDate}
          </Text>
        )}
      </View>
    </View>
  );
}

export function BadgeCollectionScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const language = useAppStore((state) => state.language);
  const earned = BADGES.filter((b) => b.earned).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBg }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: screenPadding, paddingTop: 12, paddingBottom: 16, gap: 8 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.ink} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 17, color: colors.ink }}>{language === 'en' ? 'My Badges' : 'เหรียญรางวัลของฉัน'}</Text>
          <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 12, color: colors.textSecondary }}>Badge Collection</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ProtectionJourney')} hitSlop={12}>
          <MaterialIcons name="timeline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: screenPadding, paddingBottom: insets.bottom + 32, gap: cardGap }}>
        {/* unDraw illustration */}
        <View style={{ alignItems: 'center', marginBottom: -8 }}>
          <IllustrationBeHealthy width={260} height={200} />
        </View>

        {/* Progress banner */}
        <View style={{ backgroundColor: colors.ink, borderRadius: radius.card, padding: 18, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{language === 'en' ? 'Collected' : 'สะสมแล้ว'}</Text>
              <Text style={{ fontFamily: fontFamily.jakarta.extraBold, fontSize: 32, color: '#fff', letterSpacing: -0.5 }}>
                {earned} <Text style={{ fontSize: 16, fontFamily: fontFamily.jakarta.regular, color: 'rgba(255,255,255,0.6)' }}>/ {BADGES.length} Badges</Text>
              </Text>
            </View>
            <MaterialIcons name="emoji-events" size={44} color={colors.gold} />
          </View>
          {/* Progress bar */}
          <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden' }}>
            <View style={{ height: 6, width: `${(earned / BADGES.length) * 100}%` as any, backgroundColor: colors.gold, borderRadius: 3 }} />
          </View>
          <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
            {language === 'en' ? `${BADGES.length - earned} more badges to unlock all` : `อีก ${BADGES.length - earned} badges เพื่อปลดล็อคทั้งหมด`}
          </Text>
        </View>

        {/* Badge grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {BADGES.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} language={language} />
          ))}
        </View>

        {/* Journey link */}
        <TouchableOpacity onPress={() => navigation.navigate('ProtectionJourney')} activeOpacity={0.85}
          style={{ backgroundColor: colors.primaryTint, borderRadius: radius.card, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="timeline" size={22} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 14, color: colors.primaryDeep }}>{language === 'en' ? 'View Your Journey' : 'ดูการเดินทางของคุณ'}</Text>
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 12, color: colors.primary }}>Protection Journey · {language === 'en' ? 'Year 2026' : 'ปี 2569'}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
