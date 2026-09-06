import { db } from './database';
import type { PlannedSession, DailyPlan, StudyTask, Homework, Exam, Topic, ClassSession, ExtraClass } from '../types';
import { addDays, startOfDay, endOfDay, addMinutes, differenceInMinutes, isAfter, isBefore, parseISO } from 'date-fns';

interface ScheduleSlot {
  startTime: Date;
  endTime: Date;
  duration: number;
  available: boolean;
  reason?: string;
}

interface TaskScore {
  taskId: string;
  score: number;
  reason: string;
}

class PlannerEngine {
  /**
   * Calculate priority score for a task
   * Higher score = higher priority
   */
  private calculateTaskScore(
    task: StudyTask | Homework,
    upcomingExams: Exam[],
    topicMastery: Map<string, number>
  ): number {
    let score = 0;

    // 1. Urgency (Deadline proximity) - Max 40 points
    if (task.deadline) {
      const daysUntilDeadline = differenceInMinutes(new Date(task.deadline), new Date()) / (60 * 24);
      if (daysUntilDeadline <= 1) score += 40; // Due tomorrow or today
      else if (daysUntilDeadline <= 3) score += 30;
      else if (daysUntilDeadline <= 7) score += 20;
      else score += 10;
    }

    // 2. Importance/Priority - Max 25 points
    if (task.priority === 'high') score += 25;
    else if (task.priority === 'medium') score += 15;
    else score += 5;

    // 3. Difficulty - Max 20 points (harder topics need more prep)
    if (task.difficulty === 'hard') score += 20;
    else if (task.difficulty === 'medium') score += 10;
    else score += 5;

    // 4. Exam proximity - Max 15 points
    if (upcomingExams.length > 0) {
      const nearestExam = upcomingExams[0];
      const daysUntilExam = differenceInMinutes(new Date(nearestExam.date), new Date()) / (60 * 24);
      if (daysUntilExam <= 3) score += 15;
      else if (daysUntilExam <= 7) score += 10;
      else score += 5;
    }

    // 5. Topic weakness - Max 10 points (weak topics need more attention)
    if ('topicId' in task && task.topicId) {
      const mastery = topicMastery.get(task.topicId) || 0;
      if (mastery < 40) score += 10;
      else if (mastery < 60) score += 5;
    }

    return score;
  }

  /**
   * Get all fixed time blocks for a given day
   * These cannot be moved - school, classes, exams, sleep
   */
  private getFixedTimeBlocks(userId: string, date: Date): ScheduleSlot[] {
    const slots: ScheduleSlot[] = [];
    const dayOfWeek = date.getDay();

    // 1. School time
    const schoolSchedules = this.getSchoolScheduleForDay(userId, dayOfWeek);
    schoolSchedules.forEach(schedule => {
      const [startHour, startMin] = schedule.startTime.split(':').map(Number);
      const [endHour, endMin] = schedule.endTime.split(':').map(Number);
      const startTime = new Date(date);
      startTime.setHours(startHour, startMin, 0);
      const endTime = new Date(date);
      endTime.setHours(endHour, endMin, 0);
      slots.push({
        startTime,
        endTime,
        duration: differenceInMinutes(endTime, startTime),
        available: false,
        reason: 'School',
      });
    });

    // 2. Classes
    const classes = this.getClassesForDay(userId, dayOfWeek);
    classes.forEach(cls => {
      const [startHour, startMin] = cls.startTime.split(':').map(Number);
      const [endHour, endMin] = cls.endTime.split(':').map(Number);
      const startTime = new Date(date);
      startTime.setHours(startHour, startMin, 0);
      const endTime = new Date(date);
      endTime.setHours(endHour, endMin, 0);
      slots.push({
        startTime,
        endTime,
        duration: differenceInMinutes(endTime, startTime),
        available: false,
        reason: `Class: ${cls.name}`,
      });
    });

    // 3. Online Classes
    const onlineClasses = this.getOnlineClassesForDay(userId, dayOfWeek);
    onlineClasses.forEach(cls => {
      const [startHour, startMin] = cls.startTime.split(':').map(Number);
      const [endHour, endMin] = cls.endTime.split(':').map(Number);
      const startTime = new Date(date);
      startTime.setHours(startHour, startMin, 0);
      const endTime = new Date(date);
      endTime.setHours(endHour, endMin, 0);
      slots.push({
        startTime,
        endTime,
        duration: differenceInMinutes(endTime, startTime),
        available: false,
        reason: `Online Class: ${cls.name}`,
      });
    });

    // 4. Extra classes
    const extraClasses = this.getExtraClassesForDay(userId, dayOfWeek);
    extraClasses.forEach(cls => {
      const [startHour, startMin] = cls.startTime.split(':').map(Number);
      const [endHour, endMin] = cls.endTime.split(':').map(Number);
      const startTime = new Date(date);
      startTime.setHours(startHour, startMin, 0);
      const endTime = new Date(date);
      endTime.setHours(endHour, endMin, 0);
      slots.push({
        startTime,
        endTime,
        duration: differenceInMinutes(endTime, startTime),
        available: false,
        reason: `${cls.category}: ${cls.name}`,
      });
    });

    // 5. Exams
    const exams = db.getExams(userId);
    exams.forEach(exam => {
      const examDate = new Date(exam.date);
      if (examDate.toDateString() === date.toDateString()) {
        const [startHour, startMin] = exam.startTime.split(':').map(Number);
        const [endHour, endMin] = exam.endTime.split(':').map(Number);
        const startTime = new Date(date);
        startTime.setHours(startHour, startMin, 0);
        const endTime = new Date(date);
        endTime.setHours(endHour, endMin, 0);
        slots.push({
          startTime,
          endTime,
          duration: differenceInMinutes(endTime, startTime),
          available: false,
          reason: `Exam: ${exam.name}`,
        });
      }
    });

    // 6. Sleep
    const sleepSchedule = db.getSleepSchedule(userId);
    if (sleepSchedule) {
      const [bedHour, bedMin] = sleepSchedule.targetBedtime.split(':').map(Number);
      const [wakeHour, wakeMin] = sleepSchedule.targetWakeTime.split(':').map(Number);
      let bedTime = new Date(date);
      bedTime.setHours(bedHour, bedMin, 0);
      let wakeTime = new Date(date);
      wakeTime.setHours(wakeHour, wakeMin, 0);

      // Handle case where sleep crosses midnight
      if (isBefore(wakeTime, bedTime)) {
        wakeTime = addDays(wakeTime, 1);
      }

      if (isBefore(bedTime, wakeTime)) {
        slots.push({
          startTime: bedTime,
          endTime: wakeTime,
          duration: differenceInMinutes(wakeTime, bedTime),
          available: false,
          reason: 'Sleep',
        });
      }
    }

    // 7. Exercises
    const exercises = db.getExercises(userId);
    exercises.forEach(exercise => {
      if (exercise.dayOfWeek === dayOfWeek) {
        const [startHour, startMin] = exercise.startTime.split(':').map(Number);
        const startTime = new Date(date);
        startTime.setHours(startHour, startMin, 0);
        const endTime = addMinutes(startTime, exercise.duration);
        slots.push({
          startTime,
          endTime,
          duration: exercise.duration,
          available: false,
          reason: `Exercise: ${exercise.type}`,
        });
      }
    });

    // 8. Travel blocks
    const travelBlocks = db.getTravelBlocks(userId);
    travelBlocks.forEach(travel => {
      if (!travel.dayOfWeek || travel.dayOfWeek === dayOfWeek) {
        const [startHour, startMin] = travel.startTime.split(':').map(Number);
        const startTime = new Date(date);
        startTime.setHours(startHour, startMin, 0);
        const endTime = addMinutes(startTime, travel.duration);
        slots.push({
          startTime,
          endTime,
          duration: travel.duration,
          available: false,
          reason: `Travel: ${travel.fromLocation} → ${travel.toLocation}`,
        });
      }
    });

    return slots.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  /**
   * Find available time slots between fixed blocks
   */
  private findAvailableSlots(userId: string, date: Date, minDuration: number = 30): ScheduleSlot[] {
    const dayStart = startOfDay(date);
    dayStart.setHours(6, 0, 0); // Start from 6 AM
    const dayEnd = endOfDay(date);
    dayEnd.setHours(23, 59, 59); // End at 11:59 PM

    const fixedBlocks = this.getFixedTimeBlocks(userId, date);
    const availableSlots: ScheduleSlot[] = [];

    let currentTime = dayStart;

    for (const block of fixedBlocks) {
      if (isBefore(currentTime, block.startTime)) {
        const gap = differenceInMinutes(block.startTime, currentTime);
        if (gap >= minDuration) {
          availableSlots.push({
            startTime: currentTime,
            endTime: block.startTime,
            duration: gap,
            available: true,
          });
        }
      }
      currentTime = block.endTime;
    }

    // Add remaining time until end of day
    if (isBefore(currentTime, dayEnd)) {
      const gap = differenceInMinutes(dayEnd, currentTime);
      if (gap >= minDuration) {
        availableSlots.push({
          startTime: currentTime,
          endTime: dayEnd,
          duration: gap,
          available: true,
        });
      }
    }

    return availableSlots;
  }

  /**
   * Get school schedule for a specific day
   */
  private getSchoolScheduleForDay(userId: string, dayOfWeek: number) {
    return db.getSchoolSchedules?.(userId)?.filter(s => s.dayOfWeek === dayOfWeek) || [];
  }

  /**
   * Get classes for a specific day
   */
  private getClassesForDay(userId: string, dayOfWeek: number) {
    const classes = db.getClasses(userId);
    const sessions = db.getClassSessions?.()
      ?.filter(s => s.userId === userId && s.dayOfWeek === dayOfWeek) || [];
    return sessions.map(s => ({
      name: classes.find(c => c.id === s.classId)?.name || 'Unknown',
      startTime: s.startTime,
      endTime: s.endTime,
    }));
  }

  /**
   * Get online classes for a specific day
   */
  private getOnlineClassesForDay(userId: string, dayOfWeek: number) {
    const onlineClasses = db.getOnlineClasses(userId);
    const sessions = onlineClasses
      .flatMap(cls => cls.sessionSchedules?.filter(s => s.dayOfWeek === dayOfWeek) || [])
      .map(s => ({ name: 'Online Class', startTime: s.startTime, endTime: s.endTime }));
    return sessions;
  }

  /**
   * Get extra classes for a specific day
   */
  private getExtraClassesForDay(userId: string, dayOfWeek: number) {
    return db.getExtraClasses(userId).filter(cls => cls.dayOfWeek === dayOfWeek);
  }

  /**
   * Check for scheduling conflicts
   */
  checkConflicts(userId: string, startTime: Date, endTime: Date, excludeId?: string): string[] {
    const conflicts: string[] = [];
    const dayOfWeek = startTime.getDay();
    const fixedBlocks = this.getFixedTimeBlocks(userId, startTime);

    fixedBlocks.forEach(block => {
      // Check if there's overlap
      if (isAfter(startTime, block.startTime) && isBefore(startTime, block.endTime)) {
        conflicts.push(`Conflict with: ${block.reason}`);
      }
      if (isAfter(endTime, block.startTime) && isBefore(endTime, block.endTime)) {
        conflicts.push(`Conflict with: ${block.reason}`);
      }
      if (isBefore(startTime, block.startTime) && isAfter(endTime, block.endTime)) {
        conflicts.push(`Overlap with: ${block.reason}`);
      }
    });

    return conflicts;
  }

  /**
   * Main planning algorithm - Generate optimal schedule for a day
   */
  planDay(userId: string, date: Date): DailyPlan {
    const dayStart = startOfDay(date);

    // 1. Get all pending tasks and homework
    const pendingTasks = db.getStudyTasks(userId, { status: 'pending' });
    const pendingHomework = db.getHomework(userId, { status: 'pending' });
    const allTasks = [...pendingTasks, ...pendingHomework];

    // Filter tasks that should be done today (deadline today or urgent)
    const tasksForToday = allTasks.filter(task => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      const daysUntilDeadline = differenceInMinutes(taskDate, dayStart) / (60 * 24);
      return daysUntilDeadline <= 1 || daysUntilDeadline > 0;
    });

    // 2. Get upcoming exams
    const upcomingExams = db.getUpcomingExams(userId);

    // 3. Build topic mastery map
    const topicMastery = new Map<string, number>();
    db.getProgress(userId).forEach(progress => {
      if (progress.topicId) {
        topicMastery.set(progress.topicId, progress.percentage);
      }
    });

    // 4. Score and sort tasks
    const scoredTasks = tasksForToday.map(task => ({
      task,
      score: this.calculateTaskScore(task, upcomingExams, topicMastery),
    }));
    scoredTasks.sort((a, b) => b.score - a.score);

    // 5. Get available time slots
    const availableSlots = this.findAvailableSlots(userId, date, 30);

    // 6. Allocate tasks to slots
    const plannedSessions: PlannedSession[] = [];
    let slotIndex = 0;
    let totalPlannedHours = 0;

    for (const { task, score } of scoredTasks) {
      let remainingDuration = task.estimatedTime;

      while (remainingDuration > 0 && slotIndex < availableSlots.length) {
        const slot = availableSlots[slotIndex];
        const sessionDuration = Math.min(remainingDuration, Math.min(slot.duration, 120)); // Max 2 hours per session

        const plannedSession = db.createPlannedSession(userId, {
          studySessionId: 'taskId' in task ? undefined : task.id,
          taskId: 'homeworkId' in task ? undefined : task.id,
          homeworkId: 'homeworkId' in task ? task.id : undefined,
          plannedDate: date,
          startTime: slot.startTime.toTimeString().slice(0, 5),
          endTime: addMinutes(slot.startTime, sessionDuration).toTimeString().slice(0, 5),
          duration: sessionDuration,
          priority: score,
          reason: `Task: ${task.title}`,
          status: 'scheduled',
        });

        plannedSessions.push(plannedSession);
        totalPlannedHours += sessionDuration / 60;
        remainingDuration -= sessionDuration;
        slot.duration -= sessionDuration;

        if (slot.duration < 30) {
          slotIndex++;
        }
      }
    }

    // 7. Get sleep schedule for available hours calculation
    const sleepSchedule = db.getSleepSchedule(userId);
    const totalAvailableHours = availableSlots.reduce((sum, slot) => sum + slot.duration, 0) / 60;

    // 8. Detect conflicts
    const conflicts: string[] = [];
    const conflictDetected = false; // Simplified for now

    // 9. Create daily plan
    const dailyPlan = db.createDailyPlan(userId, {
      date,
      plannedSessions,
      totalPlannedHours,
      totalAvailableHours,
      conflictDetected,
      conflicts: conflicts.length > 0 ? conflicts : undefined,
      version: 1,
      isOptimized: true,
    });

    return dailyPlan;
  }

  /**
   * Replan when something changes
   */
  replan(userId: string, date: Date, reason: string): DailyPlan {
    const existingPlan = db.getDailyPlan(userId, date);
    if (existingPlan) {
      // Delete old planned sessions
      existingPlan.plannedSessions?.forEach(session => {
        // Note: We'd need a delete method in DB for full implementation
      });
    }

    // Generate new plan
    return this.planDay(userId, date);
  }

  /**
   * Get recommended focus duration based on energy and task difficulty
   */
  getRecommendedSessionDuration(
    taskDifficulty: 'easy' | 'medium' | 'hard',
    currentEnergy: 'low' | 'medium' | 'high'
  ): number {
    const baseLength = {
      easy: 45,
      medium: 60,
      hard: 90,
    };

    const energyMultiplier = {
      low: 0.5,
      medium: 1,
      high: 1.2,
    };

    return Math.round(baseLength[taskDifficulty] * energyMultiplier[currentEnergy]);
  }

  /**
   * Calculate spaced repetition date
   */
  calculateNextReviewDate(lastReviewDate: Date, mastery: number, difficulty: 'easy' | 'medium' | 'hard'): Date {
    const baseDays = {
      easy: 7,
      medium: 5,
      hard: 2,
    };

    const masteryMultiplier = mastery > 80 ? 1.5 : mastery > 60 ? 1 : 0.5;
    const daysUntilReview = Math.round(baseDays[difficulty] * masteryMultiplier);

    return addDays(lastReviewDate, daysUntilReview);
  }
}

export const plannerEngine = new PlannerEngine();
