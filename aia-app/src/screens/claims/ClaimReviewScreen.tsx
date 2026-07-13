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
  cardPadding,
} from '../../tokens';
import { ClaimStepHeader } from '../../components/ClaimStepHeader';
import { cardShadow, primaryButtonShadow } from '../../tokens/shadows';
import { useStrings } from '../../i18n';
import { useAppStore } from '../../store';

type Nav = NativeStackNavigationProp<any>;

const STEP = 3;

interface SummaryRow {
  label: string;
  value: string;
}

export function ClaimReviewScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const s = useStrings();
  const language = useAppStore((state) => state.language);

  const SUMMARY_ROWS: SummaryRow[] = [
    { label: s.claims.insuredPerson, value: language === 'en' ? 'Somchai Jaidee' : 'สมชาย ใจดี' },
    { label: s.claims.policyNoDropdown, value: 'TXXXXXXXXXX' },
    { label: s.claims.policyHolderLabel, value: language === 'en' ? 'AIA Company Limited' : 'บริษัท เอไอเอ จำกัด' },
    { label: language === 'en' ? 'Claim Type' : 'ประเภทการเคลม', value: s.claims.claimCategoryMedical },
    { label: s.claims.treatmentTypeLabel, value: s.claims.treatmentOPD },
    { label: s.claims.illnessCauseLabel, value: language === 'en' ? 'Flu' : 'ไข้หวัด' },
    { label: s.claims.treatmentDate, value: language === 'en' ? '7 May 2023' : '7 พ.ค. 2566' },
    { label: s.claims.hospitalNameLabel, value: language === 'en' ? 'Bangkok Christian Hospital' : 'รพ.กรุงเทพคริสเตียน' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBg }} edges={['top']}>
      <ClaimStepHeader step={STEP} title={s.claims.confirmTitle} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: screenPadding,
          paddingBottom: insets.bottom + 100,
          gap: cardGap,
        }}
      >
        {/* Summary Card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            paddingHorizontal: cardPadding,
            ...cardShadow,
          }}
        >
          {/* Amount row — large, at top like the reference */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 16,
            }}
          >
            <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: fontSize.bodyMd, color: colors.ink2 }}>
              {s.claims.receiptAmountLabel}
            </Text>
            <Text style={{ fontFamily: fontFamily.jakarta.bold, fontSize: 20, color: colors.primary, letterSpacing: -0.3 }}>
              1,256.00 {language === 'en' ? 'THB' : 'บาท'}
            </Text>
          </View>
          <View style={{ height: 1, backgroundColor: colors.hairline2 }} />

          {SUMMARY_ROWS.map((row, index) => (
            <React.Fragment key={row.label}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  paddingVertical: 13,
                  gap: 16,
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamily.anuphan.regular,
                    fontSize: fontSize.caption,
                    color: colors.textSecondary,
                    flexShrink: 0,
                  }}
                >
                  {row.label}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    fontFamily: fontFamily.anuphan.medium,
                    fontSize: fontSize.caption,
                    color: colors.ink2,
                    lineHeight: 17,
                  }}
                >
                  {row.value}
                </Text>
              </View>
              {index < SUMMARY_ROWS.length - 1 && (
                <View style={{ height: 1, backgroundColor: colors.hairline2 }} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Documents Card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            padding: cardPadding,
            gap: 10,
            ...cardShadow,
          }}
        >
          <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: fontSize.bodyMd, color: colors.ink2 }}>
            {s.claims.attachTitle}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.caption, color: colors.textSecondary }}>
              {s.claims.medCert}
            </Text>
            <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: fontSize.caption, color: colors.primary }}>
              เอกสาร.jpg
            </Text>
          </View>
        </View>

        {/* Green success note */}
        <View
          style={{
            backgroundColor: colors.successTint,
            borderRadius: radius.card,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 14,
            gap: 10,
          }}
        >
          <MaterialIcons name="check-circle" size={20} color={colors.success} />
          <Text
            style={{
              fontFamily: fontFamily.anuphan.regular,
              fontSize: fontSize.body,
              color: colors.successDeep,
              flex: 1,
              lineHeight: 19,
            }}
          >
            {language === 'en' ? 'Information verified. Ready to submit.' : 'ตรวจสอบข้อมูลถูกต้องแล้ว พร้อมส่งเคลม'}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Button */}
      <View
        style={{
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
          onPress={() => navigation.navigate('ClaimOtp')}
          style={{
            backgroundColor: colors.primary,
            borderRadius: radius.button,
            height: 52,
            alignItems: 'center',
            justifyContent: 'center',
            ...primaryButtonShadow,
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontFamily: fontFamily.anuphan.bold,
              fontSize: 16,
            }}
          >
            {s.claims.confirmBtn}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
