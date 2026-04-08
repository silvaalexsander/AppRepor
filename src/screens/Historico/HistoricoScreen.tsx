import React from 'react';
import { View, StyleSheet, FlatList, Text, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { useStore } from '../../store';
import { colors, spacing } from '../../theme';
import { formatDate } from '../../utils';
import { ArrowDownRight, ArrowUpRight, PlusCircle, RefreshCw } from 'lucide-react-native';

export const HistoricoScreen = () => {
  const movements = useStore((state) => state.movements);
  const clearMovements = useStore((state) => state.clearMovements);

  const handleClear = () => {
    Alert.alert(
      'Limpar Histórico',
      'Tem certeza que deseja apagar todo o histórico de movimentações?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: clearMovements },
      ]
    );
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'ENTRY': return <ArrowUpRight color={colors.success} size={24} />;
      case 'EXIT': return <ArrowDownRight color={colors.error} size={24} />;
      case 'CREATED': return <PlusCircle color={colors.primary} size={24} />;
      case 'ADJUSTMENT': return <RefreshCw color={colors.warning} size={24} />;
      default: return null;
    }
  };

  const getMovementLabel = (type: string) => {
    switch (type) {
      case 'ENTRY': return 'Entrada';
      case 'EXIT': return 'Saída';
      case 'CREATED': return 'Criação';
      case 'ADJUSTMENT': return 'Ajuste';
      default: return type;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        {movements.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {movements.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Sem histórico ainda.</Text>
          <Text style={styles.emptySubText}>As atividades aparecerão aqui.</Text>
        </View>
      ) : (
        <FlatList
          data={movements}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                {getMovementIcon(item.type)}
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={1}>{item.itemName}</Text>
                <View style={styles.detailsRow}>
                  <Text style={styles.type}>{getMovementLabel(item.type)}</Text>
                  <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
                </View>
              </View>
              <View style={styles.quantityContainer}>
                <Text style={[
                  styles.quantity, 
                  item.type === 'ENTRY' || item.type === 'CREATED' ? styles.positiveQty : styles.negativeQty
                ]}>
                  {item.type === 'EXIT' ? '-' : '+'}{item.quantity}
                </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  clearButton: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 100,
  },
  clearButtonText: {
    color: colors.error,
    fontWeight: '600',
    fontSize: 14,
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
    marginBottom: spacing.xs,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  type: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  quantityContainer: {
    marginLeft: spacing.md,
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 40,
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  positiveQty: {
    color: colors.success,
  },
  negativeQty: {
    color: colors.error,
  },
});
