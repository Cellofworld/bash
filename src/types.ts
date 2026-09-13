export interface Lesson {
  id: number;
  title: string;
  icon: string;
  description: string;
  theory: TheoryBlock[];
  exercises: Exercise[];
}

export interface TheoryBlock {
  title: string;
  content: string;
  code?: string;
  note?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  hint?: string;
  initialFiles?: Record<string, string>;
  expectedCommands: string[];
  successMessage: string;
}

export interface Progress {
  completedExercises: string[];
  completedLessons: number[];
  currentLesson: number | null;
}
