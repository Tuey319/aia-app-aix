import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VitalityStackParamList } from './types';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator<VitalityStackParamList>();

let VitalityScreen: React.ComponentType<any>;
try { VitalityScreen = require('../screens/policy/VitalityScreen').VitalityScreen; } catch { VitalityScreen = () => <PlaceholderScreen name="AIA Vitality" />; }

export function VitalityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Vitality" component={VitalityScreen} />
    </Stack.Navigator>
  );
}
