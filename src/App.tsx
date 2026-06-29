import { useState } from 'react';
import { Droplets } from 'lucide-react';
import { TabNav, type Tab } from './components/TabNav';
import { TabelasList } from './components/TabelasList';
import { CriarTabela } from './components/CriarTabela';
import { CalcularTarifa } from './components/CalcularTarifa';

function App() {
  const [tab, setTab] = useState<Tab>('tabelas');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTabChange = (t: Tab) => {
    setTab(t);
    if (t === 'tabelas') setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-700/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-violet-700/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-700/6 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 sticky top-0 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">AquaTarifa</p>
              <p className="text-slate-500 text-xs">Tarifação de Água</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Sistema Online
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-12 pb-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Gestão de{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Tarifas de Água
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
            Crie tabelas tarifárias, gerencie categorias e calcule valores por consumo progressivo
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <TabNav active={tab} onChange={handleTabChange} />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
          <div className="p-6 sm:p-8">
            {tab === 'tabelas' && (
              <div key={refreshKey}>
                <SectionHeader
                  title="Tabelas Cadastradas"
                  subtitle="Visualize e gerencie todas as tabelas tarifárias do sistema"
                />
                <TabelasList />
              </div>
            )}
            {tab === 'criar' && (
              <div>
                <SectionHeader
                  title="Nova Tabela Tarifária"
                  subtitle="Configure categorias de consumo e faixas de preço progressivo"
                />
                <CriarTabela onSuccess={() => handleTabChange('tabelas')} />
              </div>
            )}
            {tab === 'calcular' && (
              <div>
                <SectionHeader
                  title="Calcular Tarifa"
                  subtitle="Calcule o valor a pagar com base na categoria e no consumo informado"
                />
                <CalcularTarifa />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 pb-6 border-b border-slate-800">
      <h2 className="text-white font-bold text-xl tracking-tight">{title}</h2>
      <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
    </div>
  );
}

export default App;
