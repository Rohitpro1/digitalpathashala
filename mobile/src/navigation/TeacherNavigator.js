import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/colors';

// Placeholder Teacher Dashboard
const TeacherDashboard = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Teacher Dashboard</Text>
    <Text style={styles.subtitle}>Full teacher features coming soon!</Text>
  </View>
);

const Stack = createNativeStackNavigator();

export default function TeacherNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.secondary,
        },
        headerTintColor: COLORS.surface,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={TeacherDashboard}
        options={{ title: 'Teacher Dashboard' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  title: {
    fontSize: FONTS.sizes['3xl'],
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
