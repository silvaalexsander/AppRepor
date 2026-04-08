import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Package, ShoppingCart, Clock } from 'lucide-react-native';

import { EstoqueScreen } from '../screens/Estoque/EstoqueScreen';
import { ComprarScreen } from '../screens/Comprar/ComprarScreen';
import { HistoricoScreen } from '../screens/Historico/HistoricoScreen';
import { ItemFormScreen } from '../screens/ItemForm/ItemFormScreen';
import { ItemDetailsScreen } from '../screens/ItemDetails/ItemDetailsScreen';

import { BottomTabParamList, RootStackParamList } from './types';
import { colors } from '../theme';

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.surface,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen 
        name="Estoque" 
        component={EstoqueScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Package color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Comprar" 
        component={ComprarScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ShoppingCart color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Historico" 
        component={HistoricoScreen}
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, size }) => <Clock color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen 
          name="ItemForm" 
          component={ItemFormScreen}
          options={{
            headerShown: true,
            headerTitle: 'Item',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.surface,
          }}
        />
        <Stack.Screen 
          name="ItemDetails" 
          component={ItemDetailsScreen}
          options={{
            headerShown: true,
            headerTitle: 'Detalhes do Item',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.surface,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
