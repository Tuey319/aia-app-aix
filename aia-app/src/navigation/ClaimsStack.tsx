import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClaimsStackParamList } from './types';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator<ClaimsStackParamList>();

let ClaimStartScreen: React.ComponentType<any>;
let ClaimDetailsScreen: React.ComponentType<any>;
let ClaimDocsScreen: React.ComponentType<any>;
let ClaimReviewScreen: React.ComponentType<any>;
let ClaimOtpScreen: React.ComponentType<any>;
let ClaimSuccessScreen: React.ComponentType<any>;
let ClaimHistoryScreen: React.ComponentType<any>;
let ClaimSubmittingScreen: React.ComponentType<any>;
let ClaimDeclinedScreen: React.ComponentType<any>;
let EmptyClaimsScreen: React.ComponentType<any>;
let EmptyHistoryScreen: React.ComponentType<any>;

try { ClaimStartScreen = require('../screens/claims/ClaimStartScreen').ClaimStartScreen; } catch { ClaimStartScreen = () => <PlaceholderScreen name="เคลมของฉัน" />; }
try { ClaimDetailsScreen = require('../screens/claims/ClaimDetailsScreen').ClaimDetailsScreen; } catch { ClaimDetailsScreen = () => <PlaceholderScreen name="ยื่นเคลมใหม่" />; }
try { ClaimDocsScreen = require('../screens/claims/ClaimDocsScreen').ClaimDocsScreen; } catch { ClaimDocsScreen = () => <PlaceholderScreen name="อัปโหลดเอกสาร" />; }
try { ClaimReviewScreen = require('../screens/claims/ClaimReviewScreen').ClaimReviewScreen; } catch { ClaimReviewScreen = () => <PlaceholderScreen name="ตรวจสอบและส่งเคลม" />; }
try { ClaimOtpScreen = require('../screens/claims/ClaimOtpScreen').ClaimOtpScreen; } catch { ClaimOtpScreen = () => <PlaceholderScreen name="ใส่รหัส OTP" />; }
try { ClaimSuccessScreen = require('../screens/claims/ClaimSuccessScreen').ClaimSuccessScreen; } catch { ClaimSuccessScreen = () => <PlaceholderScreen name="ส่งเคลมสำเร็จ" />; }
try { ClaimHistoryScreen = require('../screens/claims/ClaimHistoryScreen').ClaimHistoryScreen; } catch { ClaimHistoryScreen = () => <PlaceholderScreen name="ประวัติการเคลม" />; }
try { ClaimSubmittingScreen = require('../screens/claims/ClaimSubmittingScreen').ClaimSubmittingScreen; } catch { ClaimSubmittingScreen = () => <PlaceholderScreen name="กำลังส่งข้อมูล" />; }
try { ClaimDeclinedScreen = require('../screens/claims/ClaimDeclinedScreen').ClaimDeclinedScreen; } catch { ClaimDeclinedScreen = () => <PlaceholderScreen name="เคลมถูกปฏิเสธ" />; }
try { EmptyClaimsScreen = require('../screens/system/EmptyClaimsScreen').EmptyClaimsScreen; } catch { EmptyClaimsScreen = () => <PlaceholderScreen name="ยังไม่มีรายการเคลม" />; }
try { EmptyHistoryScreen = require('../screens/system/EmptyHistoryScreen').EmptyHistoryScreen; } catch { EmptyHistoryScreen = () => <PlaceholderScreen name="ยังไม่มีประวัติ" />; }

export function ClaimsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClaimStart" component={ClaimStartScreen} />
      <Stack.Screen name="ClaimDetails" component={ClaimDetailsScreen} />
      <Stack.Screen name="ClaimDocs" component={ClaimDocsScreen} />
      <Stack.Screen name="ClaimReview" component={ClaimReviewScreen} />
      <Stack.Screen name="ClaimOtp" component={ClaimOtpScreen} />
      <Stack.Screen name="ClaimSuccess" component={ClaimSuccessScreen} />
      <Stack.Screen name="ClaimHistory" component={ClaimHistoryScreen} />
      <Stack.Screen name="ClaimSubmitting" component={ClaimSubmittingScreen} />
      <Stack.Screen name="ClaimDeclined" component={ClaimDeclinedScreen} />
      <Stack.Screen name="EmptyClaims" component={EmptyClaimsScreen} />
      <Stack.Screen name="EmptyHistory" component={EmptyHistoryScreen} />
    </Stack.Navigator>
  );
}
