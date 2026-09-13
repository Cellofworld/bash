import { CheckCircle } from 'lucide-react';
import type { Lesson, Progress } from '../types';
// eslint-disable-next-line

interface LessonListProps {
  lessons: Lesson[];
  progress: Progress;
  onSelect: (id: number) => void;
}

export function LessonList({ lessons, progress, onSelect }: LessonListProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-100">
        📚 Программа обучения
      </h2>
      
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
              className={`text-left p-5 rounded-xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                isCompleted 
                  ? 'bg-green-950/30 border-green-800 hover:border-green-600' 
                  : completedInLesson > 0
                    ? 'bg-yellow-950/20 border-yellow-800/50 hover:border-yellow-600'
                    : 'bg-gray-900 border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{lesson.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500">#{lesson.id}</span>
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-100 mt-1">{lesson.title}</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{lesson.description}</p>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isCompleted ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
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
