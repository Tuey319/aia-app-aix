import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PolicyStackParamList } from './types';
import { PolicyScreen } from '../screens/policy/PolicyScreen';
import { PolicyDocsScreen } from '../screens/policy/PolicyDocsScreen';
import { CoverageDetailScreen } from '../screens/policy/CoverageDetailScreen';
import { VitalityScreen } from '../screens/policy/VitalityScreen';
import { EmptyPoliciesScreen } from '../screens/system/EmptyPoliciesScreen';
import { AllPoliciesScreen } from '../screens/policy/AllPoliciesScreen';
import { PolicyDetailScreen } from '../screens/policy/PolicyDetailScreen';
import { PremiumPaymentInfoScreen } from '../screens/policy/PremiumPaymentInfoScreen';
import { ChangeFreqScreen } from '../screens/support/ChangeFreqScreen';
import { FreqConfirmScreen } from '../screens/support/FreqConfirmScreen';
import { FreqOtpScreen } from '../screens/support/FreqOtpScreen';
import { FreqSubmittingScreen } from '../screens/support/FreqSubmittingScreen';
import { FreqSuccessScreen } from '../screens/support/FreqSuccessScreen';

const Stack = createNativeStackNavigator<PolicyStackParamList>();

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
