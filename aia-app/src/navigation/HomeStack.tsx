import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { AllServicesScreen } from '../screens/AllServicesScreen';
import { PremiumMgmtScreen } from '../screens/premium/PremiumMgmtScreen';
import { IllustrationScreen } from '../screens/premium/IllustrationScreen';
import { CoverageOverviewScreen } from '../screens/premium/CoverageOverviewScreen';
import { AdjustPlanScreen } from '../screens/premium/AdjustPlanScreen';
import { LifestyleCheckScreen } from '../screens/premium/LifestyleCheckScreen';
import { CostsScreen } from '../screens/premium/CostsScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

// Agent-built premium screens
let AffordabilityScreen: React.ComponentType<any>;
let ValueScreen: React.ComponentType<any>;
let RecommendScreen: React.ComponentType<any>;
let HistoryScreen: React.ComponentType<any>;

try { AffordabilityScreen = require('../screens/premium/AffordabilityScreen').AffordabilityScreen; } catch { AffordabilityScreen = () => <PlaceholderScreen name="สุขภาพการเงิน" />; }
try { ValueScreen = require('../screens/premium/ValueScreen').ValueScreen; } catch { ValueScreen = () => <PlaceholderScreen name="คุณค่าความคุ้มครอง" />; }
try { RecommendScreen = require('../screens/premium/RecommendScreen').RecommendScreen; } catch { RecommendScreen = () => <PlaceholderScreen name="คำแนะนำเฉพาะคุณ" />; }
try { HistoryScreen = require('../screens/premium/HistoryScreen').HistoryScreen; } catch { HistoryScreen = () => <PlaceholderScreen name="ประวัติการชำระ" />; }

// Agent-built payment screens
let PaySelectScreen: React.ComponentType<any>;
let PayCoverageScreen: React.ComponentType<any>;
let PayReviewScreen: React.ComponentType<any>;
let PayMethodScreen: React.ComponentType<any>;
let PayCardScreen: React.ComponentType<any>;
let PayQrScreen: React.ComponentType<any>;
let PaySuccessScreen: React.ComponentType<any>;
let PayCheckingScreen: React.ComponentType<any>;
let PayProcessingScreen: React.ComponentType<any>;
let PayFailedScreen: React.ComponentType<any>;

try { PaySelectScreen = require('../screens/payment/PaySelectScreen').PaySelectScreen; } catch { PaySelectScreen = () => <PlaceholderScreen name="เลือกกรมธรรม์" />; }
try { PayCoverageScreen = require('../screens/payment/PayCoverageScreen').PayCoverageScreen; } catch { PayCoverageScreen = () => <PlaceholderScreen name="ความคุ้มครองเพิ่มเติม" />; }
try { PayReviewScreen = require('../screens/payment/PayReviewScreen').PayReviewScreen; } catch { PayReviewScreen = () => <PlaceholderScreen name="ยืนยันการชำระ" />; }
try { PayMethodScreen = require('../screens/payment/PayMethodScreen').PayMethodScreen; } catch { PayMethodScreen = () => <PlaceholderScreen name="เลือกวิธีชำระ" />; }
try { PayCardScreen = require('../screens/payment/PayCardScreen').PayCardScreen; } catch { PayCardScreen = () => <PlaceholderScreen name="กรอกข้อมูลบัตร" />; }
try { PayQrScreen = require('../screens/payment/PayQrScreen').PayQrScreen; } catch { PayQrScreen = () => <PlaceholderScreen name="QR พร้อมเพย์" />; }
try { PaySuccessScreen = require('../screens/payment/PaySuccessScreen').PaySuccessScreen; } catch { PaySuccessScreen = () => <PlaceholderScreen name="ชำระเงินสำเร็จ" />; }
try { PayCheckingScreen = require('../screens/payment/PayCheckingScreen').PayCheckingScreen; } catch { PayCheckingScreen = () => <PlaceholderScreen name="กำลังตรวจสอบ" />; }
try { PayProcessingScreen = require('../screens/payment/PayProcessingScreen').PayProcessingScreen; } catch { PayProcessingScreen = () => <PlaceholderScreen name="กำลังดำเนินการ" />; }
try { PayFailedScreen = require('../screens/payment/PayFailedScreen').PayFailedScreen; } catch {
  try { PayFailedScreen = require('../screens/system/PayFailedScreen').PayFailedScreen; } catch { PayFailedScreen = () => <PlaceholderScreen name="การชำระเงินไม่สำเร็จ" />; }
}

// Agent-built assistant screens
let AssistantScreen: React.ComponentType<any>;
let AssistantTypingScreen: React.ComponentType<any>;
let AssistantActionScreen: React.ComponentType<any>;

try { AssistantScreen = require('../screens/assistant/AssistantScreen').AssistantScreen; } catch { AssistantScreen = () => <PlaceholderScreen name="ผู้ช่วย AIA" />; }
try { AssistantTypingScreen = require('../screens/assistant/AssistantTypingScreen').AssistantTypingScreen; } catch { AssistantTypingScreen = () => <PlaceholderScreen name="กำลังพิมพ์" />; }
try { AssistantActionScreen = require('../screens/assistant/AssistantActionScreen').AssistantActionScreen; } catch { AssistantActionScreen = () => <PlaceholderScreen name="ผู้ช่วย AIA" />; }

// System screens
let GenericErrorScreen: React.ComponentType<any>;
let OfflineScreen: React.ComponentType<any>;
let SessionTimeoutScreen: React.ComponentType<any>;

try { GenericErrorScreen = require('../screens/system/GenericErrorScreen').GenericErrorScreen; } catch { GenericErrorScreen = () => <PlaceholderScreen name="เกิดข้อผิดพลาด" />; }
try { OfflineScreen = require('../screens/system/OfflineScreen').OfflineScreen; } catch { OfflineScreen = () => <PlaceholderScreen name="ไม่มีอินเทอร์เน็ต" />; }
try { SessionTimeoutScreen = require('../screens/system/SessionTimeoutScreen').SessionTimeoutScreen; } catch { SessionTimeoutScreen = () => <PlaceholderScreen name="หมดเวลาใช้งาน" />; }

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AllServices" component={AllServicesScreen} />
      {/* Premium Management */}
      <Stack.Screen name="PremiumMgmt" component={PremiumMgmtScreen} />
      <Stack.Screen name="Affordability" component={AffordabilityScreen} />
      <Stack.Screen name="Value" component={ValueScreen} />
      <Stack.Screen name="Illustration" component={IllustrationScreen} />
      <Stack.Screen name="CoverageOverview" component={CoverageOverviewScreen} />
      <Stack.Screen name="LifestyleCheck" component={LifestyleCheckScreen} />
      <Stack.Screen name="AdjustPlan" component={AdjustPlanScreen} />
      <Stack.Screen name="Costs" component={CostsScreen} />
      <Stack.Screen name="Recommend" component={RecommendScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      {/* Payment flow */}
      <Stack.Screen name="PaySelect" component={PaySelectScreen} />
      <Stack.Screen name="PayCoverage" component={PayCoverageScreen} />
      <Stack.Screen name="PayReview" component={PayReviewScreen} />
      <Stack.Screen name="PayMethod" component={PayMethodScreen} />
      <Stack.Screen name="PayCard" component={PayCardScreen} />
      <Stack.Screen name="PayQr" component={PayQrScreen} />
      <Stack.Screen name="PaySuccess" component={PaySuccessScreen} />
      <Stack.Screen name="PayChecking" component={PayCheckingScreen} />
      <Stack.Screen name="PayProcessing" component={PayProcessingScreen} />
      <Stack.Screen name="PayFailed" component={PayFailedScreen} />
      {/* AI Assistant */}
      <Stack.Screen name="Assistant" component={AssistantScreen} />
      <Stack.Screen name="AssistantTyping" component={AssistantTypingScreen} />
      <Stack.Screen name="AssistantAction" component={AssistantActionScreen} />
      {/* System */}
      <Stack.Screen name="GenericError" component={GenericErrorScreen} />
      <Stack.Screen name="Offline" component={OfflineScreen} />
      <Stack.Screen name="SessionTimeout" component={SessionTimeoutScreen} />
      {/* Notifications — Call-Intent Prediction stubs */}
      <Stack.Screen name="Notifications" component={require('../screens/notifications/NotificationsScreen').NotificationsScreen} />
      {/* AI Celebration — Delight Mak (full ecosystem) */}
      <Stack.Screen name="Celebration" component={require('../screens/celebration/CelebrationScreen').CelebrationScreen}
        options={{ presentation: 'transparentModal', animation: 'fade' }} />
      <Stack.Screen name="CelebrationDetail" component={require('../screens/celebration/CelebrationDetailScreen').CelebrationDetailScreen} />
      <Stack.Screen name="RewardPrivilege" component={require('../screens/celebration/RewardPrivilegeScreen').RewardPrivilegeScreen} />
      <Stack.Screen name="AICelebrationHub" component={require('../screens/celebration/AICelebrationHubScreen').AICelebrationHubScreen} />
      <Stack.Screen name="BadgeCollection" component={require('../screens/celebration/BadgeCollectionScreen').BadgeCollectionScreen} />
      <Stack.Screen name="ProtectionJourney" component={require('../screens/celebration/ProtectionJourneyScreen').ProtectionJourneyScreen} />
      <Stack.Screen name="GratitudeLetter" component={require('../screens/celebration/GratitudeLetterScreen').GratitudeLetterScreen} />
      <Stack.Screen name="SharePride" component={require('../screens/celebration/SharePrideScreen').SharePrideScreen} />
    </Stack.Navigator>
  );
}
