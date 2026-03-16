import { create } from 'zustand';
import { User, Course, Progress, Achievement, CommunityPost } from '@/types';
import { mockCourses, mockProgress, mockAchievements, mockCommunityPosts, mockUserStats } from '@/data/mockData';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  courses: Course[];
  currentCourse: Course | null;
  progress: Progress[];
  achievements: Achievement[];
  communityPosts: CommunityPost[];
  currentLanguage: string;
  stats: typeof mockUserStats;
  
  login: (email: string) => void;
  logout: () => void;
  setCurrentCourse: (course: Course | null) => void;
  setCurrentLanguage: (lang: string) => void;
  updateProgress: (courseId: string, lessonId: string, percent: number) => void;
  completeLesson: (courseId: string, lessonId: string) => void;
  toggleAchievement: (achievementId: string) => void;
  addCommunityPost: (post: CommunityPost) => void;
  incrementStudyTime: (minutes: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  courses: mockCourses,
  currentCourse: null,
  progress: mockProgress,
  achievements: mockAchievements,
  communityPosts: mockCommunityPosts,
  currentLanguage: 'en',
  stats: mockUserStats,

  login: (email: string) => {
    set({
      isAuthenticated: true,
      user: {
        id: '1',
        email,
        username: email.split('@')[0],
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        current_language: 'en',
        level: 'A2',
        total_study_minutes: 1245,
        streak_days: 12,
        created_at: new Date().toISOString(),
      },
    });
  },

  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
    });
  },

  setCurrentCourse: (course) => {
    set({ currentCourse: course });
  },

  setCurrentLanguage: (lang) => {
    set({ currentLanguage: lang });
  },

  updateProgress: (courseId, lessonId, percent) => {
    const { progress } = get();
    const existing = progress.find(
      (p) => p.course_id === courseId && p.lesson_id === lessonId
    );

    if (existing) {
      set({
        progress: progress.map((p) =>
          p.id === existing.id
            ? { ...p, completion_percent: percent, last_studied: new Date().toISOString() }
            : p
        ),
      });
    } else {
      set({
        progress: [
          ...progress,
          {
            id: Date.now().toString(),
            user_id: '1',
            course_id: courseId,
            lesson_id: lessonId,
            completion_percent: percent,
            is_completed: false,
            last_studied: new Date().toISOString(),
          },
        ],
      });
    }
  },

  completeLesson: (courseId, lessonId) => {
    const { progress, stats } = get();
    const existing = progress.find(
      (p) => p.course_id === courseId && p.lesson_id === lessonId
    );

    if (existing) {
      set({
        progress: progress.map((p) =>
          p.id === existing.id
            ? { ...p, completion_percent: 100, is_completed: true, last_studied: new Date().toISOString() }
            : p
        ),
        stats: { ...stats, coursesCompleted: stats.coursesCompleted + 1 },
      });
    }
  },

  toggleAchievement: (achievementId) => {
    const { achievements } = get();
    set({
      achievements: achievements.map((a) =>
        a.id === achievementId
          ? { ...a, is_unlocked: !a.is_unlocked, unlocked_at: !a.is_unlocked ? new Date().toISOString() : null }
          : a
      ),
    });
  },

  addCommunityPost: (post) => {
    const { communityPosts } = get();
    set({ communityPosts: [post, ...communityPosts] });
  },

  incrementStudyTime: (minutes) => {
    const { stats } = get();
    set({
      stats: { ...stats, totalStudyMinutes: stats.totalStudyMinutes + minutes },
    });
  },
}));
