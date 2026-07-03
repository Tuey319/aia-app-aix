import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
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
} from '../../tokens';
import { cardShadow } from '../../tokens/shadows';
import { SectionGroup } from '../../components/SectionGroup';
import { ListRow } from '../../components/ListRow';
import { useAppStore } from '../../store';
import { useStrings } from '../../i18n';

type Nav = NativeStackNavigationProp<any>;

export function AccountScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const faceIdEnabled = useAppStore((s) => s.faceIdEnabled);
  const setFaceIdEnabled = useAppStore((s) => s.setFaceIdEnabled);
  const s = useStrings();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBg }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 32,
        }}
      >
        {/* Profile header — full-width, no card, padding from edge */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ProfileEdit')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: screenPadding,
            paddingTop: 20,
            paddingBottom: 20,
            gap: 14,
          }}
        >
          {/* Red circle avatar with icon */}
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="person" size={28} color={colors.white} />
          </View>

          <View style={{ flex: 1, gap: 2 }}>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.bold,
                fontSize: fontSize.titleLg,
                color: colors.ink,
              }}
            >
              มาXXXXX
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.anuphan.medium,
                fontSize: fontSize.bodyMd,
                color: colors.primary,
              }}
            >
              {s.account.viewProfile} {'›'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{ paddingHorizontal: screenPadding, gap: cardGap }}>
          {/* Section: ตั้งค่าทั่วไป */}
          <SectionGroup label={s.account.generalSection}>
            {/* Language row */}
            <ListRow
              icon="language"
              title={s.account.language}
              showChevron={false}
              right={
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 4,
                    backgroundColor: colors.hairline2,
                    borderRadius: radius.pill,
                    padding: 3,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setLanguage('en')}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 5,
                      borderRadius: radius.pill,
                      backgroundColor: language === 'en' ? colors.primary : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fontFamily.jakarta.semiBold,
                        fontSize: fontSize.caption,
                        color: language === 'en' ? colors.white : colors.textSecondary,
                      }}
                    >
                      EN
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setLanguage('th')}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 5,
                      borderRadius: radius.pill,
                      backgroundColor: language === 'th' ? colors.primary : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fontFamily.anuphan.semiBold,
                        fontSize: fontSize.caption,
                        color: language === 'th' ? colors.white : colors.textSecondary,
                      }}
                    >
                      ไทย
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />

            {/* Face ID row */}
            <ListRow
              icon="face"
              title={s.account.faceId}
              showChevron={false}
              right={
                <Switch
                  value={faceIdEnabled}
                  onValueChange={setFaceIdEnabled}
                  trackColor={{ false: colors.hairline2, true: colors.primary }}
                  thumbColor={colors.white}
                />
              }
            />

            {/* PIN row */}
            <ListRow
              icon="lock-outline"
              title={s.account.changePin}
              onPress={() => {}}
            />

            {/* Password row */}
            <ListRow
              icon="vpn-key"
              title={s.account.changePassword}
              onPress={() => {}}
            />
          </SectionGroup>

          {/* Ask assistant CTA */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Assistant')}
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
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="support-agent" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1, gap: 1 }}>
              <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 13, color: colors.ink }}>{s.account.askAssistant}</Text>
              <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: colors.textSecondary }}>{s.account.askAssistantSub}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          {/* Section: เกี่ยวกับ AIA+ */}
          <SectionGroup label={s.account.aboutSection}>
            <ListRow
              icon="phone"
              title={s.account.contact}
              onPress={() => navigation.navigate('ContactAgent')}
            />
            <ListRow
              icon="help-outline"
              title={s.account.faq}
              onPress={() => navigation.navigate('FaqList')}
            />
            <ListRow
              icon="description"
              title={s.account.terms}
              onPress={() => {}}
            />
            <ListRow
              icon="privacy-tip"
              title={s.account.privacyStatement}
              onPress={() => {}}
            />
            <ListRow
              icon="campaign"
              title={s.account.directMarketingUse}
              onPress={() => {}}
            />
            <ListRow
              icon="menu-book"
              title={s.account.userGuide}
              onPress={() => {}}
            />
            <ListRow
              icon="person-remove"
              title={s.account.deleteAccount}
              onPress={() => {}}
            />
          </SectionGroup>

          {/* Logout — red text, centred, at bottom */}
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.7}
            style={{
              alignItems: 'center',
              paddingVertical: 18,
              marginTop: 4,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.anuphan.semiBold,
                fontSize: fontSize.title,
                color: colors.primary,
              }}
            >
              {s.account.logout}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
