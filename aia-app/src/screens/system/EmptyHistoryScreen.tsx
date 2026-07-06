import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding } from '../../tokens';
import { primaryButtonShadow } from '../../tokens/shadows';
import { IllustrationCoinsDrop } from '../../components/illustrations';
import { useStrings } from '../../i18n';

type Nav = NativeStackNavigationProp<any>;

export function EmptyHistoryScreen() {
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
          {s.history.title}
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: screenPadding, paddingBottom: 80, gap: 16 }}>
        <IllustrationCoinsDrop width={240} height={240} />
        <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.titleLg, color: colors.ink2, textAlign: 'center' }}>
          {s.system.emptyHistoryTitle}
        </Text>
        <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.bodyMd, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 }}>
          {s.system.emptyHistorySub}
        </Text>
      </View>

      <View style={{ paddingHorizontal: screenPadding, paddingBottom: insets.bottom + 16, paddingTop: 12, backgroundColor: colors.screenBg, borderTopWidth: 1, borderTopColor: colors.hairline2 }}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeTab' as any, { screen: 'PaySelect' } as any)} activeOpacity={0.82}
          style={{ backgroundColor: colors.primary, borderRadius: radius.button, height: 52, alignItems: 'center', justifyContent: 'center', ...primaryButtonShadow }}>
          <Text style={{ color: colors.white, fontFamily: fontFamily.anuphan.bold, fontSize: fontSize.title }}>{s.system.emptyHistoryBtn}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
