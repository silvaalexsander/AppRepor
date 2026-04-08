import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Item, StockStatus } from '../../types';
import { colors, spacing } from '../../theme';
import { Badge } from '../common/Badge';
import { PlusCircle, MinusCircle } from 'lucide-react-native';

interface ItemCardProps {
  item: Item;
  onPress: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onPress, onIncrease, onDecrease }) => {
  const getStatus = (): StockStatus => {
    if (item.currentQuantity <= item.minimumQuantity) return 'BUY';
    if (item.currentQuantity <= item.minimumQuantity * 1.5) return 'LOW'; // Low if within 50% above minimum
    return 'OK';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
        <Badge status={getStatus()} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Qtd atual</Text>
          <Text style={styles.quantityValue}>
            {item.currentQuantity} <Text style={styles.unit}>{item.unit}</Text>
          </Text>
          <Text style={styles.minQuantity}>Mínimo: {item.minimumQuantity}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onDecrease}>
            <MinusCircle size={32} color={item.currentQuantity === 0 ? colors.border : colors.error} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onIncrease}>
            <PlusCircle size={32} color={colors.success} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  quantityContainer: {
    flex: 1,
  },
  quantityLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  quantityValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  unit: {
    fontSize: 16,
    fontWeight: 'normal',
    color: colors.textSecondary,
  },
  minQuantity: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.xs,
  },
});
