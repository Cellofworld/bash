import { CheckCircle } from 'lucide-react';
import type { Lesson, Progress } from '../types';

interface LessonListProps {
  lessons: Lesson[];
  progress: Progress;
  onSelect: (id: number) => void;
}

export function LessonList({ lessons, progress, onSelect }: LessonListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          📚 Программа обучения
        </h2>
        <div className="text-sm text-slate-500">
          {lessons.length} уроков
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {lessons.map((lesson) => {
          const isCompleted = progress.completedLessons.includes(lesson.id);
          const completedInLesson = lesson.exercises.filter(
            (ex) => progress.completedExercises.includes(ex.id)
          ).length;
          const totalInLesson = lesson.exercises.length;
          const progressPercent = totalInLesson > 0 
            ? Math.round((completedInLesson / totalInLesson) * 100) 
            : 0;
          
          return (
            <button
              key={lesson.id}
              onClick={() => onSelect(lesson.id)}
              className={`text-left p-5 rounded-xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
                isCompleted 
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-400' 
                  : completedInLesson > 0
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:border-amber-400'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-emerald-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100">
                  {lesson.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      #{lesson.id}
                    </span>
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 mt-1">{lesson.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{lesson.description}</p>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap font-medium">
                      {completedInLesson}/{totalInLesson}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
