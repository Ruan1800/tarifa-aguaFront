export type Categoria = 'COMERCIAL' | 'INDUSTRIAL' | 'PARTICULAR' | 'PUBLICO';

export interface FaixaInput {
  inicio: number;
  fim: number;
  valorUnitario: number;
}

export interface CategoriaInput {
  categoria: Categoria;
  faixas: FaixaInput[];
}

export interface TabelaTarifaria {
  id: number;
  nome: string;
  dataVigencia: string;
  categorias: CategoriaData[];
}

export interface CategoriaData {
  id: number;
  categoria: Categoria;
  faixas: FaixaData[];
}

export interface FaixaData {
  id: number;
  inicio: number;
  fim: number;
  valorUnitario: number;
}

export interface CreateTabelaPayload {
  nome: string;
  dataVigencia: string;
  categorias: CategoriaInput[];
}

export interface FaixaDetalhamento {
  faixa: { inicio: number; fim: number };
  m3Cobrados: number;
  valorUnitario: number;
  subtotal: number;
}

export interface CalculoResult {
  categoria: Categoria;
  consumoTotal: number;
  valorTotal: number;
  detalhamento: FaixaDetalhamento[];
}

export interface CalculoPayload {
  categoria: Categoria;
  consumo: number;
}
