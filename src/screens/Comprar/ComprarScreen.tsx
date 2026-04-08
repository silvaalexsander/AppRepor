import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, Text, SafeAreaView } from 'react-native';
import { useStore } from '../../store';
import { colors, spacing } from '../../theme';
import { ShoppingCart } from 'lucide-react-native';

export const ComprarScreen = () => {
  const items = useStore((state) => state.items);

  const itemsToBuy = useMemo(() => {
    return items.filter(item => item.currentQuantity <= item.minimumQuantity);
  }, [items]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Precisa Comprar</Text>
      </View>

      {itemsToBuy.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingCart size={48} color={colors.border} style={{ marginBottom: spacing.md }} />
          <Text style={styles.emptyText}>Tudo certo por aqui!</Text>
          <Text style={styles.emptySubText}>O estoque está abastecido.</Text>
        </View>
      ) : (
        <FlatList
          data={itemsToBuy}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.infoCol}>
                  <Text style={styles.label}>Atual</Text>
                  <Text style={[styles.value, { color: colors.error }]}>
                    {item.currentQuantity.toFixed(1).replace('.', ',')} <Text style={styles.unit}>{item.unit}</Text>
                  </Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.label}>Mínimo ideal</Text>
                  <Text style={styles.value}>
                    {item.minimumQuantity.toFixed(1).replace('.', ',')} <Text style={styles.unit}>{item.unit}</Text>
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  listContent: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    marginBottom: spacing.md,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  unit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: colors.textSecondary,
  },
});
