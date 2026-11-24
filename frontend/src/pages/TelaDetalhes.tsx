import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mensagemErro } from '../services/api';
import Botao from '../components/Botao';
import Icone from '../components/Icone';
import { cores, estilos, raios } from '../styles/tema';
import type { Rotas } from '../navigation/rotas';
import type { Item, SalvarItem } from '../types/Item';

type Props = {
  navigation: NativeStackNavigationProp<Rotas, 'Detalhes'>;
  item?: Item;
  salvarItem: SalvarItem;
  excluirItem: (id: number) => Promise<void>;
};

export default function TelaDetalhes({ navigation, item, salvarItem, excluirItem }: Props) {
  const [confirmando, setConfirmando] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');

  async function mudarStatus() {
    if (!item) return;
    setOcupado(true);
    setErro('');
    try {
      await salvarItem(item.id, item.nome, !item.separado);
    } catch (falha) {
      setErro(mensagemErro(falha));
    } finally {
      setOcupado(false);
    }
  }

  async function excluir() {
    if (!item) return;
    setOcupado(true);
    setErro('');
    try {
      await excluirItem(item.id);
      if (navigation.isFocused()) navigation.goBack();
    } catch (falha) {
      setErro(mensagemErro(falha));
    } finally {
      setOcupado(false);
    }
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Botao titulo="Voltar à lista" icone="arrow-left" variante="texto" style={estilos.voltar}
          onPress={navigation.goBack} disabled={ocupado} />
        {item ? (
          <>
            <Text accessibilityRole="header" style={estilos.titulo}>{item.nome}</Text>
            <View style={[local.status, item.separado && local.statusSeparado]}>
              <Icone nome={item.separado ? 'check-circle' : 'circle'} tamanho={16}
                cor={item.separado ? cores.verde : cores.discreto} />
              <Text style={[local.statusTexto, item.separado && local.statusTextoSeparado]}>
                {item.separado ? 'Separado' : 'A separar'}
              </Text>
            </View>
            <View style={local.acoes}>
              <Botao titulo={item.separado ? 'Voltar para A separar' : 'Marcar como separado'}
                icone={item.separado ? 'rotate-ccw' : 'check'} onPress={mudarStatus} disabled={ocupado || confirmando} />
              <Botao titulo="Editar item" icone="edit-2" variante="borda" disabled={ocupado || confirmando}
                onPress={() => navigation.navigate('Formulário', { id: item.id })} />
              {confirmando ? (
                <View style={[estilos.cartao, local.confirmacao]}>
                  <Text style={estilos.texto}>Remover este item da mala?</Text>
                  <Botao titulo="Confirmar exclusão" icone="trash-2" variante="perigo" onPress={excluir} disabled={ocupado} />
                  <Botao titulo="Cancelar" variante="texto" onPress={() => setConfirmando(false)} disabled={ocupado} />
                </View>
              ) : (
                <Botao titulo="Excluir item" icone="trash-2" variante="perigo" onPress={() => setConfirmando(true)} disabled={ocupado} />
              )}
              {erro ? <Text accessibilityRole="alert" style={estilos.erro}>{erro}</Text> : null}
            </View>
          </>
        ) : <Text style={estilos.secundario}>Item não encontrado.</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const local = StyleSheet.create({
  status: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: cores.neutro,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: raios.controle,
  },
  statusSeparado: { backgroundColor: cores.verdeSuave },
  statusTexto: { color: cores.discreto, fontSize: 14, fontWeight: '600' },
  statusTextoSeparado: { color: cores.verde },
  acoes: { marginTop: 24, gap: 10 },
  confirmacao: { gap: 4 },
});
