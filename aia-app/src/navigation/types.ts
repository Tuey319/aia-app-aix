import { NavigatorScreenParams } from '@react-navigation/native';
import { CoverageCategoryId } from '../screens/premium/coverageCategories';

export type RootStackParamList = {
  Login: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  PolicyTab: NavigatorScreenParams<PolicyStackParamList>;
  CenterTab: NavigatorScreenParams<ClaimsStackParamList>;
  BenefitsTab: undefined;
  AccountTab: NavigatorScreenParams<AccountStackParamList>;
};

export type HomeStackParamList = {
  Home: undefined;
  // Premium Management
  PremiumMgmt: undefined;
  Affordability: undefined;
  Value: undefined;
  Illustration: undefined;
  CoverageOverview: undefined;
  LifestyleCheck: { category?: CoverageCategoryId } | undefined;
  AdjustPlan: { category?: CoverageCategoryId } | undefined;
  Costs: undefined;
  Recommend: undefined;
  History: undefined;
  HistoryFiltered: undefined;
  // Payment flow
  PaySelect: undefined;
  PayCoverage: undefined;
  PayReview: undefined;
  PayMethod: undefined;
  PayCard: undefined;
  PayQr: undefined;
  PaySuccess: undefined;
  PayChecking: undefined;
  PayProcessing: undefined;
  PayFailed: undefined;
  // AI Assistant
  Assistant: undefined;
  AssistantTyping: undefined;
  AssistantAction: undefined;
  // System
  GenericError: undefined;
  Offline: undefined;
  SessionTimeout: undefined;
  // Notifications (Call-Intent Prediction stubs)
  Notifications: undefined;
  // AI Celebration (Delight Mak)
  Celebration: undefined;
  CelebrationDetail: undefined;
  RewardPrivilege: undefined;
  AICelebrationHub: undefined;
  BadgeCollection: undefined;
  ProtectionJourney: undefined;
  GratitudeLetter: undefined;
  SharePride: undefined;
};

export type PolicyStackParamList = {
  Policy: undefined;
  PolicyDocs: undefined;
  CoverageDetail: undefined;
  Vitality: undefined;
  EmptyPolicies: undefined;
};

export type ClaimsStackParamList = {
  ClaimStart: undefined;
  ClaimDetails: undefined;
  ClaimDocs: undefined;
  ClaimReview: undefined;
  ClaimOtp: undefined;
  ClaimSuccess: undefined;
  ClaimHistory: undefined;
  ClaimSubmitting: undefined;
  ClaimDeclined: undefined;
  EmptyClaims: undefined;
  EmptyHistory: undefined;
};

export type AccountStackParamList = {
  Account: undefined;
  ProfileEdit: undefined;
  Support: undefined;
  FaqList: undefined;
  FaqSearch: undefined;
  FaqAnswer: undefined;
  ChangeFreq: undefined;
  FreqConfirm: undefined;
  ContactAgent: undefined;
  SearchLoading: undefined;
  Assistant: undefined;
};
