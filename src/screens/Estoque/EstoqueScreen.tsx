import React from 'react';
import { View, StyleSheet, FlatList, Text, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../../navigation/types';
import { useStore } from '../../store';
import { ItemCard } from '../../components/item/ItemCard';
import { Button } from '../../components/common/Button';
import { colors, spacing } from '../../theme';

export const EstoqueScreen = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const items = useStore((state) => state.items);
  const increaseItem = useStore((state) => state.increaseItem);
  const decreaseItem = useStore((state) => state.decreaseItem);

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

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não tem itens no estoque.</Text>
          <Text style={styles.emptySubText}>Toque em "Adicionar" para começar.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() => handleItemPress(item.id)}
              onIncrease={() => increaseItem(item.id, 1)}
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
