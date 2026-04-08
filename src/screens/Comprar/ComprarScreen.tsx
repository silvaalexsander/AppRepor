import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { SortOption } from '../../types';
import { ArrowDownAZ, Banknote, Calendar } from 'lucide-react-native';
import { useStore } from '../../store';
import { colors, spacing } from '../../theme';
import { ShoppingCart } from 'lucide-react-native';
import { CATEGORIES } from '../../constants';

export const ComprarScreen = () => {
  const items = useStore((state) => state.items);

  const itemsToBuy = useMemo(() => {
    return items.filter(item => item.currentQuantity <= item.minimumQuantity);
  }, [items]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');

  const filteredItemsToBuy = useMemo(() => {
    let result = selectedCategories.length === 0
      ? [...itemsToBuy]
      : itemsToBuy.filter(item => selectedCategories.includes(item.category));

    return result.sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'price') {
        return (b.lastUnitPrice || 0) - (a.lastUnitPrice || 0);
      }
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [itemsToBuy, selectedCategories, sortBy]);

  const toggleCategory = (cat: string | null) => {
    if (cat === null) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev =>
        prev.includes(cat)
          ? prev.filter(c => c !== cat)
          : [...prev, cat]
      );
    }
  };

  const totalEstimate = useMemo(() => {
    return filteredItemsToBuy.reduce((sum, item) => {
      if (item.lastUnitPrice && item.lastUnitPrice > 0) {
        const needed = Math.max(0, item.minimumQuantity - item.currentQuantity);
        return sum + (needed * item.lastUnitPrice);
      }
      return sum;
    }, 0);
  }, [filteredItemsToBuy]);

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
          <View style={styles.filterSection}>
            <View style={styles.categoriesRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
                <TouchableOpacity
                  style={[styles.chip, selectedCategories.length === 0 && styles.chipSelected]}
                  onPress={() => toggleCategory(null)}
                >
                  <Text style={[styles.chipText, selectedCategories.length === 0 && styles.chipTextSelected]}>Todas</Text>
                </TouchableOpacity>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, selectedCategories.includes(cat) && styles.chipSelected]}
                    onPress={() => toggleCategory(cat)}
                  >
                    <Text style={[styles.chipText, selectedCategories.includes(cat) && styles.chipTextSelected]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.sortingRow}>
              <Text style={styles.sortingLabel}>Ordenação:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortChipsContainer}>
                <TouchableOpacity
                  style={[styles.sortChip, sortBy === 'alphabetical' && styles.sortChipSelected]}
                  onPress={() => setSortBy('alphabetical')}
                >
                  <ArrowDownAZ size={14} color={sortBy === 'alphabetical' ? colors.surface : colors.textSecondary} />
                  <Text style={[styles.sortChipText, sortBy === 'alphabetical' && styles.sortChipTextSelected]}>A-Z</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sortChip, sortBy === 'price' && styles.sortChipSelected]}
                  onPress={() => setSortBy('price')}
                >
                  <Banknote size={14} color={sortBy === 'price' ? colors.surface : colors.textSecondary} />
                  <Text style={[styles.sortChipText, sortBy === 'price' && styles.sortChipTextSelected]}>Preço</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sortChip, sortBy === 'date' && styles.sortChipSelected]}
                  onPress={() => setSortBy('date')}
                >
                  <Calendar size={14} color={sortBy === 'date' ? colors.surface : colors.textSecondary} />
                  <Text style={[styles.sortChipText, sortBy === 'date' && styles.sortChipTextSelected]}>Data</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>

          <FlatList
            data={filteredItemsToBuy}
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
  },
  filterSection: {
    backgroundColor: colors.surface,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoriesRow: {
    marginBottom: spacing.xs,
  },
  sortingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: 2,
  },
  chipsContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: '#F1F5F9',
    marginRight: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.surface,
    fontWeight: '700',
  },
  sortingLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
    marginRight: spacing.sm,
    marginLeft: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sortChipsContainer: {
    gap: spacing.xs,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    marginRight: spacing.xs,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortChipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  sortChipTextSelected: {
    color: colors.surface,
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
