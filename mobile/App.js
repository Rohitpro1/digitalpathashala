import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/hooks/useAuth';
import { LanguageProvider } from './src/hooks/useLanguage';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LanguageProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </LanguageProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
