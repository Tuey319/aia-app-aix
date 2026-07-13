/**
 * AI Celebration — Milestone Celebration popup shown after a successful payment.
 * "Every payment is a promise." — Delight Mak concept doc
 */
import React, { useEffect, useRef } from 'react';
import { Platform 
} from 'react-native';
import {
  View, Text, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, fontSize, radius, screenPadding, cardGap } from '../../tokens';
import { primaryButtonShadow, heroShadow } from '../../tokens/shadows';
import { useAppStore } from '../../store';

type Nav = NativeStackNavigationProp<any>;

const { width: W } = Dimensions.get('window');

// Confetti particle component
function ConfettiDot({ x, delay, color: c, size }: { x: number; delay: number; color: string; size: number }) {
  const y = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: Platform.OS !== "web" }),
        Animated.timing(y, { toValue: 300, duration: 2000, useNativeDriver: Platform.OS !== "web" }),
      ]),
      Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: Platform.OS !== "web" }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: c,
        transform: [{ translateY: y }],
        opacity,
      }}
    />
  );
}

const CONFETTI = [
  { x: 20,  delay: 0,   color: colors.primary,     size: 10 },
  { x: 50,  delay: 100, color: colors.success,      size: 8  },
  { x: 90,  delay: 200, color: colors.amber,        size: 12 },
  { x: 130, delay: 50,  color: colors.info,         size: 7  },
  { x: 160, delay: 300, color: colors.gold,         size: 9  },
  { x: 200, delay: 150, color: colors.primary,      size: 11 },
  { x: 240, delay: 250, color: colors.success,      size: 8  },
  { x: 270, delay: 0,   color: colors.amber,        size: 6  },
  { x: 300, delay: 200, color: '#9B59B6',           size: 10 },
  { x: 330, delay: 100, color: colors.primary,      size: 8  },
  { x: 60,  delay: 400, color: colors.gold,         size: 7  },
  { x: 110, delay: 350, color: '#9B59B6',           size: 10 },
  { x: 185, delay: 450, color: colors.success,      size: 6  },
  { x: 220, delay: 500, color: colors.amber,        size: 9  },
  { x: 355, delay: 320, color: colors.info,         size: 8  },
];


export function CelebrationScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const language = useAppStore((state) => state.language);
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: Platform.OS !== "web", bounciness: 12 }).start();
    Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: Platform.OS !== "web" }).start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(22,22,28,0.92)' }} edges={['top', 'bottom']}>
      {/* Confetti */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 300, overflow: 'hidden' }}>
        {CONFETTI.map((c, i) => <ConfettiDot key={i} {...c} />)}
      </View>

      <Animated.View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: screenPadding, opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}>
        {/* Main card */}
        <View style={{ width: '100%', marginTop: 30 }}>
          {/* Floating trophy badge */}
          <View style={{ position: 'absolute', top: -30, left: 0, right: 0, alignItems: 'center', zIndex: 2 }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...heroShadow }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="emoji-events" size={26} color={colors.primary} />
              </View>
            </View>
          </View>

          <View style={{ borderRadius: radius.cardLg, overflow: 'hidden', ...heroShadow }}>
            {/* Gradient hero */}
            <LinearGradient
              colors={[colors.primary, '#8B0030']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ paddingTop: 40, paddingBottom: 26, paddingHorizontal: 24, alignItems: 'center', gap: 10 }}
            >
              <Text style={{ fontFamily: fontFamily.anuphan.bold, fontSize: 22, color: colors.white, textAlign: 'center' }}>
                {language === 'en' ? 'Well done! 🎉' : 'ดีมากเลย! 🎉'}
              </Text>
              <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 13, color: 'rgba(255,255,255,0.78)', textAlign: 'center' }}>
                {language === 'en' ? 'Your insurance premium is fully paid.' : 'คุณชำระเบี้ยประกันครบแล้ว'}
              </Text>

              <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 5, marginTop: 6 }}>
                <Text style={{ fontFamily: fontFamily.mono.semiBold, fontSize: 10, color: colors.white, letterSpacing: 1.5, textTransform: 'uppercase' }}>Milestone</Text>
              </View>
              <Text style={{ fontFamily: fontFamily.jakarta.extraBold, fontSize: 44, color: colors.white, letterSpacing: -1 }}>
                {language === 'en' ? '12 payments' : '12 งวด'}
              </Text>
              <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{language === 'en' ? 'On-time streak 🔥' : 'ชำระตรงเวลาต่อเนื่อง 🔥'}</Text>
            </LinearGradient>

            {/* Body */}
            <View style={{ backgroundColor: colors.card, padding: 24, alignItems: 'center', gap: 18 }}>
              {/* Payment amount */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.successTint, borderRadius: radius.card, paddingVertical: 11, paddingHorizontal: 16, width: '100%' }}>
                <MaterialIcons name="check-circle" size={20} color={colors.success} />
                <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: 14, color: colors.successDeep }}>
                  {language === 'en' ? 'Payment complete ·' : 'ชำระเสร็จสิ้น ·'}{' '}
                  <Text style={{ fontFamily: fontFamily.jakarta.bold, color: colors.successDeep }}>฿4,250.00</Text>
                </Text>
              </View>

              {/* Action buttons */}
              <View style={{ width: '100%', gap: 10 }}>
                <TouchableOpacity
                  // replace, not navigate: pushing a card screen on top of this
                  // transparentModal makes iOS present it as a pageSheet (black
                  // band + floating card) that sticks for the rest of the stack.
                  onPress={() => navigation.replace('CelebrationDetail')}
                  activeOpacity={0.82}
                  style={{ backgroundColor: colors.primary, borderRadius: radius.button, height: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, ...primaryButtonShadow }}
                >
                  <MaterialIcons name="celebration" size={18} color={colors.white} />
                  <Text style={{ color: colors.white, fontFamily: fontFamily.anuphan.bold, fontSize: 15 }}>{language === 'en' ? 'View Celebration Details' : 'ดูรายละเอียดการฉลอง'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.replace('RewardPrivilege')}
                  activeOpacity={0.82}
                  style={{ borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.button, height: 48, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
                >
                  <MaterialIcons name="card-giftcard" size={18} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontFamily: fontFamily.anuphan.semiBold, fontSize: 14 }}>{language === 'en' ? 'View Your Privileges 🎁' : 'ดูสิทธิพิเศษของคุณ 🎁'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.popToTop()} activeOpacity={0.7} hitSlop={8} style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: fontFamily.anuphan.regular, fontSize: 13, color: colors.textSecondary }}>{language === 'en' ? 'Back to Home' : 'กลับหน้าหลัก'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
