import { useState, useEffect } from 'react';
import { lessons } from './data/lessons';
import { LessonView } from './components/LessonView';
import { LessonList } from './components/LessonList';
import { ProgressBar } from './components/ProgressBar';
import { Header } from './components/Header';
import type { Progress } from './types';

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
  const [progress, setProgress] = useState<Progress>(loadProgress);
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
    setProgress({ completedExercises: [], completedLessons: [], currentLesson: null });
  };

  const totalExercises = lessons.reduce((sum, l) => sum + l.exercises.length, 0);
  const completedCount = progress.completedExercises.length;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
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
              totalLessons={lessons.length}
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
              if (nextId <= lessons.length) openLesson(nextId);
            }}
            onPrevLesson={() => {
              const prevId = selectedLesson - 1;
              if (prevId >= 1) openLesson(prevId);
            }}
          />
        )}
      </main>
    </div>
  );
}
