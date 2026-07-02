import React, { useState } from 'react';
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

const STEP = 2;

interface UploadSlot {
  id: string;
  label: string;
  file: { name: string; size: string } | null;
}

export function ClaimDocsScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const s = useStrings();
  const language = useAppStore((state) => state.language);

  const [slots, setSlots] = useState<UploadSlot[]>([
    { id: 'medCert', label: s.claims.medCert, file: { name: 'เอกสาร.jpg', size: '67.1KB' } },
    { id: 'receipt', label: s.claims.docReceiptLabel, file: null },
    { id: 'other', label: s.claims.docOtherLabel, file: null },
  ]);
  const [filedBefore, setFiledBefore] = useState(false);

  function upload(id: string) {
    setSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, file: { name: 'เอกสาร.jpg', size: '54.3KB' } } : slot)),
    );
  }

  function remove(id: string) {
    setSlots((prev) => prev.map((slot) => (slot.id === id ? { ...slot, file: null } : slot)));
  }

  const canProceed = slots.every((slot) => slot.id === 'other' || slot.file !== null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBg }} edges={['top']}>
      <ClaimStepHeader step={STEP} title={s.claims.docsTitle} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: screenPadding,
          paddingBottom: insets.bottom + 100,
          gap: cardGap,
        }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            padding: cardPadding,
            gap: 16,
            ...cardShadow,
          }}
        >
          <View style={{ gap: 2 }}>
            <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: fontSize.bodyMd, color: colors.ink }}>
              {s.claims.attachTitle}
            </Text>
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: colors.textSecondary }}>
              {s.claims.attachSizeNote}
            </Text>
          </View>

          {slots.map((slot) => (
            <View key={slot.id} style={{ gap: 8 }}>
              <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: fontSize.caption, color: colors.inkBody2 }}>
                {slot.label}
              </Text>
              {slot.file ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: colors.screenBg,
                    borderRadius: radius.button,
                    borderWidth: 1,
                    borderColor: colors.hairline2,
                    padding: 12,
                  }}
                >
                  <MaterialIcons name="insert-drive-file" size={20} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: fontSize.caption, color: colors.ink2 }}>
                      {slot.file.name}
                    </Text>
                    <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 10, color: colors.textTertiary }}>
                      {slot.file.size}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => remove(slot.id)} hitSlop={10}>
                    <MaterialIcons name="delete-outline" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => upload(slot.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    alignSelf: 'flex-start',
                    borderWidth: 1.5,
                    borderColor: colors.primary,
                    borderRadius: radius.pill,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                  }}
                >
                  <MaterialIcons name="add" size={16} color={colors.primary} />
                  <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 12.5, color: colors.primary }}>
                    {s.claims.uploadBtn}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Other-insurer question */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setFiledBefore((v) => !v)}
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            padding: cardPadding,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 12,
            ...cardShadow,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              borderWidth: 1.5,
              borderColor: filedBefore ? colors.primary : colors.hairline2,
              backgroundColor: filedBefore ? colors.primary : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 1,
            }}
          >
            {filedBefore && <MaterialIcons name="check" size={14} color={colors.white} />}
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: 12.5, color: colors.ink2, lineHeight: 18 }}>
              {s.claims.otherInsurerQuestion}
            </Text>
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: colors.textSecondary }}>
              {s.claims.everBefore}
            </Text>
          </View>
        </TouchableOpacity>
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
          disabled={!canProceed}
          onPress={() => navigation.navigate('ClaimReview')}
          style={{
            backgroundColor: canProceed ? colors.primary : colors.hairline2,
            borderRadius: radius.button,
            height: 52,
            alignItems: 'center',
            justifyContent: 'center',
            ...(canProceed ? primaryButtonShadow : {}),
          }}
        >
          <Text
            style={{
              color: canProceed ? colors.white : colors.textTertiary,
              fontFamily: fontFamily.anuphan.bold,
              fontSize: 16,
            }}
          >
            {s.common.next}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
