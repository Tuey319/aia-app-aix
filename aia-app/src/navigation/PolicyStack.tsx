import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PolicyStackParamList } from './types';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator<PolicyStackParamList>();

// Lazy imports — screens written by agent; fall back to placeholder if not yet present
let PolicyScreen: React.ComponentType<any>;
let PolicyDocsScreen: React.ComponentType<any>;
let CoverageDetailScreen: React.ComponentType<any>;
let VitalityScreen: React.ComponentType<any>;
let EmptyPoliciesScreen: React.ComponentType<any>;
let AllPoliciesScreen: React.ComponentType<any>;
let PolicyDetailScreen: React.ComponentType<any>;
let PremiumPaymentInfoScreen: React.ComponentType<any>;
let ChangeFreqScreen: React.ComponentType<any>;
let FreqConfirmScreen: React.ComponentType<any>;
let FreqOtpScreen: React.ComponentType<any>;
let FreqSubmittingScreen: React.ComponentType<any>;
let FreqSuccessScreen: React.ComponentType<any>;

try { PolicyScreen = require('../screens/policy/PolicyScreen').PolicyScreen; } catch { PolicyScreen = () => <PlaceholderScreen name="กรมธรรม์" />; }
try { PolicyDocsScreen = require('../screens/policy/PolicyDocsScreen').PolicyDocsScreen; } catch { PolicyDocsScreen = () => <PlaceholderScreen name="เอกสารกรมธรรม์" />; }
try { CoverageDetailScreen = require('../screens/policy/CoverageDetailScreen').CoverageDetailScreen; } catch { CoverageDetailScreen = () => <PlaceholderScreen name="ค่ารักษาผู้ป่วยใน" />; }
try { VitalityScreen = require('../screens/policy/VitalityScreen').VitalityScreen; } catch { VitalityScreen = () => <PlaceholderScreen name="AIA Vitality" />; }
try { EmptyPoliciesScreen = require('../screens/system/EmptyPoliciesScreen').EmptyPoliciesScreen; } catch { EmptyPoliciesScreen = () => <PlaceholderScreen name="ยังไม่มีกรมธรรม์" />; }
try { AllPoliciesScreen = require('../screens/policy/AllPoliciesScreen').AllPoliciesScreen; } catch { AllPoliciesScreen = () => <PlaceholderScreen name="กรมธรรม์ทั้งหมด" />; }
try { PolicyDetailScreen = require('../screens/policy/PolicyDetailScreen').PolicyDetailScreen; } catch { PolicyDetailScreen = () => <PlaceholderScreen name="รายละเอียดกรมธรรม์" />; }
try { PremiumPaymentInfoScreen = require('../screens/policy/PremiumPaymentInfoScreen').PremiumPaymentInfoScreen; } catch { PremiumPaymentInfoScreen = () => <PlaceholderScreen name="การชำระเบี้ยฯ" />; }
try { ChangeFreqScreen = require('../screens/support/ChangeFreqScreen').ChangeFreqScreen; } catch { ChangeFreqScreen = () => <PlaceholderScreen name="เปลี่ยนงวดชำระ" />; }
try { FreqConfirmScreen = require('../screens/support/FreqConfirmScreen').FreqConfirmScreen; } catch { FreqConfirmScreen = () => <PlaceholderScreen name="ยืนยันการเปลี่ยน" />; }
try { FreqOtpScreen = require('../screens/support/FreqOtpScreen').FreqOtpScreen; } catch { FreqOtpScreen = () => <PlaceholderScreen name="ใส่รหัส OTP" />; }
try { FreqSubmittingScreen = require('../screens/support/FreqSubmittingScreen').FreqSubmittingScreen; } catch { FreqSubmittingScreen = () => <PlaceholderScreen name="กำลังดำเนินการ" />; }
try { FreqSuccessScreen = require('../screens/support/FreqSuccessScreen').FreqSuccessScreen; } catch { FreqSuccessScreen = () => <PlaceholderScreen name="สำเร็จ" />; }

export function PolicyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Policy" component={PolicyScreen} />
      <Stack.Screen name="PolicyDocs" component={PolicyDocsScreen} />
      <Stack.Screen name="CoverageDetail" component={CoverageDetailScreen} />
      <Stack.Screen name="Vitality" component={VitalityScreen} />
      <Stack.Screen name="EmptyPolicies" component={EmptyPoliciesScreen} />
      <Stack.Screen name="AllPolicies" component={AllPoliciesScreen} />
      <Stack.Screen name="PolicyDetail" component={PolicyDetailScreen} />
      <Stack.Screen name="PremiumPaymentInfo" component={PremiumPaymentInfoScreen} />
      <Stack.Screen name="ChangeFreq" component={ChangeFreqScreen} />
      <Stack.Screen name="FreqConfirm" component={FreqConfirmScreen} />
      <Stack.Screen name="FreqOtp" component={FreqOtpScreen} />
      <Stack.Screen name="FreqSubmitting" component={FreqSubmittingScreen} />
      <Stack.Screen name="FreqSuccess" component={FreqSuccessScreen} />
    </Stack.Navigator>
  );
}
