import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOffline } from '../hooks/useOffline';
import { useLanguage } from '../hooks/useLanguage';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/colors';

export const OfflineIndicator = () => {
  const { isOffline, isSyncing } = useOffline();
  const { t } = useLanguage();

  if (!isOffline && !isSyncing) return null;

  return (
    <View style={[styles.container, isSyncing && styles.syncing]}>
      <Ionicons
        name={isSyncing ? 'sync' : 'cloud-offline'}
        size={16}
        color={COLORS.surface}
        style={isSyncing && styles.spinningIcon}
      />
      <Text style={styles.text}>
        {isSyncing ? t.syncing : t.offline}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offline,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  syncing: {
    backgroundColor: COLORS.primary,
  },
  text: {
    color: COLORS.surface,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  spinningIcon: {
    // Add rotation animation if needed
  },
});
