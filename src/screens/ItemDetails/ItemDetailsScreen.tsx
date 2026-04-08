import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert, TextInput, Modal, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootNavigationProp, RootStackParamList } from '../../navigation/types';
import { useStore } from '../../store';
import { colors, spacing } from '../../theme';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils';

export const ItemDetailsScreen = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'ItemDetails'>>();
  
  const itemId = route.params.id;
  const item = useStore((state) => state.getItemById(itemId));
  const increaseItem = useStore((state) => state.increaseItem);
  const decreaseItem = useStore((state) => state.decreaseItem);
  const deleteItem = useStore((state) => state.deleteItem);

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Item não encontrado.</Text>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleEdit = () => {
    navigation.navigate('ItemForm', { id: item.id });
  };

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceInput, setPriceInput] = useState('');

  const handleIncrease = () => {
    setShowPriceModal(true);
  };

  const confirmIncrease = () => {
    const price = priceInput ? parseFloat(priceInput.replace(',', '.')) : undefined;
    increaseItem(item.id, 1, price);
    setPriceInput('');
    setShowPriceModal(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir item',
      `Tem certeza que deseja excluir "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            deleteItem(item.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Qtd Atual</Text>
            <Text style={styles.infoValue}>
              {item.currentQuantity.toFixed(1).replace('.', ',')} <Text style={styles.unit}>{item.unit}</Text>
            </Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Mínimo Ideal</Text>
            <Text style={styles.infoValue}>
              {item.minimumQuantity.toFixed(1).replace('.', ',')} <Text style={styles.unit}>{item.unit}</Text>
            </Text>
          </View>
        </View>

        {item.lastUnitPrice !== undefined && (
          <View style={styles.priceContainer}>
            <Text style={styles.infoLabel}>Últ. preço pago</Text>
            <Text style={styles.priceValue}>
              R$ {item.lastUnitPrice.toFixed(2).replace('.', ',')} <Text style={styles.unit}>/{item.unit}</Text>
            </Text>
          </View>
        )}

        <View style={styles.datesContainer}>
          <Text style={styles.dateText}>Criado em: {formatDate(item.createdAt)}</Text>
          <Text style={styles.dateText}>Atualizado em: {formatDate(item.updatedAt)}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.actionsTitle}>Ajuste Rápido</Text>
        <View style={styles.quickActions}>
          <Button 
            title="- Diminuir" 
            onPress={() => decreaseItem(item.id, 1)} 
            variant="outline"
            style={styles.actionButton}
          />
          <Button 
            title="+ Aumentar" 
            onPress={handleIncrease} 
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </View>

      <View style={styles.managementContainer}>
        <Button 
          title="Editar Item" 
          onPress={handleEdit} 
          variant="primary" 
          style={styles.manageButton}
        />
        <Button 
          title="Excluir Item" 
          onPress={handleDelete} 
          variant="danger" 
          style={styles.manageButton}
        />
      </View>

      <Modal visible={showPriceModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar ao estoque</Text>
            <Text style={styles.modalSubtitle}>Informe o valor pago por {item.unit} (opcional)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="0,00"
              keyboardType="decimal-pad"
              value={priceInput}
              onChangeText={setPriceInput}
              placeholderTextColor={colors.textSecondary}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => { setPriceInput(''); setShowPriceModal(false); }}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSkipBtn} onPress={() => { increaseItem(item.id, 1); setPriceInput(''); setShowPriceModal(false); }}>
                <Text style={styles.modalSkipText}>Pular</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={confirmIncrease}>
                <Text style={styles.modalConfirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  infoBlock: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  unit: {
    fontSize: 16,
    fontWeight: 'normal',
    color: colors.textSecondary,
  },
  datesContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  actionsContainer: {
    marginBottom: spacing.xl,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  managementContainer: {
    gap: spacing.md,
  },
  manageButton: {
    //
  },
  priceContainer: {
    backgroundColor: '#ECFDF5',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.success,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
  },
  modalCancelText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 15,
  },
  modalSkipBtn: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
  },
  modalSkipText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  modalConfirmBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: 100,
  },
  modalConfirmText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 15,
  },
});
