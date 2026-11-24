import { StyleSheet } from 'react-native';

export const cores = {
  fundo: '#F6F7FA',
  superficie: '#FFFFFF',
  texto: '#19243A',
  discreto: '#52617A',
  borda: '#D9DFEA',
  contorno: '#75839A',
  neutro: '#EAEDF4',
  primaria: '#234AC4',
  primariaSuave: '#E9EEFF',
  verde: '#17634B',
  verdeSuave: '#E6F4EC',
  erro: '#A93037',
  erroSuave: '#FFF0F0',
};

export const raios = {
  controle: 10,
  cartao: 16,
};

export const estilos = StyleSheet.create({
  tela: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center', paddingHorizontal: 20 },
  teclado: { flex: 1 },
  conteudo: { flexGrow: 1, paddingTop: 20, paddingBottom: 24 },
  centro: { justifyContent: 'center' },
  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titulo: { color: cores.texto, fontSize: 30, fontWeight: '700', letterSpacing: -0.75 },
  texto: { color: cores.texto, fontSize: 16 },
  secundario: { color: cores.discreto, fontSize: 14 },
  erro: {
    color: cores.erro,
    backgroundColor: cores.erroSuave,
    borderRadius: raios.controle,
    fontSize: 14,
    padding: 12,
  },
  formulario: { marginTop: 24, gap: 16 },
  cartao: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raios.cartao,
    padding: 16,
  },
  voltar: { alignSelf: 'flex-start', marginLeft: -10, marginBottom: 16 },
});
