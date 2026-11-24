import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mensagemErro } from '../services/api';
import Botao from '../components/Botao';
import Icone from '../components/Icone';
import Marca from '../components/Marca';
import { cores, estilos, raios } from '../styles/tema';
import type { Rotas } from '../navigation/rotas';
import type { Item, SalvarItem } from '../types/Item';

type Props = {
  navigation: NativeStackNavigationProp<Rotas, 'A separar' | 'Separados'>;
  itens: Item[];
  salvarItem: SalvarItem;
  sair: () => void;
  separados?: boolean;
};

// A mesma tela é usada nas duas rotas. Só muda o filtro.
export default function TelaLista({ navigation, itens, salvarItem, sair, separados = false }: Props) {
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');
  const itensVisiveis = itens.filter((item) => item.separado === separados);
  const totalSeparado = itens.filter((item) => item.separado).length;
  const total = itens.length;
  const progresso = total ? totalSeparado / total : 0;
  const abas = [
    { rota: 'A separar', total: total - totalSeparado, ativa: !separados },
    { rota: 'Separados', total: totalSeparado, ativa: separados },
  ] as const;

  async function trocarStatus(item: Item) {
    setErro('');
    setOcupado(true);
    try {
      await salvarItem(item.id, item.nome, !item.separado);
    } catch (falha) {
      setErro(mensagemErro(falha));
    } finally {
      setOcupado(false);
    }
  }

  function renderizarItem({ item }: { item: Item }) {
    return (
      <View style={local.linha}>
        <Pressable style={local.marcar} accessibilityRole="checkbox" accessibilityState={{ checked: item.separado }}
          accessibilityLabel={'Separado: ' + item.nome} disabled={ocupado} onPress={() => trocarStatus(item)}>
          <View style={[local.caixa, item.separado && local.caixaMarcada]}>
            {item.separado && <Icone nome="check" tamanho={15} cor={cores.superficie} />}
          </View>
        </Pressable>
        <Pressable style={local.abrirItem} accessibilityRole="button" disabled={ocupado}
          onPress={() => navigation.navigate('Detalhes', { id: item.id })}>
          <Text style={[estilos.texto, local.nome]}>{item.nome}</Text>
          <Icone nome="chevron-right" tamanho={18} />
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={[estilos.tela, local.tela]}>
      <View style={[estilos.topo, local.cabecalho]}>
        <Marca />
        <Botao titulo="Sair" icone="log-out" variante="texto" onPress={sair} disabled={ocupado} />
      </View>
      <Text accessibilityRole="header" style={[estilos.titulo, local.titulo]}>Minha mala</Text>
      <View style={[estilos.cartao, local.resumo]}>
        <View style={estilos.topo}>
          <Text style={estilos.secundario}>Itens separados</Text>
          <Text style={local.contagem}>{totalSeparado} de {total}</Text>
        </View>
        <View
          style={local.trilho}
          accessibilityRole="progressbar"
          accessibilityLabel="Itens separados"
          accessibilityValue={{ min: 0, max: Math.max(total, 1), now: totalSeparado }}
        >
          <View style={[local.progresso, { width: `${progresso * 100}%` }]} />
        </View>
      </View>
      <View style={local.abas} accessibilityRole="tablist" accessibilityLabel="Itens da mala">
        {abas.map((aba) => (
          <Pressable
            key={aba.rota}
            style={[local.aba, aba.ativa && local.abaAtiva]}
            accessibilityRole="tab"
            accessibilityLabel={aba.rota + ' ' + aba.total}
            accessibilityState={{ selected: aba.ativa, disabled: ocupado }}
            disabled={ocupado}
            onPress={() => { if (!aba.ativa) navigation.replace(aba.rota); }}
          >
            <Text style={[local.rotuloAba, aba.ativa && local.rotuloAtivo]}>{aba.rota}</Text>
            <Text style={[local.totalAba, aba.ativa && local.totalAtivo]}>{aba.total}</Text>
          </Pressable>
        ))}
      </View>
      {erro ? <Text accessibilityRole="alert" style={estilos.erro}>{erro}</Text> : null}
      <FlatList
        data={itensVisiveis}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderizarItem}
        contentContainerStyle={local.lista}
        ListEmptyComponent={
          <View style={local.vazio}>
            <Icone nome="inbox" tamanho={22} />
            <Text style={estilos.secundario}>{separados ? 'Nenhum item separado.' : 'Nenhum item a separar.'}</Text>
          </View>
        }
      />
      <Botao titulo="Novo item" icone="plus" disabled={ocupado}
        onPress={() => navigation.navigate('Formulário', { separadoInicial: separados })} />
    </SafeAreaView>
  );
}

const local = StyleSheet.create({
  tela: { paddingTop: 12, paddingBottom: 16 },
  cabecalho: { borderBottomWidth: 1, borderBottomColor: cores.borda, paddingBottom: 12 },
  titulo: { marginTop: 22, marginBottom: 12 },
  resumo: { gap: 10 },
  contagem: { color: cores.texto, fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  trilho: { backgroundColor: cores.neutro, height: 6, borderRadius: 6, overflow: 'hidden' },
  progresso: { backgroundColor: cores.primaria, height: '100%' },
  abas: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 16,
    marginBottom: 12,
    padding: 4,
    backgroundColor: cores.neutro,
    borderRadius: raios.controle,
  },
  aba: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
  },
  abaAtiva: { backgroundColor: cores.superficie, borderColor: cores.borda },
  rotuloAba: { color: cores.discreto, flexShrink: 1, fontWeight: '600', fontSize: 14 },
  rotuloAtivo: { color: cores.primaria },
  totalAba: {
    color: cores.discreto,
    backgroundColor: cores.fundo,
    borderRadius: 8,
    paddingHorizontal: 5,
    fontVariant: ['tabular-nums'],
    fontSize: 12,
    fontWeight: '700',
  },
  totalAtivo: { color: cores.primaria, backgroundColor: cores.primariaSuave },
  lista: { gap: 8, paddingBottom: 12 },
  linha: {
    minHeight: 54,
    flexDirection: 'row',
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raios.controle,
  },
  marcar: { width: 46, alignItems: 'center', justifyContent: 'center' },
  caixa: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: cores.contorno,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caixaMarcada: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  abrirItem: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
    paddingVertical: 8,
  },
  nome: { flex: 1, fontWeight: '500' },
  vazio: { alignItems: 'center', gap: 8, paddingVertical: 26 },
});
