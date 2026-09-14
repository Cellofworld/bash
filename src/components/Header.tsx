import { Terminal, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onHome: () => void;
  onReset: () => void;
  progress: number;
  total: number;
}

export function Header({ onHome, onReset, progress, total }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button 
          onClick={onHome}
          className="flex items-center gap-2 hover:text-emerald-600 transition-colors group"
        >
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-tight">
              <span className="text-emerald-600">Bash</span>
              <span className="text-slate-800">Master</span>
            </h1>
            <span className="text-xs text-slate-500 hidden sm:inline">Интерактивный самоучитель</span>
          </div>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">
              <span className="text-emerald-600 font-bold">{progress}</span>
              <span className="text-slate-400">/{total}</span>
            </span>
          </div>
          <button
            onClick={onReset}
            className="p-2 text-slate-500 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
            title="Сбросить прогресс"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
