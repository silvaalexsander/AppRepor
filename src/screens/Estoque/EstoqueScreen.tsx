import React, { useState, useMemo, useLayoutEffect } from 'react';
import { View, StyleSheet, FlatList, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { SortOption } from '../../types';
import { LayoutGrid, ArrowDownAZ, Banknote, Calendar, Info } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../../navigation/types';
import { useStore } from '../../store';
import { ItemCard } from '../../components/item/ItemCard';
import { Button } from '../../components/common/Button';
import { colors, spacing } from '../../theme';
import { CATEGORIES } from '../../constants';

export const EstoqueScreen = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const items = useStore((state) => state.items);
  const decreaseItem = useStore((state) => state.decreaseItem);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');

  const filteredItems = useMemo(() => {
    let result = selectedCategories.length === 0
      ? [...items]
      : items.filter(item => selectedCategories.includes(item.category));

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
  }, [items, selectedCategories, sortBy]);

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

  const handleAddItem = () => {
    navigation.navigate('ItemForm', {});
  };

  const handleItemPress = (id: string) => {
    navigation.navigate('ItemDetails', { id });
  };

  const handleAbout = () => {
    navigation.navigate('About');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleAbout} style={{ marginRight: spacing.md }}>
          <Info size={24} color={colors.surface} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Estoque</Text>
        <Button title="Adicionar" onPress={handleAddItem} />
      </View>

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

      {filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum item encontrado.</Text>
          <Text style={styles.emptySubText}>Tente outra categoria ou adicione um novo produto.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() => handleItemPress(item.id)}
              onDecrease={() => decreaseItem(item.id, 1)}
            />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
