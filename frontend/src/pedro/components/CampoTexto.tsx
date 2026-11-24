import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { cores, raios } from '../styles/tema';

type Props = TextInputProps & { rotulo: string };

export default function CampoTexto({ rotulo, ...props }: Props) {
  return (
    <View style={local.grupo}>
      <Text style={local.rotulo}>{rotulo}</Text>
      <TextInput
        {...props}
        style={[local.campo, props.style]}
        accessibilityLabel={rotulo}
        placeholderTextColor={cores.discreto}
        selectionColor={cores.primaria}
      />
    </View>
  );
}

const local = StyleSheet.create({
  grupo: { gap: 6 },
  rotulo: { color: cores.texto, fontSize: 14, fontWeight: '600' },
  campo: {
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: cores.texto,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.contorno,
    borderRadius: raios.controle,
    fontSize: 16,
  },
});
