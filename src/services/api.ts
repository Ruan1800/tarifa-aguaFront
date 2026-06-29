import type {
  TabelaTarifaria,
  CreateTabelaPayload,
  CalculoPayload,
  CalculoResult,
} from '../types/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erro ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  listarTabelas: () => request<TabelaTarifaria[]>('/api/tabelas-tarifarias'),

  criarTabela: (payload: CreateTabelaPayload) =>
    request<TabelaTarifaria>('/api/tabelas-tarifarias', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  excluirTabela: (id: number) =>
    request<void>(`/api/tabelas-tarifarias/${id}`, { method: 'DELETE' }),

  calcular: (payload: CalculoPayload) =>
    request<CalculoResult>('/api/calculos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
