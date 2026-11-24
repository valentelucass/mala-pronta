import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaDetalhes from '../pages/TelaDetalhes';
import TelaFormulario from '../pages/TelaFormulario';
import TelaLista from '../pages/TelaLista';
import TelaLogin from '../pages/TelaLogin';
import { cores } from '../styles/tema';
import type { Item, SalvarItem } from '../types/Item';
import type { Rotas } from './rotas';

const Stack = createNativeStackNavigator<Rotas>();

type Props = {
  autenticado: boolean;
  itens: Item[];
  aviso: string;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => void;
  salvarItem: SalvarItem;
  excluirItem: (id: number) => Promise<void>;
};

export default function Navegacao({ autenticado, itens, aviso, entrar, sair, salvarItem, excluirItem }: Props) {
  function acharItem(id: number | undefined) {
    return itens.find((item) => item.id === id);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: cores.fundo },
      }}>
        {autenticado ? (
          <>
            <Stack.Screen name="A separar">
              {({ navigation }) => (
                <TelaLista navigation={navigation} itens={itens} salvarItem={salvarItem} sair={sair} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Separados">
              {({ navigation }) => (
                <TelaLista navigation={navigation} itens={itens} salvarItem={salvarItem} sair={sair} separados />
              )}
            </Stack.Screen>
            <Stack.Screen name="Detalhes">
              {({ navigation, route }) => (
                <TelaDetalhes navigation={navigation} item={acharItem(route.params.id)}
                  salvarItem={salvarItem} excluirItem={excluirItem} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Formulário">
              {({ navigation, route }) => (
                <TelaFormulario navigation={navigation} item={acharItem(route.params?.id)}
                  editando={Boolean(route.params?.id)} separadoInicial={route.params?.separadoInicial}
                  salvarItem={salvarItem} />
              )}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Login">
            {() => <TelaLogin entrar={entrar} aviso={aviso} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
