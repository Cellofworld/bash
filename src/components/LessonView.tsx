import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Code, Lightbulb, CheckCircle, Terminal } from 'lucide-react';
import type { Lesson, Progress, TheoryBlock, Exercise } from '../types';
import { TerminalSim } from './TerminalSim';

interface LessonViewProps {
  lesson: Lesson;
  progress: Progress;
  onCompleteExercise: (exerciseId: string, lessonId: number) => void;
  onBack: () => void;
  onNextLesson: () => void;
  onPrevLesson: () => void;
}

type Tab = 'theory' | 'practice';

export function LessonView({ lesson, progress, onCompleteExercise, onBack, onNextLesson, onPrevLesson }: LessonViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('theory');
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set([0]));

  const toggleBlock = (index: number) => {
    setExpandedBlocks(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedBlocks(new Set(lesson.theory.map((_, i) => i)));
  };

  const completedInLesson = lesson.exercises.filter(
    ex => progress.completedExercises.includes(ex.id)
  ).length;

  return (
    <div>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>К списку уроков</span>
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevLesson}
            disabled={lesson.id <= 1}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:border-emerald-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate-600 px-2 font-medium">
            {lesson.id} / 40
          </span>
          <button
            onClick={onNextLesson}
            disabled={lesson.id >= 40}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:border-emerald-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl w-20 h-20 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
            {lesson.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Урок {lesson.id}: {lesson.title}
            </h1>
            <p className="text-slate-600 mt-1">{lesson.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-slate-500 flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                {lesson.theory.length} блоков теории
              </span>
              <span className="text-slate-500 flex items-center gap-1">
                <Code className="w-4 h-4 text-emerald-500" />
                {completedInLesson}/{lesson.exercises.length} задач
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'theory'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Теория
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'practice'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Практика
          {completedInLesson > 0 && (
            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-bold">
              {completedInLesson}/{lesson.exercises.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'theory' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={expandAll}
              className="text-sm text-slate-500 hover:text-emerald-600 transition-colors"
            >
              Развернуть всё
            </button>
          </div>
          {lesson.theory.map((block, index) => (
            <TheoryBlockComponent
              key={index}
              block={block}
              isExpanded={expandedBlocks.has(index)}
              onToggle={() => toggleBlock(index)}
              index={index}
            />
          ))}
          
          <div className="mt-8 text-center">
            <button
              onClick={() => setActiveTab('practice')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              Перейти к практике →
            </button>
          </div>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="space-y-6">
          {lesson.exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={index}
              isCompleted={progress.completedExercises.includes(exercise.id)}
              onComplete={() => onCompleteExercise(exercise.id, lesson.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TheoryBlockComponent({ block, isExpanded, onToggle, index }: {
  block: TheoryBlock;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-sm font-mono shadow-sm">
            {index + 1}
          </span>
          <h3 className="font-semibold text-slate-900 text-left">{block.title}</h3>
        </div>
        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-100">
          <div className="mt-4 prose prose-slate max-w-none">
            <FormattedContent content={block.content} />
          </div>
          
          {block.code && (
            <div className="mt-4 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-md">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 border-b border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="text-xs text-slate-400 ml-2 font-mono">terminal</span>
              </div>
              <pre className="p-4 text-sm overflow-x-auto">
                <code className="text-emerald-300 font-mono leading-relaxed">
                  {block.code}
                </code>
              </pre>
            </div>
          )}
          
          {block.note && (
            <div className="mt-4 flex gap-3 p-3 bg-sky-50 border border-sky-200 rounded-lg">
              <Lightbulb className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <p className="text-sm text-sky-900">{block.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FormattedContent({ content }: { content: string }) {
  const lines = content.split('\n');
  
  return (
    <div className="text-slate-700 text-sm leading-relaxed space-y-2">
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        
        let processed = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>');
        processed = processed.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-emerald-700 font-mono text-xs">$1</code>');
        
        if (processed.match(/^[-*]\s/)) {
          processed = processed.replace(/^[-*]\s/, '');
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="text-emerald-500">•</span>
              <span dangerouslySetInnerHTML={{ __html: processed }} />
            </div>
          );
        }
        
        const numberedMatch = processed.match(/^(\d+)\.\s(.+)/);
        if (numberedMatch) {
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="text-emerald-600 font-mono text-xs font-bold">{numberedMatch[1]}.</span>
              <span dangerouslySetInnerHTML={{ __html: numberedMatch[2] }} />
            </div>
          );
        }
        
        return <p key={i} dangerouslySetInnerHTML={{ __html: processed }} />;
      })}
    </div>
  );
}

function ExerciseCard({ exercise, index, isCompleted, onComplete }: {
  exercise: Exercise;
  index: number;
  isCompleted: boolean;
  onComplete: () => void;
}) {
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    if (isCompleted) setShowSuccess(true);
  }, [isCompleted]);

  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${
      isCompleted 
        ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200' 
        : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className="p-4 flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isCompleted ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm' : 'bg-slate-100 border border-slate-200'
        }`}>
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-white" />
          ) : (
            <span className="text-sm font-mono text-slate-600">{index + 1}</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${isCompleted ? 'text-emerald-700' : 'text-slate-900'}`}>
            {exercise.title}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{exercise.description}</p>
          
          {showHint && exercise.hint && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                💡 <strong>Подсказка:</strong> {exercise.hint}
              </p>
            </div>
          )}
          
          {showSuccess && (
            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg animate-pulse">
              <p className="text-sm text-emerald-800">{exercise.successMessage}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-slate-200">
        <TerminalSim
          exercise={exercise}
          isCompleted={isCompleted}
          onComplete={onComplete}
          onSuccess={() => setShowSuccess(true)}
        />
      </div>
      
      {!isCompleted && (
        <div className="px-4 pb-3 flex gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-slate-500 hover:text-amber-600 transition-colors flex items-center gap-1"
          >
            <Lightbulb className="w-3 h-3" />
            {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
          </button>
        </div>
      )}
    </div>
  );
}
