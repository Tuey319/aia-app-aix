import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding, cardGap } from '../../tokens';
import { cardShadow } from '../../tokens/shadows';
import { StatusPill } from '../../components/StatusPill';
import { useAppStore } from '../../store';
import { useStrings } from '../../i18n';
import { IllustrationCoinsDrop } from '../../components/illustrations';

export function ValueScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const s = useStrings();
  const language = useAppStore((state) => state.language);
  const policy = useAppStore((st) => st.selectedPolicy);

  const paidToDate = 148000;
  const multiplier = Math.round(policy.sumAssured / paidToDate);
  const cashValueToDate = 92000;
  const cashValuePct = Math.round((cashValueToDate / paidToDate) * 100);

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
          {s.value.title}
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
        {/* Dark green hero card */}
        <View
          style={{
            backgroundColor: colors.successDeep,
            borderRadius: radius.cardLg,
            padding: 20,
            gap: 14,
            ...cardShadow,
          }}
        >
          {/* Paid label */}
          <Text
            style={{
              fontFamily: fontFamily.anuphan.regular,
              fontSize: fontSize.body,
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            {s.value.paidSoFar} ฿{paidToDate.toLocaleString('en-US')}
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.anuphan.regular,
              fontSize: fontSize.body,
              color: 'rgba(255,255,255,0.75)',
              marginTop: -10,
            }}
          >
            {s.value.coverageReceived}
          </Text>

          {/* Big sum assured */}
          <Text
            style={{
              fontFamily: fontFamily.jakarta.extraBold,
              fontSize: 42,
              color: colors.white,
              letterSpacing: -1.5,
              lineHeight: 46,
            }}
          >
            ฿{policy.sumAssured.toLocaleString('en-US')}
          </Text>

          {/* "คุ้มครองอยู่" pill + ratio row */}
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <MaterialIcons name="show-chart" size={18} color="rgba(255,255,255,0.8)" />
            <Text
              style={{
                fontFamily: fontFamily.anuphan.semiBold,
                fontSize: fontSize.bodyMd,
                color: colors.white,
                flex: 1,
              }}
            >
              {s.value.valueRatio(String(multiplier))}
            </Text>
            <StatusPill label={s.value.activeStatus} variant="success" />
          </View>
        </View>

        {/* Coverage breakdown card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            overflow: 'hidden',
            ...cardShadow,
          }}
        >
          <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 }}>
            <Text
              style={{
                fontFamily: fontFamily.jakarta.bold,
                fontSize: 11,
                color: colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: 0.6,
              }}
            >
              {s.value.coverageSection}
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: colors.hairline, marginHorizontal: 16 }} />

          <CoverageRow
            icon="shield"
            iconColor={colors.primary}
            title={s.value.lifeInsurance}
            subtitle={s.value.lifeInsuranceSub}
            value="฿2,000,000"
          />
          <View style={{ height: 1, backgroundColor: colors.hairline, marginLeft: 50 }} />
          <CoverageRow
            icon="local-hospital"
            iconColor={colors.primary}
            title={s.value.hospital}
            subtitle={s.value.hospitalSub}
            value="฿1,000,000"
          />
          <View style={{ height: 1, backgroundColor: colors.hairline, marginLeft: 50 }} />
          <CoverageRow
            icon="favorite"
            iconColor={colors.primary}
            title={s.value.criticalIllness}
            subtitle={s.value.criticalIllnessSub}
            value="฿500,000"
          />
          <View style={{ height: 8 }} />
        </View>

        {/* Green money-returns card */}
        <View
          style={{
            backgroundColor: colors.successTint,
            borderRadius: radius.card,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            ...cardShadow,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: colors.success + '22',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="savings" size={26} color={colors.success} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.semiBold,
                fontSize: fontSize.caption,
                color: colors.success,
              }}
            >
              {language === 'en' ? 'Accumulated Cash Value' : 'มูลค่าเงินสดสะสม'}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.jakarta.extraBold,
                fontSize: 22,
                color: colors.successDeep,
                letterSpacing: -0.5,
              }}
            >
              ฿{cashValueToDate.toLocaleString('en-US')}
            </Text>
            <StatusPill label={`${cashValuePct}% ${language === 'en' ? 'of total premiums paid' : 'ของเบี้ยที่จ่ายสะสม'}`} variant="success" />
          </View>
        </View>

        {/* Value illustration */}
        <View style={{ alignItems: 'center', paddingVertical: 4 }}>
          <IllustrationCoinsDrop width={200} height={160} />
        </View>

        {/* Motivational footer note */}
        <View
          style={{
            backgroundColor: colors.primaryTint,
            borderRadius: radius.card,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <MaterialIcons name="favorite" size={18} color={colors.primary} style={{ marginTop: 2 }} />
          <Text
            style={{
              flex: 1,
              fontFamily: fontFamily.anuphan.regular,
              fontSize: fontSize.bodyMd,
              color: colors.ink2,
              lineHeight: 22,
            }}
          >
            {language === 'en'
              ? 'Every premium you pay is preparation — protecting you and your family when the unexpected happens.'
              : 'เบี้ยที่จ่ายไม่ได้หายไปไหน — มันคือความเตรียมพร้อม ปกป้องคุณและครอบครัวในวันที่ไม่มีใครคาดคิด'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Sub-components ─── */

function CoverageRow({
  icon,
  iconColor,
  title,
  subtitle,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  title: string;
  subtitle: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
      }}
    >
      <MaterialIcons name={icon} size={22} color={iconColor} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            fontFamily: fontFamily.anuphan.semiBold,
            fontSize: fontSize.bodyMd,
            color: colors.ink2,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.anuphan.regular,
            fontSize: fontSize.caption,
            color: colors.textSecondary,
          }}
        >
          {subtitle}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: fontFamily.jakarta.bold,
          fontSize: fontSize.bodyMd,
          color: colors.ink2,
          letterSpacing: -0.3,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
