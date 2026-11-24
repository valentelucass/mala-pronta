import React from 'react';
import type { ComponentProps } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { cores } from '../styles/tema';

export type NomeIcone = ComponentProps<typeof Feather>['name'];

type Props = {
  nome: NomeIcone;
  tamanho?: number;
  cor?: string;
};

export default function Icone({ nome, tamanho = 18, cor = cores.discreto }: Props) {
  return <Feather name={nome} size={tamanho} color={cor} aria-hidden accessible={false} />;
}
