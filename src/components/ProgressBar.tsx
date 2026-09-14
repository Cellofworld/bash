interface ProgressBarProps {
  completed: number;
  total: number;
  lessonsCompleted: number;
  totalLessons: number;
}

export function ProgressBar({ completed, total, lessonsCompleted, totalLessons }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className="mb-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Ваш прогресс</h2>
          <p className="text-sm text-slate-500">
            {lessonsCompleted} из {totalLessons} уроков завершено
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {percent}%
          </div>
          <div className="text-xs text-slate-500">{completed}/{total} задач</div>
        </div>
      </div>
      
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${percent}%` }}
        />
      </div>
      
      {percent === 100 && (
        <div className="mt-3 text-center text-emerald-600 font-medium animate-pulse">
          🎉 Поздравляем! Вы прошли все задания!
        </div>
      )}
      
      {percent >= 50 && percent < 100 && (
        <div className="mt-3 text-center text-amber-600 text-sm">
          💪 Отличный прогресс! Продолжайте в том же духе!
        </div>
      )}
    </div>
  );
}
