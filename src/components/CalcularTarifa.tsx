import { useState } from 'react';
import { Calculator, Droplets, ReceiptText, Building2, Factory, Home, Landmark } from 'lucide-react';
import { api } from '../services/api';
import type { Categoria, CalculoResult } from '../types/api';

const CATEGORIAS = [
  { id: 'COMERCIAL' as Categoria, label: 'Comercial', icon: Building2, active: 'border-violet-500 bg-violet-500/10 text-violet-300' },
  { id: 'INDUSTRIAL' as Categoria, label: 'Industrial', icon: Factory, active: 'border-orange-500 bg-orange-500/10 text-orange-300' },
  { id: 'PARTICULAR' as Categoria, label: 'Particular', icon: Home, active: 'border-emerald-500 bg-emerald-500/10 text-emerald-300' },
  { id: 'PUBLICO' as Categoria, label: 'Público', icon: Landmark, active: 'border-sky-500 bg-sky-500/10 text-sky-300' },
];

const CAT_TEXT: Record<string, string> = {
  COMERCIAL: 'text-violet-400',
  INDUSTRIAL: 'text-orange-400',
  PARTICULAR: 'text-emerald-400',
  PUBLICO: 'text-sky-400',
};

export function CalcularTarifa() {
  const [categoria, setCategoria] = useState<Categoria>('COMERCIAL');
  const [consumo, setConsumo] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculoResult | null>(null);
  const [error, setError] = useState('');

  const handleCalc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumo || Number(consumo) <= 0) {
      setError('Informe um consumo válido maior que zero.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await api.calcular({ categoria, consumo: Number(consumo) });
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao calcular');
    } finally {
      setLoading(false);
    }
  };

  const maxSubtotal = result ? Math.max(...result.detalhamento.map((d) => d.subtotal)) : 1;

  return (
    <div className="space-y-8">
      <form onSubmit={handleCalc} className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Categoria do Consumidor</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIAS.map(({ id, label, icon: Icon, active }) => (
              <button
                key={id}
                type="button"
                onClick={() => setCategoria(id)}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  categoria === id
                    ? active
                    : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300 bg-slate-800/50'
                }`}
              >
                <Icon className="w-6 h-6" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Consumo</p>
          <div className="relative">
            <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500/50" />
            <input
              type="number"
              min={1}
              value={consumo}
              onChange={(e) => setConsumo(e.target.value)}
              placeholder="0"
              className="w-full pl-12 pr-20 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white text-xl font-semibold placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">m³</span>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Calculando...
            </>
          ) : (
            <>
              <Calculator className="w-5 h-5" />
              Calcular Valor
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="space-y-5 border-t border-slate-800 pt-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/40 rounded-2xl border border-slate-700/60 p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <ReceiptText className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Valor Total a Pagar</span>
            </div>
            <p className="text-5xl font-extrabold mb-2">
              <span className="text-slate-400 text-2xl font-semibold">R$ </span>
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {Number(result.valorTotal).toFixed(2).replace('.', ',')}
              </span>
            </p>
            <p className={`text-sm font-semibold mt-1 ${CAT_TEXT[result.categoria] ?? 'text-slate-400'}`}>
              {result.categoria} · {result.consumoTotal} m³ consumidos
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Detalhamento por Faixa</p>
            {result.detalhamento.map((item, idx) => {
              const pct = maxSubtotal > 0 ? (item.subtotal / maxSubtotal) * 100 : 0;
              return (
                <div key={idx} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-semibold text-sm">
                        Faixa {idx + 1}: {item.faixa.inicio}–{item.faixa.fim} m³
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {item.m3Cobrados} m³ × R$ {Number(item.valorUnitario).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono text-base">
                      R$ {Number(item.subtotal).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
