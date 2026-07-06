/**
 * Protection Journey — year-in-review of the user's payment history.
 * Delight Mak concept: annual recap of protection + payments.
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding, cardGap } from '../../tokens';
import { cardShadow, primaryButtonShadow } from '../../tokens/shadows';
import { BarChart } from '../../components/BarChart';
import { useAppStore } from '../../store';
import { IllustrationHealthInsurance } from '../../components/illustrations';

type Nav = NativeStackNavigationProp<any>;

function getMonthlyData(language: string) {
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

function getProtectionEvents(language: string) {
  const onTime = language === 'en' ? 'Paid on time' : 'ชำระตรงเวลา';
  if (language === 'en') {
    return [
      { month: 'January', icon: 'check-circle' as const, iconColor: colors.success, title: onTime, sub: '17 Jan 2026 · ฿4,250', status: 'done' as const },
      { month: 'February', icon: 'check-circle' as const, iconColor: colors.success, title: onTime, sub: '17 Feb 2026 · ฿4,250', status: 'done' as const },
      { month: 'March', icon: 'check-circle' as const, iconColor: colors.success, title: 'Paid on time + earned a badge 🏅', sub: '17 Mar 2026 · ฿4,250 · Consistent Payer unlocked', status: 'done' as const },
      { month: 'April', icon: 'check-circle' as const, iconColor: colors.success, title: onTime, sub: '17 Apr 2026 · ฿4,250', status: 'done' as const },
      { month: 'May', icon: 'check-circle' as const, iconColor: colors.success, title: onTime, sub: '17 May 2026 · ฿4,250', status: 'done' as const },
      { month: 'June', icon: 'emoji-events' as const, iconColor: colors.gold, title: 'Milestone: 12 payments! 🎉', sub: '17 Jun 2026 · ฿4,250 · Always On Time unlocked', status: 'done' as const },
    ];
  }
  return [
    { month: 'มกราคม', icon: 'check-circle' as const, iconColor: colors.success, title: 'ชำระตรงเวลา', sub: '17 ม.ค. 2569 · ฿4,250', status: 'done' as const },
    { month: 'กุมภาพันธ์', icon: 'check-circle' as const, iconColor: colors.success, title: 'ชำระตรงเวลา', sub: '17 ก.พ. 2569 · ฿4,250', status: 'done' as const },
    { month: 'มีนาคม', icon: 'check-circle' as const, iconColor: colors.success, title: 'ชำระตรงเวลา + รับ Badge 🏅', sub: '17 มี.ค. 2569 · ฿4,250 · Consistent Payer unlocked', status: 'done' as const },
    { month: 'เมษายน', icon: 'check-circle' as const, iconColor: colors.success, title: 'ชำระตรงเวลา', sub: '17 เม.ย. 2569 · ฿4,250', status: 'done' as const },
    { month: 'พฤษภาคม', icon: 'check-circle' as const, iconColor: colors.success, title: 'ชำระตรงเวลา', sub: '17 พ.ค. 2569 · ฿4,250', status: 'done' as const },
    { month: 'มิถุนายน', icon: 'emoji-events' as const, iconColor: colors.gold, title: 'Milestone 12 งวด! 🎉', sub: '17 มิ.ย. 2569 · ฿4,250 · Always On Time unlocked', status: 'done' as const },
  ];
}

export function ProtectionJourneyScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const language = useAppStore((state) => state.language);
  const protectionEvents = getProtectionEvents(language);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBg }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: screenPadding, paddingTop: 12, paddingBottom: 16, gap: 8 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.ink} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 17, color: colors.ink }}>{language === 'en' ? 'Your Journey' : 'การเดินทางของคุณ'}</Text>
          <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 12, color: colors.textSecondary }}>Protection Journey · {language === 'en' ? 'Year 2026' : 'ปี 2569'}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: screenPadding, paddingBottom: insets.bottom + 32, gap: cardGap }}>
        {/* Illustration */}
        <View style={{ alignItems: 'center', marginBottom: -4 }}>
          <IllustrationHealthInsurance width={240} height={200} />
        </View>

        {/* Hero stats card */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDeep]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ borderRadius: radius.cardLg, padding: 20, gap: 16 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialIcons name="favorite" size={16} color="rgba(255,255,255,0.7)" />
            <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              AIA Health Happy · {language === 'en' ? 'Year 2026' : 'ปี 2569'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 14, gap: 4 }}>
              <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{language === 'en' ? 'Paid this year' : 'ชำระแล้วปีนี้'}</Text>
              <Text style={{ fontFamily: fontFamily.jakarta.extraBold, fontSize: 22, color: '#fff', letterSpacing: -0.5 }}>฿25,500</Text>
              <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{language === 'en' ? '12 instalments, all on time' : '12 งวด ตรงเวลาทั้งหมด'}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 14, gap: 4 }}>
              <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{language === 'en' ? 'Coverage' : 'ความคุ้มครอง'}</Text>
              <Text style={{ fontFamily: fontFamily.jakarta.extraBold, fontSize: 22, color: '#fff', letterSpacing: -0.5 }}>฿2.0M</Text>
              <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{language === 'en' ? 'Protecting you all year' : 'ปกป้องคุณตลอดปี'}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialIcons name="emoji-events" size={16} color={colors.gold} />
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 13, color: colors.gold }}>{language === 'en' ? '3 Badges earned this year' : '3 Badges ได้รับปีนี้'}</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          </View>
        </LinearGradient>

        {/* Payment bar chart */}
        <View style={{ backgroundColor: colors.card, borderRadius: radius.card, padding: 18, gap: 14, ...cardShadow }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 14, color: colors.ink2 }}>{language === 'en' ? 'Monthly Payment History' : 'ประวัติการชำระรายเดือน'}</Text>
            <Text style={{ fontFamily: fontFamily.mono.regular, fontSize: 9, color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase' }}>{language === 'en' ? '2026' : '2569'}</Text>
          </View>
          <BarChart
            data={getMonthlyData(language)}
            height={80}
            formatValue={(v) => `฿${(v / 1000).toFixed(1)}k`}
            labelColor={colors.primary}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success }} />
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: colors.success }}>
              {language === 'en' ? 'On time every instalment · No late fees' : 'ตรงเวลาทุกงวด · ไม่มีค่าปรับ'}
            </Text>
          </View>
        </View>

        {/* Protection timeline */}
        <View style={{ backgroundColor: colors.card, borderRadius: radius.card, padding: 18, gap: 0, ...cardShadow }}>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 14, color: colors.ink2, marginBottom: 16 }}>
            {language === 'en' ? 'Protection Timeline' : 'Timeline การคุ้มครอง'}
          </Text>

          {protectionEvents.map((evt, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 14 }}>
              {/* Dot + line */}
              <View style={{ alignItems: 'center', width: 22 }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: evt.iconColor + '20', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name={evt.icon} size={14} color={evt.iconColor} />
                </View>
                {i < protectionEvents.length - 1 && (
                  <View style={{ width: 2, flex: 1, minHeight: 24, backgroundColor: colors.hairline, marginVertical: 3 }} />
                )}
              </View>

              {/* Content */}
              <View style={{ flex: 1, paddingBottom: i < protectionEvents.length - 1 ? 16 : 0 }}>
                <Text style={{ fontFamily: fontFamily.mono.regular, fontSize: 9, color: colors.textTertiary, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 }}>
                  {evt.month} {language === 'en' ? '2026' : '2569'}
                </Text>
                <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 13, color: colors.ink2 }}>{evt.title}</Text>
                <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: colors.textSecondary, lineHeight: 16 }}>{evt.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Share CTA */}
        <TouchableOpacity onPress={() => navigation.navigate('SharePride')} activeOpacity={0.82}
          style={{ backgroundColor: colors.primary, borderRadius: radius.button, height: 52, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, ...primaryButtonShadow }}>
          <MaterialIcons name="share" size={18} color={colors.white} />
          <Text style={{ color: colors.white, fontFamily: fontFamily.anuphan.bold, fontSize: 15 }}>{language === 'en' ? 'Share Your Pride 🎉' : 'แชร์ความภาคภูมิใจ 🎉'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
