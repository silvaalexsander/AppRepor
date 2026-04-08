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
    if (item.currentQuantity <= item.minimumQuantity * 1.4) return 'LOW'; // Baixo até 40% acima do mínimo
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
            {item.currentQuantity.toFixed(1).replace('.', ',')} <Text style={styles.unit}>{item.unit}</Text>
          </Text>
          <Text style={styles.minQuantity}>Mínimo: {item.minimumQuantity.toFixed(1).replace('.', ',')}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onDecrease}>
            <MinusCircle size={28} color={item.currentQuantity === 0 ? colors.border : colors.error} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onIncrease}>
            <PlusCircle size={28} color={colors.success} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 15,
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
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 2,
    letterSpacing: -0.5,
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
    gap: spacing.md,
  },
  actionButton: {
    backgroundColor: colors.background,
    borderRadius: 100,
    padding: spacing.sm,
  },
});
