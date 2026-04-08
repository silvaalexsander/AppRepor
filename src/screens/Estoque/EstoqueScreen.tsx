import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
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

  const filteredItems = useMemo(() => {
    if (selectedCategories.length === 0) return items;
    return items.filter(item => selectedCategories.includes(item.category));
  }, [items, selectedCategories]);

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Estoque</Text>
        <Button title="Adicionar" onPress={handleAddItem} />
      </View>

      <View style={styles.categoriesWrapper}>
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
  categoriesWrapper: {
    backgroundColor: colors.surface,
    paddingBottom: spacing.sm,
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
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
