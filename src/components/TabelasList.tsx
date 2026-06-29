import { useEffect, useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, RefreshCw, Table2 } from 'lucide-react';
import { api } from '../services/api';
import type { TabelaTarifaria } from '../types/api';

const CAT_BADGE: Record<string, string> = {
  COMERCIAL: 'bg-violet-500/15 text-violet-400 border border-violet-500/30',
  INDUSTRIAL: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  PARTICULAR: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  PUBLICO: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
};

const CAT_HEADER: Record<string, string> = {
  COMERCIAL: 'bg-violet-500/10 text-violet-400 border-b border-violet-500/20',
  INDUSTRIAL: 'bg-orange-500/10 text-orange-400 border-b border-orange-500/20',
  PARTICULAR: 'bg-emerald-500/10 text-emerald-400 border-b border-emerald-500/20',
  PUBLICO: 'bg-sky-500/10 text-sky-400 border-b border-sky-500/20',
};

export function TabelasList() {
  const [tabelas, setTabelas] = useState<TabelaTarifaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setTabelas(await api.listarTabelas());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar tabelas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await api.excluirTabela(id);
      setTabelas((prev) => prev.filter((t) => t.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Erro ao excluir');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Carregando tabelas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Tentar novamente
        </button>
      </div>
    );
  }

  if (tabelas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
          <Table2 className="w-8 h-8 text-slate-600" />
        </div>
        <div>
          <p className="text-slate-300 font-semibold">Nenhuma tabela cadastrada</p>
          <p className="text-slate-600 text-sm mt-1">Crie uma nova tabela para começar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 text-sm">{tabelas.length} tabela(s)</span>
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs hover:text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" /> Atualizar
        </button>
      </div>

      {tabelas.map((tabela) => (
        <div
          key={tabela.id}
          className="border border-slate-700/70 rounded-2xl overflow-hidden hover:border-slate-600 transition-colors bg-slate-800/30"
        >
          <div className="p-5 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-slate-600 text-xs font-mono">#{tabela.id}</span>
                <h3 className="text-white font-semibold text-base truncate">{tabela.nome}</h3>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-slate-500 text-xs">
                  Vigência: {new Date(tabela.dataVigencia).toLocaleDateString('pt-BR')}
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {tabela.categorias?.map((cat) => (
                    <span
                      key={cat.id}
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${CAT_BADGE[cat.categoria] ?? 'bg-slate-600/20 text-slate-400 border border-slate-600/30'}`}
                    >
                      {cat.categoria}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setExpanded(expanded === tabela.id ? null : tabela.id)}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
                title="Ver faixas"
              >
                {expanded === tabela.id
                  ? <ChevronUp className="w-4 h-4" />
                  : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleDelete(tabela.id)}
                disabled={deleting === tabela.id}
                className="p-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-40 transition-all cursor-pointer"
                title="Excluir"
              >
                {deleting === tabela.id
                  ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {expanded === tabela.id && (
            <div className="border-t border-slate-700/50 p-5 bg-slate-900/60">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                Faixas por Categoria
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {tabela.categorias?.map((cat) => (
                  <div key={cat.id} className="rounded-xl border border-slate-700/50 overflow-hidden">
                    <div className={`px-4 py-2.5 text-xs font-bold ${CAT_HEADER[cat.categoria] ?? 'bg-slate-800 text-slate-400 border-b border-slate-700'}`}>
                      {cat.categoria}
                    </div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-700/40">
                          <th className="px-4 py-2 text-left text-slate-500 font-medium">Faixa</th>
                          <th className="px-4 py-2 text-right text-slate-500 font-medium">R$/m³</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cat.faixas?.map((faixa) => (
                          <tr key={faixa.id} className="border-b border-slate-700/20 last:border-0 hover:bg-slate-700/20 transition-colors">
                            <td className="px-4 py-2.5 text-slate-300 font-mono">
                              {faixa.inicio} – {faixa.fim} m³
                            </td>
                            <td className="px-4 py-2.5 text-right text-emerald-400 font-mono font-semibold">
                              {Number(faixa.valorUnitario).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
