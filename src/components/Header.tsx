import { Terminal, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onHome: () => void;
  onReset: () => void;
  progress: number;
  total: number;
}

export function Header({ onHome, onReset, progress, total }: HeaderProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button 
          onClick={onHome}
          className="flex items-center gap-2 hover:text-green-400 transition-colors"
        >
          <Terminal className="w-6 h-6 text-green-400" />
          <h1 className="text-xl font-bold">
            <span className="text-green-400">Bash</span>
            <span className="text-gray-300">Master</span>
          </h1>
          <span className="text-xs text-gray-500 hidden sm:inline">Интерактивный самоучитель</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400 hidden sm:block">
            <span className="text-green-400 font-mono">{progress}</span>/{total} задач
          </div>
          <button
            onClick={onReset}
            className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800"
            title="Сбросить прогресс"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
