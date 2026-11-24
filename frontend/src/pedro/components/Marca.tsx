import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores, estilos, raios } from '../styles/tema';
import Icone from './Icone';

export default function Marca({ grande = false }: { grande?: boolean }) {
  return (
    <View style={grande ? local.abertura : local.linha}>
      <View style={[local.simbolo, grande && local.simboloGrande]}>
        <Icone nome="briefcase" tamanho={grande ? 28 : 18} cor={cores.primaria} />
      </View>
      <Text accessibilityRole={grande ? 'header' : undefined} style={grande ? estilos.titulo : local.nome}>
        Mala Pronta
      </Text>
    </View>
  );
}

const local = StyleSheet.create({
  abertura: { gap: 14, alignItems: 'flex-start' },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  simbolo: {
    width: 36,
    height: 36,
    borderRadius: raios.controle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.primariaSuave,
  },
  simboloGrande: { width: 56, height: 56, borderRadius: raios.cartao },
  nome: { color: cores.texto, fontSize: 16, fontWeight: '700' },
});
