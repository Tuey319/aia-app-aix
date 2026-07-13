import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
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

const STEP = 1;

export function ClaimDetailsScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('1,256.00');
  const [category, setCategory] = useState<'medical' | 'daily'>('medical');
  const [cause, setCause] = useState<'illness' | 'accident'>('illness');
  const s = useStrings();
  const language = useAppStore((state) => state.language);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBg }} edges={['top']}>
      <ClaimStepHeader step={STEP} title={s.claims.detailsTitle} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: screenPadding,
          paddingBottom: insets.bottom + 100,
          gap: cardGap,
        }}
      >
        {/* ── เลือกกรมธรรม์ ──────────────────────────────────── */}
        <SectionCard title={s.claims.selectPolicyTitle}>
          <DropdownRow label={s.claims.policyNoDropdown} value={language === 'en' ? 'TXXXXXXXXXX-Group Insurance' : 'TXXXXXXXXXX-ประกันกลุ่ม'} rightIcon="expand-more" onPress={() => {}} />
          <Divider />
          <DropdownRow
            label={s.claims.insuredPerson}
            value={language === 'en' ? 'Somchai Jaidee' : 'สมชาย ใจดี'}
            rightIcon="expand-more"
            onPress={() => {}}
          />
        </SectionCard>

        {/* ── ประเภทการเคลม ──────────────────────────────────── */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.card,
            padding: cardPadding,
            gap: 12,
            ...cardShadow,
          }}
        >
          <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: fontSize.bodyMd, color: colors.ink2 }}>
            {s.claims.claimCategoryTitle}
          </Text>
          <SelectableRow
            label={s.claims.claimCategoryMedical}
            selected={category === 'medical'}
            onPress={() => setCategory('medical')}
          />
          <SelectableRow
            label={s.claims.claimCategoryDaily}
            selected={category === 'daily'}
            onPress={() => setCategory('daily')}
          />
        </View>

        {/* ── กรอกรายละเอียดการเคลม ──────────────────────────── */}
        <SectionCard title={language === 'en' ? 'Treatment Details' : 'กรอกรายละเอียดการเคลม'}>
          <DropdownRow label={s.claims.treatmentTypeLabel} value={s.claims.treatmentOPD} rightIcon="expand-more" onPress={() => {}} />
          <Divider />

          <View style={{ paddingVertical: 12, gap: 10 }}>
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.caption, color: colors.textSecondary }}>
              {s.claims.treatmentCauseLabel}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <CauseOption
                label={s.claims.causeIllness}
                icon="sick"
                selected={cause === 'illness'}
                onPress={() => setCause('illness')}
              />
              <CauseOption
                label={s.claims.causeAccident}
                icon="personal-injury"
                selected={cause === 'accident'}
                onPress={() => setCause('accident')}
              />
            </View>
          </View>
          <Divider />

          <DropdownRow label={s.claims.illnessCauseLabel} value={language === 'en' ? 'Flu' : 'ไข้หวัด'} rightIcon="expand-more" onPress={() => {}} />
          <Divider />
          <DropdownRow label={s.claims.treatmentDate} value={language === 'en' ? '7 May 2023' : '7 พ.ค. 2566'} rightIcon="calendar-today" onPress={() => {}} />
          <Divider />
          <DropdownRow
            label={s.claims.hospitalNameLabel}
            value={language === 'en' ? 'Bangkok Christian Hospital' : 'รพ.กรุงเทพคริสเตียน'}
            rightIcon="expand-more"
            onPress={() => {}}
          />
          <Divider />

          {/* Amount */}
          <View style={{ paddingVertical: 14, gap: 6 }}>
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: fontSize.caption, color: colors.textSecondary }}>
              {s.claims.receiptAmountLabel}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
              <Text style={{ fontFamily: fontFamily.jakarta.semiBold, fontSize: 17, color: colors.ink }}>฿</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={{
                  fontFamily: fontFamily.jakarta.semiBold,
                  fontSize: 17,
                  color: colors.ink,
                  padding: 0,
                }}
              />
            </View>
          </View>
        </SectionCard>

        <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: colors.textTertiary, lineHeight: 16 }}>
          {s.claims.maxClaimNote}
        </Text>
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
          onPress={() => navigation.navigate('ClaimDocs')}
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
            {s.common.next}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: radius.card,
        paddingHorizontal: cardPadding,
        ...cardShadow,
      }}
    >
      <Text
        style={{
          fontFamily: fontFamily.anuphan.semiBold,
          fontSize: fontSize.bodyMd,
          color: colors.ink2,
          paddingTop: 14,
          paddingBottom: 2,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function SelectableRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: selected ? colors.primaryTint : colors.screenBg,
        borderRadius: radius.button,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.hairline2,
        padding: 12,
      }}
    >
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          borderWidth: 1.5,
          borderColor: selected ? colors.primary : colors.textTertiary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected && <View style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: colors.primary }} />}
      </View>
      <Text style={{ flex: 1, fontFamily: fontFamily.anuphan.regular, fontSize: 12.5, color: colors.ink2, lineHeight: 17 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function CauseOption({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: selected ? colors.primaryTint : colors.screenBg,
        borderRadius: radius.button,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.hairline2,
        padding: 12,
      }}
    >
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          borderWidth: 1.5,
          borderColor: selected ? colors.primary : colors.textTertiary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />}
      </View>
      <MaterialIcons name={icon} size={18} color={selected ? colors.primary : colors.textSecondary} />
      <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: 12.5, color: colors.ink2 }}>{label}</Text>
    </TouchableOpacity>
  );
}

function DropdownRow({
  label,
  value,
  rightIcon,
  onPress,
}: {
  label: string;
  value: string;
  rightIcon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        gap: 10,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: fontFamily.anuphan.regular,
            fontSize: fontSize.caption,
            color: colors.textSecondary,
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.anuphan.medium,
            fontSize: fontSize.bodyMd,
            color: colors.ink,
          }}
        >
          {value}
        </Text>
      </View>
      <MaterialIcons name={rightIcon} size={22} color={colors.textTertiary} />
    </TouchableOpacity>
  );
}

function Divider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: colors.hairline2,
      }}
    />
  );
}
