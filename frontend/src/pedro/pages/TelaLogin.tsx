import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mensagemErro } from '../services/api';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import Marca from '../components/Marca';
import { estilos } from '../styles/tema';

const CHAVE_EMAIL = 'mala-pronta/email';

type Props = {
  entrar: (email: string, senha: string) => Promise<void>;
  aviso: string;
};

export default function TelaLogin({ entrar, aviso }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    // O aparelho guarda apenas o e-mail para facilitar o próximo login.
    AsyncStorage.getItem(CHAVE_EMAIL)
      .then((salvo) => setEmail((atual) => atual || salvo || ''))
      .catch(() => {});
  }, []);

  async function enviar() {
    if (ocupado) return;
    if (!email.trim() || !senha) {
      setErro('Informe o e-mail e a senha.');
      return;
    }
    setErro('');
    setOcupado(true);
    try {
      await entrar(email.trim(), senha);
      await AsyncStorage.setItem(CHAVE_EMAIL, email.trim()).catch(() => {});
    } catch (falha) {
      setErro(mensagemErro(falha));
    } finally {
      setOcupado(false);
    }
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <KeyboardAvoidingView style={estilos.teclado} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[estilos.conteudo, estilos.centro]} keyboardShouldPersistTaps="handled">
          <Marca grande />
          <Text style={[estilos.secundario, local.subtitulo]}>Seu checklist de viagem.</Text>
          <View style={[estilos.cartao, estilos.formulario]}>
            <CampoTexto rotulo="E-mail" value={email} onChangeText={setEmail}
              keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
            <CampoTexto rotulo="Senha" value={senha} onChangeText={setSenha}
              secureTextEntry autoComplete="current-password" onSubmitEditing={enviar} />
            {erro || aviso ? <Text accessibilityRole="alert" style={estilos.erro}>{erro || aviso}</Text> : null}
            <Botao titulo={ocupado ? 'Entrando…' : 'Entrar'} icone="log-in" disabled={ocupado} onPress={enviar} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const local = StyleSheet.create({
  subtitulo: { marginTop: 5 },
});
