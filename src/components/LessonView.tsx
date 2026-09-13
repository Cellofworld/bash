import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, BookOpen, Code, Lightbulb, CheckCircle, Terminal } from 'lucide-react';
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
          className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>К списку уроков</span>
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevLesson}
            disabled={lesson.id <= 1}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-400 px-2">
            {lesson.id} / 20
          </span>
          <button
            onClick={onNextLesson}
            disabled={lesson.id >= 20}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{lesson.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">
              Урок {lesson.id}: {lesson.title}
            </h1>
            <p className="text-gray-400 mt-1">{lesson.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-gray-500">
                <BookOpen className="w-4 h-4 inline mr-1" />
                {lesson.theory.length} блоков теории
              </span>
              <span className="text-gray-500">
                <Code className="w-4 h-4 inline mr-1" />
                {completedInLesson}/{lesson.exercises.length} задач
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'theory'
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
              : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Теория
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'practice'
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
              : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Практика
          {completedInLesson > 0 && (
            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">
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
              className="text-sm text-gray-500 hover:text-green-400 transition-colors"
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
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-green-600/20 hover:shadow-green-500/30"
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
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-green-600/20 text-green-400 flex items-center justify-center text-sm font-mono">
            {index + 1}
          </span>
          <h3 className="font-semibold text-gray-100 text-left">{block.title}</h3>
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-800">
          <div className="mt-4 prose prose-invert max-w-none">
            <FormattedContent content={block.content} />
          </div>
          
          {block.code && (
            <div className="mt-4 bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 border-b border-gray-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">terminal</span>
              </div>
              <pre className="p-4 text-sm overflow-x-auto">
                <code className="text-green-300 font-mono leading-relaxed">
                  {block.code}
                </code>
              </pre>
            </div>
          )}
          
          {block.note && (
            <div className="mt-4 flex gap-3 p-3 bg-blue-950/30 border border-blue-800/50 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-300">{block.note}</p>
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
    <div className="text-gray-300 text-sm leading-relaxed space-y-2">
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        
        // Bold
        let processed = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-100 font-semibold">$1</strong>');
        // Inline code
        processed = processed.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-gray-800 rounded text-green-400 font-mono text-xs">$1</code>');
        // Lists
        if (processed.match(/^[-*]\s/)) {
          processed = processed.replace(/^[-*]\s/, '');
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="text-green-400">•</span>
              <span dangerouslySetInnerHTML={{ __html: processed }} />
            </div>
          );
        }
        // Numbered lists
        const numberedMatch = processed.match(/^(\d+)\.\s(.+)/);
        if (numberedMatch) {
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="text-green-400 font-mono text-xs">{numberedMatch[1]}.</span>
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
        ? 'bg-green-950/20 border-green-800' 
        : 'bg-gray-900 border-gray-800'
    }`}>
      <div className="p-4 flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isCompleted ? 'bg-green-600' : 'bg-gray-700'
        }`}>
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-white" />
          ) : (
            <span className="text-sm font-mono text-gray-300">{index + 1}</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${isCompleted ? 'text-green-300' : 'text-gray-100'}`}>
            {exercise.title}
          </h3>
          <p className="text-sm text-gray-400 mt-1">{exercise.description}</p>
          
          {showHint && exercise.hint && (
            <div className="mt-3 p-3 bg-yellow-950/30 border border-yellow-800/50 rounded-lg">
              <p className="text-sm text-yellow-300">
                💡 <strong>Подсказка:</strong> {exercise.hint}
              </p>
            </div>
          )}
          
          {showSuccess && (
            <div className="mt-3 p-3 bg-green-950/30 border border-green-800/50 rounded-lg animate-pulse">
              <p className="text-sm text-green-300">{exercise.successMessage}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Terminal */}
      <div className="border-t border-gray-800">
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
            className="text-xs text-gray-500 hover:text-yellow-400 transition-colors flex items-center gap-1"
          >
            <Lightbulb className="w-3 h-3" />
            {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
          </button>
        </div>
      )}
    </div>
  );
}
