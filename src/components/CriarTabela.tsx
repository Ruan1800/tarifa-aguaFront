import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, AlertCircle, Building2, Factory, Home, Landmark } from 'lucide-react';
import { api } from '../services/api';
import type { Categoria, CategoriaInput, FaixaInput } from '../types/api';

const CATEGORIAS = [
  { id: 'COMERCIAL' as Categoria, label: 'Comercial', icon: Building2, active: 'border-violet-500 bg-violet-500/10 text-violet-300' },
  { id: 'INDUSTRIAL' as Categoria, label: 'Industrial', icon: Factory, active: 'border-orange-500 bg-orange-500/10 text-orange-300' },
  { id: 'PARTICULAR' as Categoria, label: 'Particular', icon: Home, active: 'border-emerald-500 bg-emerald-500/10 text-emerald-300' },
  { id: 'PUBLICO' as Categoria, label: 'Público', icon: Landmark, active: 'border-sky-500 bg-sky-500/10 text-sky-300' },
];

const CAT_ACCENT: Record<string, string> = {
  COMERCIAL: 'border-l-violet-500 text-violet-400 bg-violet-500/10',
  INDUSTRIAL: 'border-l-orange-500 text-orange-400 bg-orange-500/10',
  PARTICULAR: 'border-l-emerald-500 text-emerald-400 bg-emerald-500/10',
  PUBLICO: 'border-l-sky-500 text-sky-400 bg-sky-500/10',
};

function emptyFaixa(): FaixaInput {
  return { inicio: 0, fim: 0, valorUnitario: 0 };
}

export function CriarTabela({ onSuccess }: { onSuccess?: () => void }) {
  const [nome, setNome] = useState('');
  const [dataVigencia, setDataVigencia] = useState('');
  const [categorias, setCategorias] = useState<CategoriaInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const toggleCategoria = (cat: Categoria) => {
    setCategorias((prev) =>
      prev.find((c) => c.categoria === cat)
        ? prev.filter((c) => c.categoria !== cat)
        : [...prev, { categoria: cat, faixas: [emptyFaixa()] }]
    );
  };

  const updateFaixa = (catIdx: number, faixaIdx: number, field: keyof FaixaInput, value: number) => {
    setCategorias((prev) =>
      prev.map((c, ci) =>
        ci !== catIdx ? c : {
          ...c,
          faixas: c.faixas.map((f, fi) => fi !== faixaIdx ? f : { ...f, [field]: value }),
        }
      )
    );
  };

  const addFaixa = (catIdx: number) => {
    setCategorias((prev) =>
      prev.map((c, ci) => ci !== catIdx ? c : { ...c, faixas: [...c.faixas, emptyFaixa()] })
    );
  };

  const removeFaixa = (catIdx: number, faixaIdx: number) => {
    setCategorias((prev) =>
      prev.map((c, ci) =>
        ci !== catIdx ? c : { ...c, faixas: c.faixas.filter((_, fi) => fi !== faixaIdx) }
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !dataVigencia || categorias.length === 0) {
      setFeedback({ type: 'error', msg: 'Preencha nome, data de vigência e selecione ao menos uma categoria.' });
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      await api.criarTabela({ nome, dataVigencia, categorias });
      setFeedback({ type: 'success', msg: 'Tabela criada com sucesso!' });
      setNome('');
      setDataVigencia('');
      setCategorias([]);
      onSuccess?.();
    } catch (e: unknown) {
      setFeedback({ type: 'error', msg: e instanceof Error ? e.message : 'Erro ao criar tabela' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {feedback && (
        <div className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium border ${
          feedback.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {feedback.type === 'success'
            ? <CheckCircle2 className="w-4 h-4 shrink-0" />
            : <AlertCircle className="w-4 h-4 shrink-0" />}
          {feedback.msg}
        </div>
      )}

      <div className="space-y-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">1 — Informações</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Nome da Tabela</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Tabela 2025"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Data de Vigência</label>
            <input
              type="date"
              value={dataVigencia}
              onChange={(e) => setDataVigencia(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm [color-scheme:dark]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">2 — Categorias de Consumidores</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIAS.map(({ id, label, icon: Icon, active }) => {
            const isActive = !!categorias.find((c) => c.categoria === id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleCategoria(id)}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive ? active : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300 bg-slate-800/50'
                }`}
              >
                <Icon className="w-6 h-6" />
                {label}
              </button>
            );
          })}
        </div>

        {categorias.length > 0 && (
          <div className="space-y-4">
            {categorias.map((cat, catIdx) => {
              const [accentBorder, accentText, accentBg] = (CAT_ACCENT[cat.categoria] ?? '').split(' ');
              return (
                <div
                  key={cat.categoria}
                  className={`rounded-xl border-l-4 border border-slate-700/50 bg-slate-800/30 p-5 ${accentBorder}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${accentBg} ${accentText}`}>
                      {cat.categoria}
                    </span>
                    <button
                      type="button"
                      onClick={() => addFaixa(catIdx)}
                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar faixa
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-[1fr_1fr_1fr_36px] gap-2 px-1 pb-1">
                      <span className="text-slate-500 text-xs font-medium">Início (m³)</span>
                      <span className="text-slate-500 text-xs font-medium">Fim (m³)</span>
                      <span className="text-slate-500 text-xs font-medium">R$ / m³</span>
                      <span />
                    </div>
                    {cat.faixas.map((faixa, faixaIdx) => (
                      <div key={faixaIdx} className="grid grid-cols-[1fr_1fr_1fr_36px] gap-2 items-center">
                        <input
                          type="number"
                          min={0}
                          value={faixaIdx === 0 ? 0 : faixa.inicio}
                          onChange={(e) => updateFaixa(catIdx, faixaIdx, 'inicio', Number(e.target.value))}
                          disabled={faixaIdx === 0}
                          className="px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500/70 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                        <input
                          type="number"
                          min={0}
                          value={faixa.fim}
                          onChange={(e) => updateFaixa(catIdx, faixaIdx, 'fim', Number(e.target.value))}
                          className="px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500/70 transition-colors"
                        />
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={faixa.valorUnitario}
                          onChange={(e) => updateFaixa(catIdx, faixaIdx, 'valorUnitario', Number(e.target.value))}
                          className="px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500/70 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => removeFaixa(catIdx, faixaIdx)}
                          disabled={cat.faixas.length === 1}
                          className="flex items-center justify-center text-slate-600 hover:text-red-400 disabled:opacity-20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20 cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Criando tabela...
          </span>
        ) : 'Criar Tabela Tarifária'}
      </button>
    </form>
  );
}
