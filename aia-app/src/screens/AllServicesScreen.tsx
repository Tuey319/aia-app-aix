import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding, cardShadow } from '../tokens';
import { useStrings } from '../i18n';

type Nav = NativeStackNavigationProp<any>;
type Item = { icon: keyof typeof MaterialIcons.glyphMap; label: string; badge?: string; onPress?: () => void };

function ServiceSection({ title, items }: { title: string; items: Item[] }) {
  return (
    <View>
      <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 13, color: colors.textSecondary, marginBottom: 10 }}>
        {title}
      </Text>
      <View style={{ backgroundColor: colors.card, borderRadius: radius.cardLg, paddingVertical: 8, ...cardShadow }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {items.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={item.onPress}
              activeOpacity={0.75}
              style={{ width: '33.33%', alignItems: 'center', paddingVertical: 14, gap: 8, paddingHorizontal: 4 }}
            >
              <View>
                <MaterialIcons name={item.icon} size={24} color={colors.primary} />
                {item.badge && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -14,
                      backgroundColor: colors.primary,
                      borderRadius: 4,
                      paddingHorizontal: 4,
                      paddingVertical: 1,
                    }}
                  >
                    <Text style={{ fontFamily: fontFamily.jakarta.bold, fontSize: 7, color: colors.white }}>{item.badge}</Text>
                  </View>
                )}
              </View>
              <Text
                style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 11, color: colors.inkBody2, textAlign: 'center', lineHeight: 14 }}
                numberOfLines={2}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

export function AllServicesScreen() {
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
          {s.allServices.title}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: screenPadding, paddingBottom: insets.bottom + 32, gap: 20 }}
      >
        <ServiceSection
          title={s.allServices.policyInfoSection}
          items={[
            { icon: 'badge', label: s.allServices.yourCard },
            { icon: 'support-agent', label: s.allServices.agent },
          ]}
        />

        <ServiceSection
          title={s.allServices.policyServicesSection}
          items={[
            { icon: 'local-hospital', label: s.allServices.claim, onPress: () => navigation.navigate('ClaimsTab' as any, { screen: 'ClaimStart' } as any) },
            { icon: 'fact-check', label: s.allServices.trackRequest },
            { icon: 'location-on', label: s.allServices.changeAddress },
            { icon: 'badge', label: s.allServices.changeName },
            { icon: 'draw', label: s.allServices.changeSignature },
            { icon: 'contact-phone', label: s.allServices.changePhoneEmail },
          ]}
        />

        <ServiceSection
          title={s.allServices.paymentsSection}
          items={[
            { icon: 'payments', label: s.allServices.payPremium, onPress: () => navigation.navigate('PaySelect') },
            { icon: 'credit-card', label: s.allServices.autoCreditDebit, badge: 'AIA PAY' },
            { icon: 'account-balance', label: s.allServices.linkPayoutAccount },
          ]}
        />

        <ServiceSection
          title={s.allServices.otherServicesSection}
          items={[
            { icon: 'receipt-long', label: s.allServices.taxRights },
            { icon: 'description', label: s.allServices.eDocument },
            { icon: 'download', label: s.allServices.downloadDocs, onPress: () => navigation.navigate('PolicyTab' as any, { screen: 'PolicyDocs' } as any) },
          ]}
        />

        {/* ── Let us help — assistant CTA ─────────────────────── */}
        <View>
          <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 13, color: colors.textSecondary, marginBottom: 10 }}>
            {s.allServices.helpSection}
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Assistant')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderRadius: radius.cardLg,
              padding: 16,
              gap: 12,
              ...cardShadow,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: colors.primaryTint,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons name="support-agent" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 14, color: colors.ink }}>
                {s.allServices.chatWithAssistant}
              </Text>
              <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 11, color: colors.textSecondary, lineHeight: 15 }}>
                {s.allServices.chatWithAssistantSub}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
