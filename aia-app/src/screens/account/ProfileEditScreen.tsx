import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding, cardGap } from '../../tokens';
import { cardShadow } from '../../tokens/shadows';
import { ListRow } from '../../components/ListRow';
import { useStrings } from '../../i18n';

type Nav = NativeStackNavigationProp<any>;

export function ProfileEditScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const s = useStrings();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: screenPadding, paddingTop: 12, paddingBottom: 16, gap: 8 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.ink} />
        </TouchableOpacity>
        <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.titleLg, color: colors.ink, flex: 1 }}>
          {s.account.profileTitle}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: screenPadding, paddingBottom: insets.bottom + 32, gap: cardGap }}
      >
        <View style={{ backgroundColor: colors.card, borderRadius: radius.card, overflow: 'hidden', ...cardShadow }}>
          <ListRow icon="badge" title={s.account.yourCardRow} onPress={() => {}} />
          <ListRow icon="contact-mail" title={s.account.contactInfoRow} onPress={() => {}} />
          <ListRow icon="location-on" title={s.account.contactAddressRow} onPress={() => {}} />
          <ListRow icon="fact-check" title={s.account.investmentAssessmentRow} onPress={() => {}} />
        </View>

        {/* Connected devices */}
        <View>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 13, color: colors.textSecondary, marginBottom: 10 }}>
            {s.account.connectedDevicesSection('1')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderRadius: radius.card,
              padding: 14,
              gap: 12,
              ...cardShadow,
            }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.infoTint, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name="watch-variant" size={22} color={colors.info} />
            </View>
            <Text style={{ flex: 1, fontFamily: fontFamily.anuphan.semiBold, fontSize: 13, color: colors.ink }}>
              AIA Vitality Band
            </Text>
            <MaterialIcons name="bluetooth-connected" size={20} color={colors.success} />
          </TouchableOpacity>
        </View>

        {/* Health report */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 13, color: colors.textSecondary }}>
              {s.account.healthReportSection}
            </Text>
            <TouchableOpacity>
              <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 13, color: colors.primary }}>
                {s.home.viewAll}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderRadius: radius.card,
              padding: 14,
              gap: 12,
              ...cardShadow,
            }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.successTint, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="favorite" size={22} color={colors.success} />
            </View>
            <View style={{ flex: 1, gap: 1 }}>
              <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 13, color: colors.ink }}>
                {s.account.vitalityAgeLabel}: 38
              </Text>
              <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: colors.success }}>
                {s.account.vitalityAgeCompare('-1')}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
