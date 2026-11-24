import { Platform } from 'react-native';

const host = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
const URL_API = process.env.EXPO_PUBLIC_API_URL || 'http://' + host + ':8080/api';

export type Metodo = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Dados = Record<string, string | boolean>;

export class ErroApi extends Error {
  readonly status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.status = status;
  }
}

export function mensagemErro(erro: unknown) {
  return erro instanceof Error ? erro.message : 'Ocorreu um erro. Tente novamente.';
}

export async function requisicao(caminho: string, metodo: Metodo, corpo?: Dados, token?: string) {
  const headers: Record<string, string> = {};
  if (corpo) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = 'Bearer ' + token;

  let resposta;
  try {
    resposta = await fetch(URL_API + caminho, {
      method: metodo,
      headers,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Confira o endereço e se o backend está rodando.');
  }

  if (!resposta.ok) {
    let mensagem = 'Não foi possível concluir a operação.';
    if (resposta.status === 401) {
      mensagem = token ? 'Sessão expirada. Entre novamente.' : 'E-mail ou senha incorretos.';
    }
    if (resposta.status === 400) mensagem = 'Confira os dados informados.';
    if (resposta.status === 404) mensagem = 'Item não encontrado.';

    throw new ErroApi(mensagem, resposta.status);
  }

  return resposta;
}
