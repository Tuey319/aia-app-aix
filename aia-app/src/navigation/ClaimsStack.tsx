import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClaimsStackParamList } from './types';
import { ClaimStartScreen } from '../screens/claims/ClaimStartScreen';
import { ClaimDetailsScreen } from '../screens/claims/ClaimDetailsScreen';
import { ClaimDocsScreen } from '../screens/claims/ClaimDocsScreen';
import { ClaimReviewScreen } from '../screens/claims/ClaimReviewScreen';
import { ClaimOtpScreen } from '../screens/claims/ClaimOtpScreen';
import { ClaimSuccessScreen } from '../screens/claims/ClaimSuccessScreen';
import { ClaimHistoryScreen } from '../screens/claims/ClaimHistoryScreen';
import { ClaimSubmittingScreen } from '../screens/claims/ClaimSubmittingScreen';
import { ClaimDeclinedScreen } from '../screens/claims/ClaimDeclinedScreen';
import { EmptyClaimsScreen } from '../screens/system/EmptyClaimsScreen';
import { EmptyHistoryScreen } from '../screens/system/EmptyHistoryScreen';

const Stack = createNativeStackNavigator<ClaimsStackParamList>();

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
