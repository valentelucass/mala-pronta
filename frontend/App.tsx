import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Navegacao from './src/miguel/navigation/Navegacao';
import { ErroApi, requisicao } from './src/pedro/services/api';
import type { Metodo } from './src/pedro/services/api';
import type { Item } from './src/pedro/types/Item';

export default function App() {
  const [token, setToken] = useState('');
  const [itens, setItens] = useState<Item[]>([]);
  const [aviso, setAviso] = useState('');

  async function entrar(email: string, senha: string) {
    const respostaLogin = await requisicao('/login', 'POST', { email, senha });
    const login: { token: string } = await respostaLogin.json();
    const respostaItens = await requisicao('/itens', 'GET', undefined, login.token);
    const lista: Item[] = await respostaItens.json();
    setItens(lista);
    setAviso('');
    setToken(login.token);
  }

  function sair() {
    setToken('');
    setItens([]);
  }

  // Um JWT vencido devolve o usuário para a tela de login.
  async function chamarApi(caminho: string, metodo: Metodo, dados?: { nome: string; separado: boolean }) {
    try {
      return await requisicao(caminho, metodo, dados, token);
    } catch (erro) {
      if (erro instanceof ErroApi && erro.status === 401) {
        setAviso(erro.message);
        sair();
      }
      throw erro;
    }
  }

  async function salvarItem(id: number | undefined, nome: string, separado: boolean) {
    const dados = { nome, separado };
    if (id) {
      const resposta = await chamarApi('/itens/' + id, 'PUT', dados);
      const item: Item = await resposta.json();
      setItens((lista) => lista.map((atual) => atual.id === id ? item : atual));
    } else {
      const resposta = await chamarApi('/itens', 'POST', dados);
      const item: Item = await resposta.json();
      setItens((lista) => [item, ...lista]);
    }
  }

  async function excluirItem(id: number) {
    await chamarApi('/itens/' + id, 'DELETE');
    setItens((lista) => lista.filter((item) => item.id !== id));
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Navegacao autenticado={Boolean(token)} itens={itens} aviso={aviso}
        entrar={entrar} sair={sair} salvarItem={salvarItem} excluirItem={excluirItem} />
    </SafeAreaProvider>
  );
}
