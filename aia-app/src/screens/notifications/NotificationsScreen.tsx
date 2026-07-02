import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, screenPadding } from '../../tokens';
import { useAppStore } from '../../store';
import { fetchNotifications, markNotificationRead, dismissNotification } from '../../api/notifications';
import {
  Notification,
  NotificationIntent,
  STUB_NOTIFICATIONS,
  INTENT_META,
  confidenceLabel,
  timeAgo,
} from './notificationTypes';

type Nav = NativeStackNavigationProp<any>;

// No auth/session layer exists yet to know the real logged-in customer's ID
// (see aia-call-intelligence-service README, "Path to production" ->
// Auth) -- pinned to a synthetic customer with active notifications until
// that lands.
const DEMO_CUSTOMER_ID = 'C102221';

// ─── Card ────────────────────────────────────────────────────────────────────

function NotificationCard({
  notification,
  language,
  onPress,
  onDismiss,
}: {
  notification: Notification;
  language: string;
  onPress: () => void;
  onDismiss: () => void;
}) {
  const meta = INTENT_META[notification.intent];
  const title       = language === 'en' ? notification.titleEn       : notification.titleTh;
  const body        = language === 'en' ? notification.bodyEn        : notification.bodyTh;
  const actionLabel = language === 'en' ? notification.actionLabelEn : notification.actionLabelTh;
  const isUnread    = !notification.isRead;
  // High-confidence predictions get a quiet "worth your attention" cue --
  // deliberately not showing the raw model score, since a percentage means
  // nothing reassuring to a customer; it's a curation signal, not a stat.
  const isPriority  = confidenceLabel(notification.confidence) === 'high';

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: 'rgba(0,0,0,0.04)' }}
      style={({ pressed }) => ({
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        opacity: pressed ? 0.94 : 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
      })}
    >
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>

        {/* Circle icon with unread red dot */}
        <View style={{ position: 'relative', flexShrink: 0 }}>
          <View style={{
            width: 50, height: 50, borderRadius: 25,
            backgroundColor: '#FFF0F3',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <MaterialIcons name={meta.icon as any} size={24} color={colors.primary} />
          </View>
          {isUnread && (
            <View style={{
              position: 'absolute', top: 1, right: 1,
              width: 11, height: 11, borderRadius: 6,
              backgroundColor: colors.primary,
              borderWidth: 2, borderColor: '#FFFFFF',
            }} />
          )}
        </View>

        {/* Content */}
        <View style={{ flex: 1, gap: 4 }}>
          {/* Title row */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <Text
              style={{
                fontFamily: isUnread ? fontFamily.anuphan.bold : fontFamily.anuphan.medium,
                fontSize: 14,
                color: isUnread ? '#111827' : '#374151',
                flex: 1,
                lineHeight: 20,
              }}
              numberOfLines={2}
            >
              {title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <Text style={{ fontFamily: fontFamily.jakarta.regular, fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>
                {timeAgo(notification.createdAt, language)}
              </Text>
              <TouchableOpacity onPress={onDismiss} hitSlop={10}>
                <MaterialIcons name="close" size={16} color="#C4C9D1" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Intent label + policy + priority cue */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontFamily: fontFamily.jakarta.semiBold, fontSize: 10, color: colors.primary }}>
              {language === 'en' ? meta.labelEn : meta.labelTh}
            </Text>
            <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: '#D1D5DB' }} />
            <Text style={{ fontFamily: fontFamily.jakarta.regular, fontSize: 10, color: '#9CA3AF', letterSpacing: 0.4 }}>
              {notification.policyNo}
            </Text>
            {isPriority && (
              <>
                <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: '#D1D5DB' }} />
                <Text style={{ fontFamily: fontFamily.jakarta.semiBold, fontSize: 10, color: '#D32F2F' }}>
                  {language === 'en' ? 'Worth a look' : 'ควรดูก่อน'}
                </Text>
              </>
            )}
          </View>

          {/* Body */}
          <Text style={{
            fontFamily: fontFamily.anuphan.regular,
            fontSize: 12, color: '#6B7280', lineHeight: 18, marginTop: 2,
          }}>
            {body}
          </Text>

          {/* CTA */}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6 }}>
            <TouchableOpacity
              onPress={onPress}
              activeOpacity={0.82}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 99,
                paddingHorizontal: 16,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 12, color: '#FFFFFF' }}>
                {actionLabel}
              </Text>
              <MaterialIcons name="arrow-forward" size={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Filter chips ─────────────────────────────────────────────────────────────

const FILTER_CHIPS: { intent: NotificationIntent | 'all'; labelTh: string; labelEn: string }[] = [
  { intent: 'all',             labelTh: 'ทั้งหมด',   labelEn: 'All'      },
  { intent: 'due_date_amount', labelTh: 'ครบกำหนด',  labelEn: 'Due'      },
  { intent: 'payment_status',  labelTh: 'การชำระ',    labelEn: 'Payment'  },
  { intent: 'autopay',         labelTh: 'อัตโนมัติ',  labelEn: 'Auto-Pay' },
  { intent: 'loan_repayment',  labelTh: 'เงินกู้',    labelEn: 'Loan'     },
  { intent: 'tax_consent',     labelTh: 'ภาษี',       labelEn: 'Tax'      },
];

// ─── Screen ──────────────────────────────────────────────────────────────────

export function NotificationsScreen() {
  const navigation  = useNavigation<Nav>();
  const insets      = useSafeAreaInsets();
  const language    = useAppStore((s) => s.language);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading]             = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [activeFilter, setActiveFilter]   = useState<NotificationIntent | 'all'>('all');

  useEffect(() => {
    let cancelled = false;
    fetchNotifications(DEMO_CUSTOMER_ID)
      .then((fetched) => {
        if (!cancelled) setNotifications(fetched);
      })
      .catch((err) => {
        // aia-call-intelligence-service unreachable (not running / wrong URL / offline) --
        // fall back to stub data so the screen still demos. Not surfaced to the
        // customer (a "can't reach server" toast isn't delightful); logged for us.
        console.warn('[notifications] falling back to stub data:', err);
        if (!cancelled) {
          setNotifications(STUB_NOTIFICATIONS);
          setUsingFallback(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered     = activeFilter === 'all' ? notifications : notifications.filter((n) => n.intent === activeFilter);
  // Most-worth-your-attention first within each group -- a customer with 5
  // notifications should see the one that actually matters before the routine ones.
  const byPriority   = (a: Notification, b: Notification) => b.confidence - a.confidence;
  const unread       = filtered.filter((n) => !n.isRead).sort(byPriority);
  const read         = filtered.filter((n) => n.isRead).sort(byPriority);
  const unreadCount  = notifications.filter((n) => !n.isRead).length;

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    if (!usingFallback) markNotificationRead(id);
  }

  function markAllRead() {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    if (!usingFallback) unreadIds.forEach((id) => markNotificationRead(id));
  }

  function dismiss(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (!usingFallback) dismissNotification(id);
  }

  function handlePress(n: Notification) {
    markRead(n.id);
    navigation.navigate(n.actionRoute as any);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F7' }} edges={['top']}>

      {/* ── Header gradient strip ───────────────────────────────────────────── */}
      <LinearGradient
        colors={['#FFFFFF', '#F5F5F7']}
        style={{ paddingHorizontal: screenPadding, paddingTop: 14, paddingBottom: 6 }}
      >
        {/* Row 1: back + title + mark all */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}
            style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F0F0F3', alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="arrow-back-ios" size={18} color="#111827" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 22, color: '#111827' }}>
              {language === 'en' ? 'Notifications' : 'การแจ้งเตือน'}
            </Text>
            {unreadCount > 0 && (
              <View style={{
                backgroundColor: colors.primary, borderRadius: 99,
                minWidth: 22, height: 22, paddingHorizontal: 6,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ fontFamily: fontFamily.jakarta.extraBold, fontSize: 11, color: '#FFFFFF' }}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllRead} hitSlop={10}>
              <Text style={{ fontFamily: fontFamily.anuphan.semiBold, fontSize: 13, color: colors.primary }}>
                {language === 'en' ? 'Mark all read' : 'อ่านทั้งหมด'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Row 2: subtitle */}
        <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 13, color: '#6B7280', marginTop: 3, marginLeft: 46 }}>
          {language === 'en' ? 'Your policy alerts' : 'การแจ้งเตือนกรมธรรม์ของคุณ'}
        </Text>
      </LinearGradient>

      {/* ── Filter chips ────────────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, flexShrink: 0, backgroundColor: '#F5F5F7' }}
        contentContainerStyle={{ paddingHorizontal: screenPadding, gap: 8, paddingTop: 8, paddingBottom: 12 }}
      >
        {FILTER_CHIPS.map((chip) => {
          const isActive = chip.intent === activeFilter;
          const meta     = chip.intent !== 'all' ? INTENT_META[chip.intent] : null;
          return (
            <TouchableOpacity
              key={chip.intent}
              onPress={() => setActiveFilter(chip.intent)}
              activeOpacity={0.75}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 9,
                borderRadius: 99,
                backgroundColor: isActive ? colors.primary : '#FFFFFF',
                borderWidth: 1.5,
                borderColor: isActive ? colors.primary : '#E5E7EB',
                alignItems: 'center', justifyContent: 'center',
                flexDirection: 'row', gap: 5,
                shadowColor: isActive ? colors.primary : 'transparent',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isActive ? 0.25 : 0,
                shadowRadius: 6,
                elevation: isActive ? 3 : 0,
              }}
            >
              <Text style={{
                fontFamily: fontFamily.anuphan.semiBold,
                fontSize: 13,
                color: isActive ? '#FFFFFF' : '#374151',
              }}>
                {language === 'en' ? chip.labelEn : chip.labelTh}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── List ────────────────────────────────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: screenPadding, paddingBottom: insets.bottom + 40, gap: 10 }}
      >

        {/* Loading state */}
        {loading && (
          <View style={{ alignItems: 'center', paddingTop: 72, gap: 12 }}>
            <ActivityIndicator color={colors.primary} />
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 13, color: '#9CA3AF' }}>
              {language === 'en' ? 'Loading notifications…' : 'กำลังโหลดการแจ้งเตือน…'}
            </Text>
          </View>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 72, gap: 14 }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 }}>
              <MaterialIcons name="notifications-none" size={34} color="#D1D5DB" />
            </View>
            <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 16, color: '#374151' }}>
              {language === 'en' ? 'All caught up!' : 'ไม่มีการแจ้งเตือน'}
            </Text>
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 13, color: '#9CA3AF', textAlign: 'center', maxWidth: 220, lineHeight: 20 }}>
              {language === 'en'
                ? "We'll notify you here when your policies need attention."
                : 'เราจะแจ้งเตือนคุณที่นี่เมื่อมีเรื่องที่ต้องดำเนินการ'}
            </Text>
          </View>
        )}

        {/* NEW section */}
        {unread.length > 0 && (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }} />
              <Text style={{ fontFamily: fontFamily.jakarta.bold, fontSize: 11, color: '#9CA3AF', letterSpacing: 1, textTransform: 'uppercase' }}>
                {language === 'en' ? `New  ·  ${unread.length}` : `ใหม่  ·  ${unread.length}`}
              </Text>
            </View>
            {unread.map((n) => (
              <NotificationCard key={n.id} notification={n} language={language} onPress={() => handlePress(n)} onDismiss={() => dismiss(n.id)} />
            ))}
          </>
        )}

        {/* EARLIER section */}
        {read.length > 0 && (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: unread.length > 0 ? 10 : 4 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
              <Text style={{ fontFamily: fontFamily.jakarta.bold, fontSize: 11, color: '#9CA3AF', letterSpacing: 1, textTransform: 'uppercase' }}>
                {language === 'en' ? 'Earlier' : 'ก่อนหน้านี้'}
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
            </View>
            {read.map((n) => (
              <NotificationCard key={n.id} notification={n} language={language} onPress={() => handlePress(n)} onDismiss={() => dismiss(n.id)} />
            ))}
          </>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <View style={{ alignItems: 'center', marginTop: 8, opacity: 0.45 }}>
            <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 10, color: '#9CA3AF' }}>
              {language === 'en' ? 'AIA Thailand · You\'re up to date' : 'AIA Thailand · คุณรับทราบทุกอย่างแล้ว'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
