import React from 'react';
import { Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { HomeStack } from './HomeStack';
import { PolicyStack } from './PolicyStack';
import { VitalityStack } from './VitalityStack';
import { ClaimsStack } from './ClaimsStack';
import { AccountStack } from './AccountStack';
import { BenefitsScreen } from '../screens/benefits/BenefitsScreen';
import { colors, fontFamily } from '../tokens';
import { AiaLogo } from '../components/AiaLogo';
import { useStrings } from '../i18n';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ fontFamily: fontFamily.anuphan.medium, fontSize: 10, color: focused ? colors.primary : colors.textSecondary, marginTop: 2 }}>
      {label}
    </Text>
  );
}

export function TabNavigator() {
  const s = useStrings();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.hairline,
          borderTopWidth: 0.5,
          height: Platform.OS === 'ios' ? 94 : 74,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 18,
          // Subtle shadow above tab bar
          shadowColor: '#14141E',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarIcon: () => <AiaLogo size={24} />,
          tabBarLabel: ({ focused }) => <TabLabel label={s.tabs.home} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="PolicyTab"
        component={PolicyStack}
        options={{
          tabBarIcon: ({ focused }) => <MaterialCommunityIcons name="shield-outline" size={24} color={focused ? colors.primary : colors.textSecondary} />,
          tabBarLabel: ({ focused }) => <TabLabel label={s.tabs.policy} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="VitalityTab"
        component={VitalityStack}
        options={{
          tabBarIcon: ({ focused }) => <MaterialIcons name="check-circle-outline" size={24} color={focused ? colors.primary : colors.textSecondary} />,
          tabBarLabel: ({ focused }) => <TabLabel label={s.tabs.vitality} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="BenefitsTab"
        component={BenefitsScreen}
        options={{
          tabBarIcon: ({ focused }) => <MaterialIcons name="card-giftcard" size={24} color={focused ? colors.primary : colors.textSecondary} />,
          tabBarLabel: ({ focused }) => <TabLabel label={s.tabs.benefits} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="AccountTab"
        component={AccountStack}
        options={{
          tabBarIcon: ({ focused }) => <MaterialIcons name="person-outline" size={24} color={focused ? colors.primary : colors.textSecondary} />,
          tabBarLabel: ({ focused }) => <TabLabel label={s.tabs.account} focused={focused} />,
        }}
      />
      {/* Hidden tab: no visible button, but mounted so Home's "claim" quick
          action can navigate here via navigation.navigate('ClaimsTab', {...}). */}
      <Tab.Screen
        name="ClaimsTab"
        component={ClaimsStack}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
}
