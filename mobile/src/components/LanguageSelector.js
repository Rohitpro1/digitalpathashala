import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '../hooks/useLanguage';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/colors';

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { key: 'english', label: 'English' },
    { key: 'hindi', label: 'हिन्दी' },
    { key: 'punjabi', label: 'ਪੰਜਾਬੀ' },
  ];

  return (
    <View style={styles.container}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.key}
          style={[
            styles.button,
            language === lang.key && styles.activeButton,
          ]}
          onPress={() => setLanguage(lang.key)}
        >
          <Text
            style={[
              styles.text,
              language === lang.key && styles.activeText,
            ]}
          >
            {lang.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginHorizontal: SPACING.xs / 2,
  },
  activeButton: {
    backgroundColor: COLORS.primary,
  },
  text: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.text,
  },
  activeText: {
    color: COLORS.surface,
  },
});
