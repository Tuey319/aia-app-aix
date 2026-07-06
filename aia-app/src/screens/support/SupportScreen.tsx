import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
import { useStrings } from '../../i18n';
import { useAppStore } from '../../store';

type Nav = NativeStackNavigationProp<any>;

export function SupportScreen() {
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
          {s.support.title}
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
        {/* Search bar — inline white rounded */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('FaqSearch')}
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.input,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 13,
            gap: 10,
            ...cardShadow,
          }}
        >
          <MaterialIcons name="search" size={20} color={colors.textSecondary} />
          <Text
            style={{
              fontFamily: fontFamily.anuphan.regular,
              fontSize: fontSize.bodyMd,
              color: colors.textTertiary,
              flex: 1,
            }}
          >
            {s.support.searchPlaceholder}
          </Text>
        </TouchableOpacity>

        {/* Frequent services section */}
        <SectionGroup label={s.support.commonSection}>
          <ListRow
            icon="event-repeat"
            title={s.support.changeFreq}
            subtitle={language === 'en' ? 'Monthly · Quarterly / Annual' : 'รายเดือน · ราย 3 เดือน / รายปี'}
            onPress={() => navigation.navigate('ChangeFreq')}
          />
          <ListRow
            icon="edit"
            title={s.support.changeInfo}
            onPress={() => navigation.navigate('ProfileEdit')}
          />
          <ListRow
            icon="description"
            title={s.support.requestDocs}
            onPress={() => navigation.navigate('PolicyTab' as any, { screen: 'PolicyDocs' } as any)}
          />
        </SectionGroup>

        {/* Bottom two action buttons side-by-side */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {/* Chat with assistant — dark */}
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => navigation.navigate('Assistant')}
            style={{
              flex: 1,
              backgroundColor: colors.ink,
              borderRadius: radius.button,
              height: 52,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <MaterialIcons name="chat-bubble-outline" size={18} color={colors.white} />
            <Text
              style={{
                fontFamily: fontFamily.anuphan.bold,
                fontSize: fontSize.bodyMd,
                color: colors.white,
              }}
            >
              {s.support.chatBtn}
            </Text>
          </TouchableOpacity>

          {/* Call 1581 — white bordered, red text+icon */}
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => {}}
            style={{
              flex: 1,
              backgroundColor: colors.card,
              borderRadius: radius.button,
              height: 52,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderWidth: 1.5,
              borderColor: colors.hairline2,
              ...cardShadow,
            }}
          >
            <MaterialIcons name="phone" size={18} color={colors.primary} />
            <Text
              style={{
                fontFamily: fontFamily.jakarta.bold,
                fontSize: fontSize.bodyMd,
                color: colors.primary,
              }}
            >
              {s.support.callBtn}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
