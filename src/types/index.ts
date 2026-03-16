export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
  current_language: string;
  level: string;
  total_study_minutes: number;
  streak_days: number;
  created_at: string;
}

export interface Course {
  id: string;
  language: string;
  level: string;
  title: string;
  description: string;
  cover_image: string;
  total_lessons: number;
  total_duration: number;
  enrolled_count: number;
}

export interface Lesson {
  id: string;
  course_id: string;
  order: number;
  title: string;
  type: 'vocabulary' | 'grammar' | 'listening' | 'speaking';
  duration: number;
  content: string;
}

export interface Vocabulary {
  id: string;
  lesson_id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example_sentence: string;
  difficulty: number;
}

export interface GrammarExercise {
  id: string;
  lesson_id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface ListeningMaterial {
  id: string;
  lesson_id: string;
  title: string;
  audio_url: string;
  transcript: string;
  difficulty: number;
}

export interface LearningPath {
  id: string;
  user_id: string;
  name: string;
  daily_goals: { [key: string]: number };
  course_ids: string[];
  is_active: boolean;
}

export interface Progress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  completion_percent: number;
  is_completed: boolean;
  last_studied: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  badge_id: string;
  name: string;
  description: string;
  icon: string;
  is_unlocked: boolean;
  unlocked_at: string | null;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  title: string;
  content: string;
  language: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}
