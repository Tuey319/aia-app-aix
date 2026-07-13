import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountStackParamList } from './types';
import { AccountScreen } from '../screens/account/AccountScreen';
import { ProfileEditScreen } from '../screens/account/ProfileEditScreen';
import { SupportScreen } from '../screens/support/SupportScreen';
import { FaqListScreen } from '../screens/support/FaqListScreen';
import { FaqSearchScreen } from '../screens/support/FaqSearchScreen';
import { FaqAnswerScreen } from '../screens/support/FaqAnswerScreen';
import { ChangeFreqScreen } from '../screens/support/ChangeFreqScreen';
import { FreqConfirmScreen } from '../screens/support/FreqConfirmScreen';
import { FreqOtpScreen } from '../screens/support/FreqOtpScreen';
import { FreqSubmittingScreen } from '../screens/support/FreqSubmittingScreen';
import { FreqSuccessScreen } from '../screens/support/FreqSuccessScreen';
import { ContactAgentScreen } from '../screens/support/ContactAgentScreen';
import { SearchLoadingScreen } from '../screens/system/SearchLoadingScreen';
import { AssistantScreen } from '../screens/assistant/AssistantScreen';

const Stack = createNativeStackNavigator<AccountStackParamList>();

export function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="FaqList" component={FaqListScreen} />
      <Stack.Screen name="FaqSearch" component={FaqSearchScreen} />
      <Stack.Screen name="FaqAnswer" component={FaqAnswerScreen} />
      <Stack.Screen name="ChangeFreq" component={ChangeFreqScreen} />
      <Stack.Screen name="FreqConfirm" component={FreqConfirmScreen} />
      <Stack.Screen name="FreqOtp" component={FreqOtpScreen} />
      <Stack.Screen name="FreqSubmitting" component={FreqSubmittingScreen} />
      <Stack.Screen name="FreqSuccess" component={FreqSuccessScreen} />
      <Stack.Screen name="ContactAgent" component={ContactAgentScreen} />
      <Stack.Screen name="SearchLoading" component={SearchLoadingScreen} />
      <Stack.Screen name="Assistant" component={AssistantScreen} />
    </Stack.Navigator>
  );
}
