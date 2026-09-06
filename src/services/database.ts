import { v4 as uuidv4 } from 'uuid';
import type * from '../types';

// Simple in-memory database for prototype
// In production, replace with real database (PostgreSQL, MongoDB, etc.)

class Database {
  private users: Map<string, User> = new Map();
  private subjects: Map<string, Subject> = new Map();
  private courses: Map<string, Course> = new Map();
  private chapters: Map<string, Chapter> = new Map();
  private topics: Map<string, Topic> = new Map();
  private classes: Map<string, Class> = new Map();
  private classSessions: Map<string, ClassSession> = new Map();
  private onlineClasses: Map<string, OnlineClass> = new Map();
  private extraClasses: Map<string, ExtraClass> = new Map();
  private homework: Map<string, Homework> = new Map();
  private studyTasks: Map<string, StudyTask> = new Map();
  private studySessions: Map<string, StudySession> = new Map();
  private exams: Map<string, Exam> = new Map();
  private tests: Map<string, Test> = new Map();
  private timeBlocks: Map<string, TimeBlock> = new Map();
  private sleepSchedules: Map<string, SleepSchedule> = new Map();
  private exercises: Map<string, Exercise> = new Map();
  private travelBlocks: Map<string, TravelBlock> = new Map();
  private activities: Map<string, Activity> = new Map();
  private plannedSessions: Map<string, PlannedSession> = new Map();
  private dailyPlans: Map<string, DailyPlan> = new Map();
  private goals: Map<string, Goal> = new Map();
  private progress: Map<string, Progress> = new Map();
  private energyLogs: Map<string, EnergyLog> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private userPreferences: Map<string, UserPreferences> = new Map();

  // Users
  createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const user: User = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  updateUser(userId: string, data: Partial<User>): User {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    const updated: User = { ...user, ...data, updatedAt: new Date() };
    this.users.set(userId, updated);
    return updated;
  }

  // Subjects
  createSubject(userId: string, data: Omit<Subject, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Subject {
    const subject: Subject = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.subjects.set(subject.id, subject);
    return subject;
  }

  getSubjects(userId: string): Subject[] {
    return Array.from(this.subjects.values()).filter(s => s.userId === userId);
  }

  getSubject(id: string): Subject | undefined {
    return this.subjects.get(id);
  }

  updateSubject(id: string, data: Partial<Subject>): Subject {
    const subject = this.subjects.get(id);
    if (!subject) throw new Error('Subject not found');
    const updated = { ...subject, ...data, updatedAt: new Date() };
    this.subjects.set(id, updated);
    return updated;
  }

  // Courses
  createCourse(userId: string, subjectId: string, data: Omit<Course, 'id' | 'userId' | 'subjectId' | 'createdAt' | 'updatedAt'>): Course {
    const course: Course = {
      ...data,
      userId,
      subjectId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courses.set(course.id, course);
    return course;
  }

  getCourses(userId: string, subjectId?: string): Course[] {
    return Array.from(this.courses.values()).filter(
      c => c.userId === userId && (!subjectId || c.subjectId === subjectId)
    );
  }

  getCourse(id: string): Course | undefined {
    return this.courses.get(id);
  }

  updateCourse(id: string, data: Partial<Course>): Course {
    const course = this.courses.get(id);
    if (!course) throw new Error('Course not found');
    const updated = { ...course, ...data, updatedAt: new Date() };
    this.courses.set(id, updated);
    return updated;
  }

  // Chapters
  createChapter(userId: string, courseId: string, subjectId: string, data: Omit<Chapter, 'id' | 'userId' | 'courseId' | 'subjectId' | 'createdAt' | 'updatedAt'>): Chapter {
    const chapter: Chapter = {
      ...data,
      userId,
      courseId,
      subjectId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.chapters.set(chapter.id, chapter);
    return chapter;
  }

  getChapters(courseId: string): Chapter[] {
    return Array.from(this.chapters.values()).filter(c => c.courseId === courseId);
  }

  getChapter(id: string): Chapter | undefined {
    return this.chapters.get(id);
  }

  updateChapter(id: string, data: Partial<Chapter>): Chapter {
    const chapter = this.chapters.get(id);
    if (!chapter) throw new Error('Chapter not found');
    const updated = { ...chapter, ...data, updatedAt: new Date() };
    this.chapters.set(id, updated);
    return updated;
  }

  // Topics
  createTopic(userId: string, chapterId: string, courseId: string, subjectId: string, data: Omit<Topic, 'id' | 'userId' | 'chapterId' | 'courseId' | 'subjectId' | 'createdAt' | 'updatedAt'>): Topic {
    const topic: Topic = {
      ...data,
      userId,
      chapterId,
      courseId,
      subjectId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.topics.set(topic.id, topic);
    return topic;
  }

  getTopics(chapterId?: string, subjectId?: string): Topic[] {
    return Array.from(this.topics.values()).filter(
      t => (!chapterId || t.chapterId === chapterId) && (!subjectId || t.subjectId === subjectId)
    );
  }

  getTopic(id: string): Topic | undefined {
    return this.topics.get(id);
  }

  updateTopic(id: string, data: Partial<Topic>): Topic {
    const topic = this.topics.get(id);
    if (!topic) throw new Error('Topic not found');
    const updated = { ...topic, ...data, updatedAt: new Date() };
    this.topics.set(id, updated);
    return updated;
  }

  // Classes
  createClass(userId: string, data: Omit<Class, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Class {
    const cls: Class = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.classes.set(cls.id, cls);
    return cls;
  }

  getClasses(userId: string): Class[] {
    return Array.from(this.classes.values()).filter(c => c.userId === userId);
  }

  getClass(id: string): Class | undefined {
    return this.classes.get(id);
  }

  updateClass(id: string, data: Partial<Class>): Class {
    const cls = this.classes.get(id);
    if (!cls) throw new Error('Class not found');
    const updated = { ...cls, ...data, updatedAt: new Date() };
    this.classes.set(id, updated);
    return updated;
  }

  // Class Sessions
  createClassSession(userId: string, classId: string, data: Omit<ClassSession, 'id' | 'userId' | 'classId' | 'createdAt' | 'updatedAt'>): ClassSession {
    const session: ClassSession = {
      ...data,
      userId,
      classId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.classSessions.set(session.id, session);
    return session;
  }

  getClassSessions(classId: string): ClassSession[] {
    return Array.from(this.classSessions.values()).filter(s => s.classId === classId);
  }

  getClassSession(id: string): ClassSession | undefined {
    return this.classSessions.get(id);
  }

  updateClassSession(id: string, data: Partial<ClassSession>): ClassSession {
    const session = this.classSessions.get(id);
    if (!session) throw new Error('Class session not found');
    const updated = { ...session, ...data, updatedAt: new Date() };
    this.classSessions.set(id, updated);
    return updated;
  }

  // Online Classes
  createOnlineClass(userId: string, data: Omit<OnlineClass, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): OnlineClass {
    const cls: OnlineClass = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.onlineClasses.set(cls.id, cls);
    return cls;
  }

  getOnlineClasses(userId: string): OnlineClass[] {
    return Array.from(this.onlineClasses.values()).filter(c => c.userId === userId);
  }

  getOnlineClass(id: string): OnlineClass | undefined {
    return this.onlineClasses.get(id);
  }

  updateOnlineClass(id: string, data: Partial<OnlineClass>): OnlineClass {
    const cls = this.onlineClasses.get(id);
    if (!cls) throw new Error('Online class not found');
    const updated = { ...cls, ...data, updatedAt: new Date() };
    this.onlineClasses.set(id, updated);
    return updated;
  }

  // Extra Classes
  createExtraClass(userId: string, data: Omit<ExtraClass, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): ExtraClass {
    const cls: ExtraClass = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.extraClasses.set(cls.id, cls);
    return cls;
  }

  getExtraClasses(userId: string): ExtraClass[] {
    return Array.from(this.extraClasses.values()).filter(c => c.userId === userId);
  }

  getExtraClass(id: string): ExtraClass | undefined {
    return this.extraClasses.get(id);
  }

  updateExtraClass(id: string, data: Partial<ExtraClass>): ExtraClass {
    const cls = this.extraClasses.get(id);
    if (!cls) throw new Error('Extra class not found');
    const updated = { ...cls, ...data, updatedAt: new Date() };
    this.extraClasses.set(id, updated);
    return updated;
  }

  // Homework
  createHomework(userId: string, data: Omit<Homework, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Homework {
    const hw: Homework = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.homework.set(hw.id, hw);
    return hw;
  }

  getHomework(userId: string, filters?: { status?: string; classId?: string }): Homework[] {
    return Array.from(this.homework.values()).filter(h => {
      if (h.userId !== userId) return false;
      if (filters?.status && h.status !== filters.status) return false;
      if (filters?.classId && h.classId !== filters.classId) return false;
      return true;
    });
  }

  getHomeworkById(id: string): Homework | undefined {
    return this.homework.get(id);
  }

  updateHomework(id: string, data: Partial<Homework>): Homework {
    const hw = this.homework.get(id);
    if (!hw) throw new Error('Homework not found');
    const updated = { ...hw, ...data, updatedAt: new Date() };
    this.homework.set(id, updated);
    return updated;
  }

  // Study Tasks
  createStudyTask(userId: string, data: Omit<StudyTask, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): StudyTask {
    const task: StudyTask = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.studyTasks.set(task.id, task);
    return task;
  }

  getStudyTasks(userId: string, filters?: { status?: string; topicId?: string }): StudyTask[] {
    return Array.from(this.studyTasks.values()).filter(t => {
      if (t.userId !== userId) return false;
      if (filters?.status && t.status !== filters.status) return false;
      if (filters?.topicId && t.topicId !== filters.topicId) return false;
      return true;
    });
  }

  getStudyTask(id: string): StudyTask | undefined {
    return this.studyTasks.get(id);
  }

  updateStudyTask(id: string, data: Partial<StudyTask>): StudyTask {
    const task = this.studyTasks.get(id);
    if (!task) throw new Error('Study task not found');
    const updated = { ...task, ...data, updatedAt: new Date() };
    this.studyTasks.set(id, updated);
    return updated;
  }

  // Study Sessions
  createStudySession(userId: string, data: Omit<StudySession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): StudySession {
    const session: StudySession = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.studySessions.set(session.id, session);
    return session;
  }

  getStudySessions(userId: string, filters?: { status?: string; topicId?: string }): StudySession[] {
    return Array.from(this.studySessions.values()).filter(s => {
      if (s.userId !== userId) return false;
      if (filters?.status && s.status !== filters.status) return false;
      if (filters?.topicId && s.topicId !== filters.topicId) return false;
      return true;
    });
  }

  getStudySession(id: string): StudySession | undefined {
    return this.studySessions.get(id);
  }

  updateStudySession(id: string, data: Partial<StudySession>): StudySession {
    const session = this.studySessions.get(id);
    if (!session) throw new Error('Study session not found');
    const updated = { ...session, ...data, updatedAt: new Date() };
    this.studySessions.set(id, updated);
    return updated;
  }

  // Exams
  createExam(userId: string, data: Omit<Exam, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Exam {
    const exam: Exam = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.exams.set(exam.id, exam);
    return exam;
  }

  getExams(userId: string, filters?: { subjectId?: string }): Exam[] {
    return Array.from(this.exams.values()).filter(e => {
      if (e.userId !== userId) return false;
      if (filters?.subjectId && e.subjectId !== filters.subjectId) return false;
      return true;
    });
  }

  getExam(id: string): Exam | undefined {
    return this.exams.get(id);
  }

  updateExam(id: string, data: Partial<Exam>): Exam {
    const exam = this.exams.get(id);
    if (!exam) throw new Error('Exam not found');
    const updated = { ...exam, ...data, updatedAt: new Date() };
    this.exams.set(id, updated);
    return updated;
  }

  // Tests
  createTest(userId: string, data: Omit<Test, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Test {
    const test: Test = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tests.set(test.id, test);
    return test;
  }

  getTests(userId: string, filters?: { topicId?: string; subjectId?: string }): Test[] {
    return Array.from(this.tests.values()).filter(t => {
      if (t.userId !== userId) return false;
      if (filters?.topicId && t.topicId !== filters.topicId) return false;
      if (filters?.subjectId && t.subjectId !== filters.subjectId) return false;
      return true;
    });
  }

  getTest(id: string): Test | undefined {
    return this.tests.get(id);
  }

  updateTest(id: string, data: Partial<Test>): Test {
    const test = this.tests.get(id);
    if (!test) throw new Error('Test not found');
    const updated = { ...test, ...data, updatedAt: new Date() };
    this.tests.set(id, updated);
    return updated;
  }

  // Exams & Tests helpers
  getUpcomingExams(userId: string): Exam[] {
    const now = new Date();
    return this.getExams(userId).filter(e => new Date(e.date) > now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Sleep Schedule
  createSleepSchedule(userId: string, data: Omit<SleepSchedule, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): SleepSchedule {
    const schedule: SleepSchedule = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sleepSchedules.set(schedule.id, schedule);
    return schedule;
  }

  getSleepSchedule(userId: string): SleepSchedule | undefined {
    return Array.from(this.sleepSchedules.values()).find(s => s.userId === userId);
  }

  updateSleepSchedule(userId: string, data: Partial<SleepSchedule>): SleepSchedule {
    const existing = this.getSleepSchedule(userId);
    if (!existing) throw new Error('Sleep schedule not found');
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.sleepSchedules.set(existing.id, updated);
    return updated;
  }

  // Exercises
  createExercise(userId: string, data: Omit<Exercise, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Exercise {
    const exercise: Exercise = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.exercises.set(exercise.id, exercise);
    return exercise;
  }

  getExercises(userId: string): Exercise[] {
    return Array.from(this.exercises.values()).filter(e => e.userId === userId);
  }

  getExercise(id: string): Exercise | undefined {
    return this.exercises.get(id);
  }

  updateExercise(id: string, data: Partial<Exercise>): Exercise {
    const exercise = this.exercises.get(id);
    if (!exercise) throw new Error('Exercise not found');
    const updated = { ...exercise, ...data, updatedAt: new Date() };
    this.exercises.set(id, updated);
    return updated;
  }

  // Travel Blocks
  createTravelBlock(userId: string, data: Omit<TravelBlock, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): TravelBlock {
    const block: TravelBlock = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.travelBlocks.set(block.id, block);
    return block;
  }

  getTravelBlocks(userId: string): TravelBlock[] {
    return Array.from(this.travelBlocks.values()).filter(b => b.userId === userId);
  }

  getTravelBlock(id: string): TravelBlock | undefined {
    return this.travelBlocks.get(id);
  }

  updateTravelBlock(id: string, data: Partial<TravelBlock>): TravelBlock {
    const block = this.travelBlocks.get(id);
    if (!block) throw new Error('Travel block not found');
    const updated = { ...block, ...data, updatedAt: new Date() };
    this.travelBlocks.set(id, updated);
    return updated;
  }

  // Activities
  createActivity(userId: string, data: Omit<Activity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Activity {
    const activity: Activity = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.activities.set(activity.id, activity);
    return activity;
  }

  getActivities(userId: string, filters?: { category?: string; isCompleted?: boolean }): Activity[] {
    return Array.from(this.activities.values()).filter(a => {
      if (a.userId !== userId) return false;
      if (filters?.category && a.category !== filters.category) return false;
      if (filters?.isCompleted !== undefined && a.isCompleted !== filters.isCompleted) return false;
      return true;
    });
  }

  getActivity(id: string): Activity | undefined {
    return this.activities.get(id);
  }

  updateActivity(id: string, data: Partial<Activity>): Activity {
    const activity = this.activities.get(id);
    if (!activity) throw new Error('Activity not found');
    const updated = { ...activity, ...data, updatedAt: new Date() };
    this.activities.set(id, updated);
    return updated;
  }

  // Planned Sessions
  createPlannedSession(userId: string, data: Omit<PlannedSession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): PlannedSession {
    const session: PlannedSession = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.plannedSessions.set(session.id, session);
    return session;
  }

  getPlannedSessions(userId: string, date?: Date): PlannedSession[] {
    return Array.from(this.plannedSessions.values()).filter(s => {
      if (s.userId !== userId) return false;
      if (date) {
        const sDate = new Date(s.plannedDate);
        const targetDate = new Date(date);
        if (sDate.toDateString() !== targetDate.toDateString()) return false;
      }
      return true;
    });
  }

  getPlannedSession(id: string): PlannedSession | undefined {
    return this.plannedSessions.get(id);
  }

  updatePlannedSession(id: string, data: Partial<PlannedSession>): PlannedSession {
    const session = this.plannedSessions.get(id);
    if (!session) throw new Error('Planned session not found');
    const updated = { ...session, ...data, updatedAt: new Date() };
    this.plannedSessions.set(id, updated);
    return updated;
  }

  // Daily Plans
  createDailyPlan(userId: string, data: Omit<DailyPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): DailyPlan {
    const plan: DailyPlan = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.dailyPlans.set(plan.id, plan);
    return plan;
  }

  getDailyPlan(userId: string, date: Date): DailyPlan | undefined {
    return Array.from(this.dailyPlans.values()).find(p => {
      if (p.userId !== userId) return false;
      const pDate = new Date(p.date);
      const targetDate = new Date(date);
      return pDate.toDateString() === targetDate.toDateString();
    });
  }

  updateDailyPlan(id: string, data: Partial<DailyPlan>): DailyPlan {
    const plan = this.dailyPlans.get(id);
    if (!plan) throw new Error('Daily plan not found');
    const updated = { ...plan, ...data, updatedAt: new Date() };
    this.dailyPlans.set(id, updated);
    return updated;
  }

  // Goals
  createGoal(userId: string, data: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Goal {
    const goal: Goal = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.goals.set(goal.id, goal);
    return goal;
  }

  getGoals(userId: string, filters?: { type?: string; status?: string }): Goal[] {
    return Array.from(this.goals.values()).filter(g => {
      if (g.userId !== userId) return false;
      if (filters?.type && g.type !== filters.type) return false;
      if (filters?.status && g.status !== filters.status) return false;
      return true;
    });
  }

  getGoal(id: string): Goal | undefined {
    return this.goals.get(id);
  }

  updateGoal(id: string, data: Partial<Goal>): Goal {
    const goal = this.goals.get(id);
    if (!goal) throw new Error('Goal not found');
    const updated = { ...goal, ...data, updatedAt: new Date() };
    this.goals.set(id, updated);
    return updated;
  }

  // Progress
  createProgress(userId: string, data: Omit<Progress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Progress {
    const progress: Progress = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.progress.set(progress.id, progress);
    return progress;
  }

  getProgress(userId: string, topicId?: string): Progress[] {
    return Array.from(this.progress.values()).filter(p => {
      if (p.userId !== userId) return false;
      if (topicId && p.topicId !== topicId) return false;
      return true;
    });
  }

  getProgressByTopic(topicId: string): Progress | undefined {
    return Array.from(this.progress.values()).find(p => p.topicId === topicId);
  }

  updateProgress(id: string, data: Partial<Progress>): Progress {
    const progress = this.progress.get(id);
    if (!progress) throw new Error('Progress not found');
    const updated = { ...progress, ...data, updatedAt: new Date() };
    this.progress.set(id, updated);
    return updated;
  }

  // Energy Logs
  createEnergyLog(userId: string, data: Omit<EnergyLog, 'id' | 'userId' | 'createdAt'>): EnergyLog {
    const log: EnergyLog = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
    };
    this.energyLogs.set(log.id, log);
    return log;
  }

  getEnergyLogs(userId: string, date?: Date): EnergyLog[] {
    return Array.from(this.energyLogs.values()).filter(l => {
      if (l.userId !== userId) return false;
      if (date) {
        const lDate = new Date(l.date);
        const targetDate = new Date(date);
        if (lDate.toDateString() !== targetDate.toDateString()) return false;
      }
      return true;
    });
  }

  // Notifications
  createNotification(userId: string, data: Omit<Notification, 'id' | 'userId' | 'createdAt'>): Notification {
    const notification: Notification = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
    };
    this.notifications.set(notification.id, notification);
    return notification;
  }

  getNotifications(userId: string, filters?: { isRead?: boolean; type?: string }): Notification[] {
    return Array.from(this.notifications.values()).filter(n => {
      if (n.userId !== userId) return false;
      if (filters?.isRead !== undefined && n.isRead !== filters.isRead) return false;
      if (filters?.type && n.type !== filters.type) return false;
      return true;
    });
  }

  getNotification(id: string): Notification | undefined {
    return this.notifications.get(id);
  }

  updateNotification(id: string, data: Partial<Notification>): Notification {
    const notification = this.notifications.get(id);
    if (!notification) throw new Error('Notification not found');
    const updated = { ...notification, ...data };
    this.notifications.set(id, updated);
    return updated;
  }

  // User Preferences
  createUserPreferences(userId: string, data: Omit<UserPreferences, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): UserPreferences {
    const prefs: UserPreferences = {
      ...data,
      userId,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userPreferences.set(prefs.id, prefs);
    return prefs;
  }

  getUserPreferences(userId: string): UserPreferences | undefined {
    return Array.from(this.userPreferences.values()).find(p => p.userId === userId);
  }

  updateUserPreferences(userId: string, data: Partial<UserPreferences>): UserPreferences {
    const existing = this.getUserPreferences(userId);
    if (!existing) throw new Error('User preferences not found');
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.userPreferences.set(existing.id, updated);
    return updated;
  }

  // Seed data
  clear() {
    this.users.clear();
    this.subjects.clear();
    this.courses.clear();
    this.chapters.clear();
    this.topics.clear();
    this.classes.clear();
    this.classSessions.clear();
    this.onlineClasses.clear();
    this.extraClasses.clear();
    this.homework.clear();
    this.studyTasks.clear();
    this.studySessions.clear();
    this.exams.clear();
    this.tests.clear();
    this.timeBlocks.clear();
    this.sleepSchedules.clear();
    this.exercises.clear();
    this.travelBlocks.clear();
    this.activities.clear();
    this.plannedSessions.clear();
    this.dailyPlans.clear();
    this.goals.clear();
    this.progress.clear();
    this.energyLogs.clear();
    this.notifications.clear();
    this.userPreferences.clear();
  }
}

export const db = new Database();
