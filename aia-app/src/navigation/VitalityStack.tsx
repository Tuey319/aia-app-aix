import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VitalityStackParamList } from './types';
import { VitalityScreen } from '../screens/policy/VitalityScreen';

const Stack = createNativeStackNavigator<VitalityStackParamList>();

export function VitalityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Vitality" component={VitalityScreen} />
    </Stack.Navigator>
  );
}
