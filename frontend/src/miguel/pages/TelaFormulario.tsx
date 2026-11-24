import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mensagemErro } from '../../pedro/services/api';
import Botao from '../../pedro/components/Botao';
import CampoTexto from '../../pedro/components/CampoTexto';
import { cores, estilos } from '../../pedro/styles/tema';
import type { Rotas } from '../navigation/rotas';
import type { Item, SalvarItem } from '../../pedro/types/Item';

type Props = {
  navigation: NativeStackNavigationProp<Rotas, 'Formulário'>;
  item?: Item;
  editando: boolean;
  separadoInicial?: boolean;
  salvarItem: SalvarItem;
};

export default function TelaFormulario({ navigation, item, editando, separadoInicial = false, salvarItem }: Props) {
  const [nome, setNome] = useState(item?.nome || '');
  const [separado, setSeparado] = useState(item?.separado ?? separadoInicial);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');

  async function salvar() {
    if (ocupado) return;
    if (!nome.trim()) {
      setErro('Digite o nome do item.');
      return;
    }
    setErro('');
    setOcupado(true);
    try {
      await salvarItem(item?.id, nome.trim(), separado);
      if (navigation.isFocused()) navigation.goBack();
    } catch (falha) {
      setErro(mensagemErro(falha));
    } finally {
      setOcupado(false);
    }
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <KeyboardAvoidingView style={estilos.teclado} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
          <Botao titulo="Voltar" icone="arrow-left" variante="texto" style={estilos.voltar}
            onPress={navigation.goBack} disabled={ocupado} />
          <Text accessibilityRole="header" style={estilos.titulo}>{editando ? 'Editar item' : 'Novo item'}</Text>
          {editando && !item ? <Text style={estilos.secundario}>Item não encontrado.</Text> : (
            <View style={[estilos.cartao, estilos.formulario]}>
              <CampoTexto rotulo="Nome do item" placeholder="Ex. Óculos de sol"
                  value={nome} onChangeText={setNome} maxLength={80} onSubmitEditing={salvar} />
              <View style={estilos.topo}>
                <Text style={estilos.texto}>Já está separado</Text>
                <Switch accessibilityLabel="Já está separado" value={separado} onValueChange={setSeparado}
                  trackColor={{ true: cores.primaria, false: cores.contorno }} disabled={ocupado} />
              </View>
              {erro ? <Text accessibilityRole="alert" style={estilos.erro}>{erro}</Text> : null}
              <Botao titulo={ocupado ? 'Salvando…' : 'Salvar item'} icone="check" onPress={salvar} disabled={ocupado} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
