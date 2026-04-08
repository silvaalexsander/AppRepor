import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type BottomTabParamList = {
  Estoque: undefined;
  Comprar: undefined;
  Historico: undefined;
  Detalhes: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<BottomTabParamList>;
  ItemForm: { id?: string };
  ItemDetails: { id: string };
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
