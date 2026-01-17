import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { COLORS, SPACING, FONTS } from '../../constants/colors';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t.error, 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);

    if (!result.success) {
      Alert.alert(t.error, result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="book" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Digital Pathshala</Text>
          <Text style={styles.subtitle}>{t.welcomeBack}</Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t.email}
            value={email}
            onChangeText={setEmail}
            placeholder="student@school.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label={t.password}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <Button
            title={t.signIn}
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          />

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>
              {t.dontHaveAccount}{' '}
              <Text style={styles.linkBold}>{t.register}</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoCredentials}>
          <Text style={styles.demoTitle}>Demo Credentials:</Text>
          <Text style={styles.demoText}>Teacher: teacher@school.com / teacher123</Text>
          <Text style={styles.demoText}>Student: student1@school.com / student123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes['3xl'],
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  button: {
    marginTop: SPACING.md,
  },
  linkContainer: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  linkText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  linkBold: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  demoCredentials: {
    backgroundColor: `${COLORS.secondary}10`,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.secondary}30`,
  },
  demoTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  demoText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginVertical: 2,
  },
});
