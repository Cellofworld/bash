interface ProgressBarProps {
  completed: number;
  total: number;
  lessonsCompleted: number;
  totalLessons: number;
}

export function ProgressBar({ completed, total, lessonsCompleted, totalLessons }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className="mb-8 bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">Ваш прогресс</h2>
          <p className="text-sm text-gray-400">
            {lessonsCompleted} из {totalLessons} уроков завершено
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-400">{percent}%</div>
          <div className="text-xs text-gray-500">{completed}/{total} задач</div>
        </div>
      </div>
      
      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      
      {percent === 100 && (
        <div className="mt-3 text-center text-green-400 font-medium animate-pulse">
          🎉 Поздравляем! Вы прошли все задания!
        </div>
      )}
      
      {percent >= 50 && percent < 100 && (
        <div className="mt-3 text-center text-yellow-400 text-sm">
          💪 Отличный прогресс! Продолжайте в том же духе!
        </div>
      )}
    </div>
  );
}
