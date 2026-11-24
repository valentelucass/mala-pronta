export type Item = {
  id: number;
  nome: string;
  separado: boolean;
};

export type SalvarItem = (id: number | undefined, nome: string, separado: boolean) => Promise<void>;
