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

  const totalEstimate = useMemo(() => {
    return itemsToBuy.reduce((sum, item) => {
      if (item.lastUnitPrice && item.lastUnitPrice > 0) {
        const needed = Math.max(0, item.minimumQuantity - item.currentQuantity);
        return sum + (needed * item.lastUnitPrice);
      }
      return sum;
    }, 0);
  }, [itemsToBuy]);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

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
        <>
          <FlatList
            data={itemsToBuy}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const needed = Math.max(0, item.minimumQuantity - item.currentQuantity);
              const subtotal = item.lastUnitPrice ? needed * item.lastUnitPrice : null;

              return (
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
                    <View style={styles.infoCol}>
                      <Text style={styles.label}>Falta</Text>
                      <Text style={[styles.value, { color: colors.primary }]}>
                        {needed.toFixed(1).replace('.', ',')} <Text style={styles.unit}>{item.unit}</Text>
                      </Text>
                    </View>
                  </View>

                  {item.lastUnitPrice !== undefined && item.lastUnitPrice > 0 && (
                    <View style={styles.priceRow}>
                      <View style={styles.priceInfo}>
                        <Text style={styles.priceLabel}>Últ. preço:</Text>
                        <Text style={styles.priceValue}>{formatCurrency(item.lastUnitPrice)}/{item.unit}</Text>
                      </View>
                      {subtotal !== null && (
                        <View style={styles.subtotalInfo}>
                          <Text style={styles.subtotalLabel}>Subtotal:</Text>
                          <Text style={styles.subtotalValue}>{formatCurrency(subtotal)}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            }}
          />

          {totalEstimate > 0 && (
            <View style={styles.footer}>
              <Text style={styles.footerLabel}>Estimativa da próxima compra</Text>
              <Text style={styles.footerValue}>{formatCurrency(totalEstimate)}</Text>
            </View>
          )}
        </>
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
    paddingTop: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
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
    marginBottom: spacing.md,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
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
    fontWeight: '900',
    color: colors.text,
  },
  unit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  subtotalInfo: {
    alignItems: 'flex-end',
  },
  subtotalLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  subtotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  footerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  footerValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.5,
  },
});
