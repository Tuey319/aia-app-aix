import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding } from '../../tokens';
import { primaryButtonShadow } from '../../tokens/shadows';
import { useStrings } from '../../i18n';

type Nav = NativeStackNavigationProp<any>;

export function FreqSuccessScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const s = useStrings();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: screenPadding, gap: 20 }}>
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="check" size={52} color={colors.white} />
        </View>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 20, color: colors.ink }}>
            {s.policy.freqSuccessTitle}
          </Text>
          <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.bodyMd, color: colors.textSecondary, textAlign: 'center' }}>
            {s.policy.freqSuccessSub}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: screenPadding, paddingBottom: insets.bottom + 16 }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.popToTop()}
          style={{ backgroundColor: colors.primary, borderRadius: radius.button, height: 52, alignItems: 'center', justifyContent: 'center', ...primaryButtonShadow }}
        >
          <Text style={{ color: colors.white, fontFamily: fontFamily.anuphan.bold, fontSize: 16 }}>{s.common.close}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
