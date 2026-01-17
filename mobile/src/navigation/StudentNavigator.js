import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentDashboard from '../screens/Student/StudentDashboard';
import { COLORS } from '../constants/colors';

const Stack = createNativeStackNavigator();

export default function StudentNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.surface,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={StudentDashboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
