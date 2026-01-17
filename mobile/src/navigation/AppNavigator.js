import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import StudentNavigator from './StudentNavigator';
import TeacherNavigator from './TeacherNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return null; // or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : user?.role === 'student' ? (
          <Stack.Screen name="StudentApp" component={StudentNavigator} />
        ) : (
          <Stack.Screen name="TeacherApp" component={TeacherNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
