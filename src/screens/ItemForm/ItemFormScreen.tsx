import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { RootNavigationProp, RootStackParamList } from '../../navigation/types';
import { useStore } from '../../store';
import { colors, spacing } from '../../theme';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { CATEGORIES, UNITS } from '../../constants';
import { ItemCategory, UnitType } from '../../types';

interface FormData {
  name: string;
  category: ItemCategory;
  unit: UnitType;
  currentQuantity: string;
  minimumQuantity: string;
}

export const ItemFormScreen = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'ItemForm'>>();
  
  const editingId = route.params?.id;
  const isEditing = !!editingId;
  const itemToEdit = useStore((state) => isEditing ? state.getItemById(editingId!) : undefined);
  
  const createItem = useStore((state) => state.createItem);
  const updateItem = useStore((state) => state.updateItem);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      category: CATEGORIES[0],
      unit: UNITS[0],
      currentQuantity: '0',
      minimumQuantity: '0',
    }
  });

  useEffect(() => {
    if (isEditing && itemToEdit) {
      setValue('name', itemToEdit.name);
      setValue('category', itemToEdit.category);
      setValue('unit', itemToEdit.unit);
      setValue('currentQuantity', itemToEdit.currentQuantity.toFixed(1).replace('.', ','));
      setValue('minimumQuantity', itemToEdit.minimumQuantity.toFixed(1).replace('.', ','));
    }
  }, [isEditing, itemToEdit, setValue]);

  const onSubmit = (data: FormData) => {
    const currentQtd = parseFloat(data.currentQuantity.replace(',', '.'));
    const minQtd = parseFloat(data.minimumQuantity.replace(',', '.'));

    if (isNaN(currentQtd) || isNaN(minQtd) || currentQtd < 0 || minQtd < 0) {
      Alert.alert('Erro', 'As quantidades devem ser números não negativos.');
      return;
    }

    if (isEditing && editingId) {
      updateItem(editingId, {
        name: data.name,
        category: data.category,
        unit: data.unit,
        currentQuantity: currentQtd,
        minimumQuantity: minQtd,
      });
    } else {
      createItem({
        name: data.name,
        category: data.category,
        unit: data.unit,
        currentQuantity: currentQtd,
        minimumQuantity: minQtd,
        active: true,
      });
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Controller
        control={control}
        rules={{ required: 'O nome é obrigatório' }}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nome do Item *"
            placeholder="Ex: Arroz Tio João"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.name?.message}
          />
        )}
      />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Categoria</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, value === cat && styles.chipSelected]}
                  onPress={() => onChange(cat)}
                >
                  <Text style={[styles.chipText, value === cat && styles.chipTextSelected]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Unidade de Medida</Text>
        <Controller
          control={control}
          name="unit"
          render={({ field: { onChange, value } }) => (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
              {UNITS.map(unit => (
                <TouchableOpacity
                  key={unit}
                  style={[styles.chip, value === unit && styles.chipSelected]}
                  onPress={() => onChange(unit)}
                >
                  <Text style={[styles.chipText, value === unit && styles.chipTextSelected]}>{unit}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.col}>
          <Controller
            control={control}
            name="currentQuantity"
            rules={{ required: 'Obrigatório' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Quantidade Atual"
                placeholder="0,0"
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.currentQuantity?.message}
              />
            )}
          />
        </View>
        <View style={styles.col}>
          <Controller
            control={control}
            name="minimumQuantity"
            rules={{ required: 'Obrigatório' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Mínimo Ideal"
                placeholder="0,0"
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.minimumQuantity?.message}
              />
            )}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title={isEditing ? 'Salvar Alterações' : 'Cadastrar Item'} 
          onPress={handleSubmit(onSubmit)} 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  chipsContainer: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontSize: 14,
  },
  chipTextSelected: {
    color: colors.surface,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  col: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: spacing.xl,
  },
});
