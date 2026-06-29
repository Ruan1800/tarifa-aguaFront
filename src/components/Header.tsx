import { Droplets } from 'lucide-react';

export function Header() {
  return (
    <header className="glass-dark border-b border-blue-900/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30">
          <Droplets className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight tracking-tight">
            AquaTarifa
          </h1>
          <p className="text-blue-400/70 text-xs">Sistema de Tarifação de Água</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            API Online
          </span>
        </div>
      </div>
    </header>
  );
}
