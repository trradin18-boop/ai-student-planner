// User & Authentication
export interface User {
  id: string;
  name: string;
  email: string;
  grade: string;
  school?: string;
  profileImage?: string;
  language: 'fa' | 'en';
  theme: 'light' | 'dark';
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

// Academic Structure
export interface Subject {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon?: string;
  code?: string;
  teacher?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  subjectId: string;
  userId: string;
  name: string;
  description?: string;
  totalChapters: number;
  completedChapters: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string;
  courseId: string;
  subjectId: string;
  userId: string;
  name: string;
  order: number;
  estimatedHours: number;
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  id: string;
  chapterId: string;
  courseId: string;
  subjectId: string;
  userId: string;
  name: string;
  order: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours: number;
  mastery: number; // 0-100
  status: 'not-started' | 'started' | 'learning' | 'reviewing' | 'strong' | 'mastered';
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// School & Classes
export interface SchoolSchedule {
  id: string;
  userId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  createdAt: Date;
  updatedAt: Date;
}

export interface Class {
  id: string;
  userId: string;
  name: string;
  subject?: string;
  teacher?: string;
  room?: string;
  location?: string;
  isOnline: boolean;
  joinLink?: string;
  recordingLink?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassSession {
  id: string;
  classId: string;
  userId: string;
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isRecurring: boolean;
  recurringPattern?: 'weekly' | 'biweekly' | 'monthly';
  recurringUntil?: Date;
  isCanceled?: boolean;
  canceledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnlineClass {
  id: string;
  userId: string;
  name: string;
  subject?: string;
  teacher?: string;
  platform?: string; // Zoom, Google Meet, etc.
  joinLink?: string;
  recordingLink?: string;
  files?: string[]; // File URLs
  notes?: string;
  sessionSchedules: ClassSession[];
  homework?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// School/Classes Extra
export interface ExtraClass {
  id: string;
  userId: string;
  name: string;
  category: 'language' | 'music' | 'art' | 'programming' | 'sport' | 'skill' | 'other';
  teacher?: string;
  location?: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  dayOfWeek: number;
  isOnline: boolean;
  joinLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tasks & Homework
export interface Homework {
  id: string;
  userId: string;
  classId?: string;
  onlineClassId?: string;
  subjectId?: string;
  title: string;
  description?: string;
  deadline: Date;
  estimatedTime: number; // minutes
  priority: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'pending' | 'in-progress' | 'completed' | 'submitted';
  submittedAt?: Date;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyTask {
  id: string;
  userId: string;
  topicId?: string;
  chapterId?: string;
  subjectId?: string;
  title: string;
  description?: string;
  taskType: 'study' | 'review' | 'practice' | 'test' | 'spaced-repetition';
  priority: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // minutes
  deadline?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Study Sessions
export interface StudySession {
  id: string;
  userId: string;
  taskId?: string;
  topicId?: string;
  chapterId?: string;
  subjectId?: string;
  title: string;
  plannedStartTime?: Date;
  plannedDuration: number; // minutes
  actualStartTime?: Date;
  actualEndTime?: Date;
  actualDuration?: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'skipped' | 'rescheduled';
  focusQuality: number; // 0-100
  sessionNotes?: string;
  completionGoal?: string;
  goalAchieved?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Exams
export interface Exam {
  id: string;
  userId: string;
  subjectId: string;
  name: string;
  date: Date;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location?: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  chapters?: string[]; // Chapter IDs
  topics?: string[]; // Topic IDs
  estimatedCoverage: number; // percentage
  readinessLevel: number; // 0-100
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Test {
  id: string;
  userId: string;
  topicId?: string;
  chapterId?: string;
  subjectId?: string;
  examId?: string;
  title: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  blankAnswers: number;
  percentage: number; // calculated
  timeSpent: number; // minutes
  averageTimePerQuestion: number; // seconds
  difficulty: 'easy' | 'medium' | 'hard';
  testDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestQuestion {
  id: string;
  testId: string;
  questionNumber: number;
  topic?: string;
  isCorrect: boolean;
  timeSpent: number; // seconds
  difficulty: 'easy' | 'medium' | 'hard';
}

// Time Management
export interface TimeBlock {
  id: string;
  userId: string;
  type: 'fixed' | 'flexible' | 'preferred' | 'optional';
  category: 'school' | 'class' | 'study' | 'homework' | 'test' | 'sleep' | 'exercise' | 'meal' | 'travel' | 'activity' | 'personal';
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface SleepSchedule {
  id: string;
  userId: string;
  targetBedtime: string; // HH:mm
  targetWakeTime: string; // HH:mm
  minimumSleepHours: number;
  preferredSleepHours: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  id: string;
  userId: string;
  type: string;
  dayOfWeek: number;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface TravelBlock {
  id: string;
  userId: string;
  fromLocation: string;
  toLocation: string;
  dayOfWeek?: number;
  startTime: string; // HH:mm
  duration: number; // minutes
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Activities
export interface Activity {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'academic' | 'health' | 'personal' | 'other';
  subcategory: string;
  type: 'fixed' | 'flexible' | 'preferred' | 'optional';
  startTime?: Date;
  endTime?: Date;
  duration?: number; // minutes
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Planner & Scheduling
export interface PlannedSession {
  id: string;
  userId: string;
  studySessionId?: string;
  taskId?: string;
  homeworkId?: string;
  plannedDate: Date;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // minutes
  priority: number; // 0-100 (score)
  reason?: string; // Why this time slot was chosen
  status: 'scheduled' | 'started' | 'completed' | 'failed' | 'rescheduled';
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyPlan {
  id: string;
  userId: string;
  date: Date;
  plannedSessions: PlannedSession[];
  totalPlannedHours: number;
  totalAvailableHours: number;
  conflictDetected: boolean;
  conflicts?: string[];
  version: number; // For tracking replans
  isOptimized: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReplanEvent {
  id: string;
  userId: string;
  date: Date;
  reason: 'class-added' | 'class-moved' | 'exam-changed' | 'homework-added' | 'session-failed' | 'late-start' | 'manual-request';
  affectedSessions?: string[]; // Session IDs
  newPlanCreated: boolean;
  createdAt: Date;
}

// Goals
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: 'daily' | 'weekly' | 'exam' | 'subject' | 'long-term';
  targetValue: number;
  targetUnit: string; // "hours", "percentage", etc.
  deadline?: Date;
  subjectId?: string;
  progress: number;
  status: 'active' | 'completed' | 'failed' | 'paused';
  createdAt: Date;
  updatedAt: Date;
}

// Progress & Analytics
export interface Progress {
  id: string;
  userId: string;
  topicId?: string;
  chapterId?: string;
  subjectId?: string;
  status: 'not-started' | 'started' | 'learning' | 'reviewing' | 'strong' | 'mastered';
  percentage: number; // 0-100
  lastStudyDate?: Date;
  totalHoursSpent: number;
  sessionsCompleted: number;
  testsCompleted: number;
  averageTestScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnergyLog {
  id: string;
  userId: string;
  date: Date;
  time: string; // HH:mm
  level: 'low' | 'medium' | 'high';
  note?: string;
  createdAt: Date;
}

export interface Analytics {
  userId: string;
  date: Date;
  totalStudyTime: number; // minutes
  totalClassTime: number; // minutes
  totalHomeworkTime: number; // minutes
  actualSleepHours: number;
  studyConsistency: number; // 0-100
  completionRate: number; // 0-100
  subjectDistribution: Record<string, number>; // subject -> minutes
  testScores: number[];
  streakDays: number;
}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  type: 'class' | 'exam' | 'homework' | 'study' | 'review' | 'conflict' | 'replan' | 'reminder';
  title: string;
  message: string;
  referenceId?: string; // ID of related entity
  isRead: boolean;
  scheduledFor: Date;
  createdAt: Date;
}

// Settings & Preferences
export interface UserPreferences {
  id: string;
  userId: string;
  language: 'fa' | 'en';
  theme: 'light' | 'dark' | 'system';
  timezone: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  studyReminders: boolean;
  plannerAlerts: boolean;
  soundEnabled: boolean;
  defaultTaskDuration: number; // minutes
  minStudySessionDuration: number; // minutes
  maxStudySessionDuration: number; // minutes
  breakBetweenSessions: number; // minutes
  createdAt: Date;
  updatedAt: Date;
}
