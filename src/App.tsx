import { useState, useEffect } from 'react';
import { lessons as basicLessons } from './data/lessons';
import { advancedLessons } from './data/lessons-advanced';
import { ultimateLessons } from './data/lessons-ultimate';
import { LessonView } from './components/LessonView';
import { LessonList } from './components/LessonList';
import { ProgressBar } from './components/ProgressBar';
import { Header } from './components/Header';
import type { Progress, Lesson } from './types';

const lessons: Lesson[] = [...basicLessons, ...advancedLessons, ...ultimateLessons];
const TOTAL_LESSONS = lessons.length;

const STORAGE_KEY = 'bash-tutorial-progress';

function loadProgress(): Progress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { completedExercises: [], completedLessons: [], currentLesson: null };
}

function saveProgress(progress: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export default function App() {
  const [progress, setProgress] = useState<Progress>(loadProgress());
  const [currentView, setCurrentView] = useState<'home' | 'lesson'>('home');
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const openLesson = (lessonId: number) => {
    setSelectedLesson(lessonId);
    setCurrentView('lesson');
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedLesson(null);
  };

  const completeExercise = (exerciseId: string, lessonId: number) => {
    setProgress(prev => {
      const newCompleted = prev.completedExercises.includes(exerciseId)
        ? prev.completedExercises
        : [...prev.completedExercises, exerciseId];
      
      const lesson = lessons.find(l => l.id === lessonId);
      const allDone = lesson?.exercises.every((ex: { id: string }) => 
        newCompleted.includes(ex.id)
      );
      
      const newLessons = allDone && !prev.completedLessons.includes(lessonId)
        ? [...prev.completedLessons, lessonId]
        : prev.completedLessons;
      
      return {
        ...prev,
        completedExercises: newCompleted,
        completedLessons: newLessons,
      };
    });
  };

  const resetProgress = () => {
    if (confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
      setProgress({ completedExercises: [], completedLessons: [], currentLesson: null });
    }
  };

  const totalExercises = lessons.reduce((sum, l) => sum + l.exercises.length, 0);
  const completedCount = progress.completedExercises.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 text-slate-900">
      <Header 
        onHome={goHome} 
        onReset={resetProgress}
        progress={completedCount}
        total={totalExercises}
      />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        {currentView === 'home' && (
          <>
            <ProgressBar 
              completed={completedCount} 
              total={totalExercises} 
              lessonsCompleted={progress.completedLessons.length}
              totalLessons={TOTAL_LESSONS}
            />
            <LessonList 
              lessons={lessons} 
              progress={progress}
              onSelect={openLesson} 
            />
          </>
        )}
        
        {currentView === 'lesson' && selectedLesson && (
          <LessonView
            lesson={lessons.find(l => l.id === selectedLesson)!}
            progress={progress}
            onCompleteExercise={completeExercise}
            onBack={goHome}
            onNextLesson={() => {
              const nextId = selectedLesson + 1;
              if (nextId <= TOTAL_LESSONS) openLesson(nextId);
            }}
            onPrevLesson={() => {
              const prevId = selectedLesson - 1;
              if (prevId >= 1) openLesson(prevId);
            }}
          />
        )}
      </main>

      <footer className="mt-12 py-6 text-center text-sm text-slate-500 border-t border-slate-200">
        <p>BashMaster — Интерактивный самоучитель Bash • {TOTAL_LESSONS} уроков • {totalExercises} задач</p>
      </footer>
    </div>
  );
}
