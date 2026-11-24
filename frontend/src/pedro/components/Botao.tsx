import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { cores, raios } from '../styles/tema';
import Icone from './Icone';
import type { NomeIcone } from './Icone';

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: 'principal' | 'borda' | 'texto' | 'perigo';
  icone?: NomeIcone;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const coresDoTexto = {
  principal: cores.superficie,
  borda: cores.texto,
  texto: cores.discreto,
  perigo: cores.erro,
};

export default function Botao({ titulo, onPress, variante = 'principal', icone, disabled, style }: Props) {
  const principal = variante === 'principal';
  const cor = coresDoTexto[variante];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base, principal && estilos.principal, variante === 'borda' && estilos.borda,
        (disabled || pressed) && estilos.atenuado, style,
      ]}
    >
      {icone && <Icone nome={icone} cor={cor} />}
      <Text style={[estilos.texto, { color: cor }]}>{titulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: 46,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: raios.controle,
  },
  principal: { backgroundColor: cores.primaria },
  borda: { backgroundColor: cores.superficie, borderWidth: 1, borderColor: cores.borda },
  atenuado: { opacity: 0.65 },
  texto: { flexShrink: 1, fontSize: 15, fontWeight: '700', textAlign: 'center' },
});
