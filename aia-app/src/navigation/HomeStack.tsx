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
import { AffordabilityScreen } from '../screens/premium/AffordabilityScreen';
import { ValueScreen } from '../screens/premium/ValueScreen';
import { RecommendScreen } from '../screens/premium/RecommendScreen';
import { HistoryScreen } from '../screens/premium/HistoryScreen';
import { PaySelectScreen } from '../screens/payment/PaySelectScreen';
import { PayCoverageScreen } from '../screens/payment/PayCoverageScreen';
import { PayReviewScreen } from '../screens/payment/PayReviewScreen';
import { PayMethodScreen } from '../screens/payment/PayMethodScreen';
import { PayCardScreen } from '../screens/payment/PayCardScreen';
import { PayQrScreen } from '../screens/payment/PayQrScreen';
import { PaySuccessScreen } from '../screens/payment/PaySuccessScreen';
import { PayCheckingScreen } from '../screens/payment/PayCheckingScreen';
import { PayProcessingScreen } from '../screens/payment/PayProcessingScreen';
import { PayFailedScreen } from '../screens/system/PayFailedScreen';
import { AssistantScreen } from '../screens/assistant/AssistantScreen';
import { GenericErrorScreen } from '../screens/system/GenericErrorScreen';
import { OfflineScreen } from '../screens/system/OfflineScreen';
import { SessionTimeoutScreen } from '../screens/system/SessionTimeoutScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { CelebrationScreen } from '../screens/celebration/CelebrationScreen';
import { CelebrationDetailScreen } from '../screens/celebration/CelebrationDetailScreen';
import { RewardPrivilegeScreen } from '../screens/celebration/RewardPrivilegeScreen';
import { AICelebrationHubScreen } from '../screens/celebration/AICelebrationHubScreen';
import { BadgeCollectionScreen } from '../screens/celebration/BadgeCollectionScreen';
import { ProtectionJourneyScreen } from '../screens/celebration/ProtectionJourneyScreen';
import { GratitudeLetterScreen } from '../screens/celebration/GratitudeLetterScreen';
import { SharePrideScreen } from '../screens/celebration/SharePrideScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

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
      {/* System */}
      <Stack.Screen name="GenericError" component={GenericErrorScreen} />
      <Stack.Screen name="Offline" component={OfflineScreen} />
      <Stack.Screen name="SessionTimeout" component={SessionTimeoutScreen} />
      {/* Notifications — Call-Intent Prediction stubs */}
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      {/* AI Celebration — Delight Mak (full ecosystem) */}
      <Stack.Screen name="Celebration" component={CelebrationScreen}
        options={{ presentation: 'transparentModal', animation: 'fade' }} />
      <Stack.Screen name="CelebrationDetail" component={CelebrationDetailScreen} />
      <Stack.Screen name="RewardPrivilege" component={RewardPrivilegeScreen} />
      <Stack.Screen name="AICelebrationHub" component={AICelebrationHubScreen} />
      <Stack.Screen name="BadgeCollection" component={BadgeCollectionScreen} />
      <Stack.Screen name="ProtectionJourney" component={ProtectionJourneyScreen} />
      <Stack.Screen name="GratitudeLetter" component={GratitudeLetterScreen} />
      <Stack.Screen name="SharePride" component={SharePrideScreen} />
    </Stack.Navigator>
  );
}
