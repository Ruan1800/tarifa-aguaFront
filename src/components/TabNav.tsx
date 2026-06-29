import { Calculator, Table2, PlusCircle } from 'lucide-react';

export type Tab = 'tabelas' | 'criar' | 'calcular';

interface TabNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs = [
  { id: 'tabelas' as Tab, label: 'Tabelas', icon: Table2 },
  { id: 'criar' as Tab, label: 'Nova Tabela', icon: PlusCircle },
  { id: 'calcular' as Tab, label: 'Calcular', icon: Calculator },
];

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <div className="inline-flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
            active === id
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Icon className="w-4 h-4 shrink-0" />
          {label}
        </button>
      ))}
    </div>
  );
}
