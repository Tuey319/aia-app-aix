import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding, cardGap, cardPadding } from '../../tokens';
import { cardShadow } from '../../tokens/shadows';
import { useStrings } from '../../i18n';
import { useAppStore } from '../../store';

type Nav = NativeStackNavigationProp<any>;

export function ClaimStartScreen() {
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
        }}
      >
        <Text
          style={{
            fontFamily: fontFamily.anuphan.bold,
            fontSize: fontSize.titleLg,
            color: colors.ink,
            flex: 1,
          }}
        >
          {s.claims.manageTitle}
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
        {/* ── เคลมของคุณ ─────────────────────────────────────── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.bodyMd, color: colors.inkBody2 }}>
            {s.claims.yourClaims}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('ClaimHistory')}>
            <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 13, color: colors.primary }}>
              {language === 'en' ? 'View all' : 'ดูเคลมทั้งหมด'}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            padding: cardPadding,
            gap: 10,
            ...cardShadow,
          }}
        >
          <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: fontSize.bodyMd, color: colors.ink }}>
            {language === 'en' ? 'In-patient (Accident)' : 'ผู้ป่วยใน (อุบัติเหตุ)'}
          </Text>
          <ReviewRow label={s.claims.claimNoLabel} value="TXXXXXXXX" mono />
          <ReviewRow label={s.claims.beneficiary} value={language === 'en' ? 'Somxxxx Namxxxxxxx' : 'มาxxxxxx นาคxxxxxx'} />
          <ReviewRow label={s.claims.treatmentDate} value={language === 'en' ? '7 May 2023' : '7 พ.ค. 2566'} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.caption, color: colors.textSecondary }}>
              {language === 'en' ? 'Status' : 'สถานะ'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.amber }} />
              <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: fontSize.caption, color: colors.amberDeep }}>
                {s.claims.statusInProgress}
              </Text>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: colors.hairline2, marginVertical: 2 }} />
          <ReviewRow label={s.claims.totalClaimed} value={language === 'en' ? '฿1,256.00' : '1,256.00 บาท'} bold />

          {/* Notice banner */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 8,
              backgroundColor: colors.amberTint,
              borderRadius: radius.button,
              padding: 10,
              marginTop: 2,
            }}
          >
            <MaterialIcons name="info" size={16} color={colors.amberDeep} style={{ marginTop: 1 }} />
            <Text style={{ flex: 1, fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: colors.amberDeeper, lineHeight: 16 }}>
              {s.claims.docNotice}
            </Text>
          </View>
        </View>

        {/* ── ยื่นเคลม ────────────────────────────────────────── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.bodyMd, color: colors.inkBody2 }}>
            {s.claims.newClaimSection}
          </Text>
          <TouchableOpacity onPress={() => Alert.alert(s.claims.howToClaimLink)}>
            <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 13, color: colors.primary }}>
              {s.claims.howToClaimLink}
            </Text>
          </TouchableOpacity>
        </View>

        <ClaimTypeCard
          icon="person"
          title={s.claims.individualInsurance}
          desc={s.claims.individualInsuranceDesc}
          btnLabel={s.claims.fileClaimBtn}
          onPress={() => navigation.navigate('ClaimDetails')}
        />
        <ClaimTypeCard
          icon="groups"
          title={s.claims.groupInsurance}
          desc={s.claims.groupInsuranceDesc}
          btnLabel={s.claims.fileClaimBtn}
          onPress={() => navigation.navigate('ClaimDetails')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ReviewRow({ label, value, mono, bold }: { label: string; value: string; mono?: boolean; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.caption, color: colors.textSecondary }}>
        {label}
      </Text>
      <Text
        style={{
          fontFamily: mono ? fontFamily.mono.regular : bold ? fontFamily.jakarta.bold : fontFamily.anuphan.medium,
          fontSize: bold ? fontSize.bodyMd : fontSize.caption,
          color: colors.ink2,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function ClaimTypeCard({
  icon,
  title,
  desc,
  btnLabel,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  desc: string;
  btnLabel: string;
  onPress: () => void;
}) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: radius.card,
        padding: cardPadding,
        gap: 10,
        ...cardShadow,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: colors.primaryTint,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name={icon} size={22} color={colors.primary} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.bodyMd, color: colors.ink }}>
            {title}
          </Text>
          <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 12, color: colors.textSecondary, lineHeight: 17 }}>
            {desc}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={{
          alignSelf: 'flex-start',
          borderWidth: 1.5,
          borderColor: colors.primary,
          borderRadius: radius.pill,
          paddingHorizontal: 18,
          paddingVertical: 8,
        }}
      >
        <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 13, color: colors.primary }}>{btnLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}
