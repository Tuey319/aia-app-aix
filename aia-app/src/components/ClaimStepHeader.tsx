import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, screenPadding } from '../tokens';
import { useAppStore } from '../store';

const STEP_SUBTITLES_TH: Record<number, string> = {
  1: 'รายละเอียดการเคลม',
  2: 'เอกสารแนบ',
  3: 'ตรวจสอบก่อนส่ง',
};

const STEP_SUBTITLES_EN: Record<number, string> = {
  1: 'Claim Details',
  2: 'Documents',
  3: 'Review & Submit',
};

interface ClaimStepHeaderProps {
  step: number;    // 1-3
  total?: number;  // defaults to 3
  title: string;
  subtitle?: string;
}

export function ClaimStepHeader({ step, total = 3, title, subtitle }: ClaimStepHeaderProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const language = useAppStore((st) => st.language);
  const subtitleMap = language === 'en' ? STEP_SUBTITLES_EN : STEP_SUBTITLES_TH;
  const stepSubtitle = subtitle ?? subtitleMap[step] ?? '';

  return (
    <View>
      {/* Top bar: back + title + X */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: screenPadding, paddingTop: 12, paddingBottom: 10, gap: 8 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: fontFamily.anuphan.bold, fontSize: 17, color: colors.ink }}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} hitSlop={16}>
          <MaterialIcons name="close" size={22} color={colors.ink} />
        </TouchableOpacity>
      </View>

      {/* Step label + progress bar */}
      <View style={{ paddingHorizontal: screenPadding, paddingBottom: 14, gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 13, color: colors.primary }}>
            {language === 'en' ? `Step ${step} of ${total}` : `ขั้นตอน ${step} จาก ${total}`}
          </Text>
          {stepSubtitle ? (
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 12, color: colors.textSecondary }}>
              {stepSubtitle}
            </Text>
          ) : null}
        </View>
        {/* Progress track */}
        <View style={{ height: 4, backgroundColor: colors.hairline2, borderRadius: 2, overflow: 'hidden' }}>
          <View style={{ height: 4, width: `${(step / total) * 100}%` as any, backgroundColor: colors.primary, borderRadius: 2 }} />
        </View>
      </View>
    </View>
  );
}
