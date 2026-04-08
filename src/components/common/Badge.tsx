import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';
import { StockStatus } from '../../types';

interface BadgeProps {
  status: StockStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'OK':
        return { bg: '#dcfce7', text: colors.success, label: 'OK' }; // green
      case 'LOW':
        return { bg: '#fef9c3', text: colors.warning, label: 'Baixo' }; // yellow
      case 'BUY':
        return { bg: '#fee2e2', text: colors.error, label: 'Comprar' }; // red
      default:
        return { bg: colors.border, text: colors.textSecondary, label: '-' };
    }
  };

  const config = getBadgeConfig();

  return (
    <View style={[styles.container, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
