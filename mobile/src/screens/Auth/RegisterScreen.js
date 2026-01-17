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
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { COLORS, SPACING, FONTS } from '../../constants/colors';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    class_name: '',
    school: 'Government School Nabha',
    language_preference: 'punjabi',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert(t.error, 'Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert(t.error, 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(formData);
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
            <Ionicons name="person-add" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>{t.createAccount}</Text>
          <Text style={styles.subtitle}>Join Digital Pathshala</Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t.name}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Simran Singh"
          />

          <Input
            label={t.email}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="your.email@school.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label={t.password}
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            placeholder="••••••••"
            secureTextEntry
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>{t.role}</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <Picker.Item label={t.student} value="student" />
                <Picker.Item label={t.teacher} value="teacher" />
              </Picker>
            </View>
          </View>

          {formData.role === 'student' && (
            <Input
              label={t.class}
              value={formData.class_name}
              onChangeText={(text) => setFormData({ ...formData, class_name: text })}
              placeholder="Class 8A"
            />
          )}

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>{t.preferredLanguage}</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={formData.language_preference}
                onValueChange={(value) => setFormData({ ...formData, language_preference: value })}
              >
                <Picker.Item label="ਪੰਜਾਬੀ (Punjabi)" value="punjabi" />
                <Picker.Item label="हिन्दी (Hindi)" value="hindi" />
                <Picker.Item label="English" value="english" />
              </Picker>
            </View>
          </View>

          <Button
            title={t.register}
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
          />

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>
              {t.alreadyHaveAccount}{' '}
              <Text style={styles.linkBold}>{t.signIn}</Text>
            </Text>
          </TouchableOpacity>
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
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
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
    fontSize: FONTS.sizes['2xl'],
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  pickerContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  picker: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
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
});
