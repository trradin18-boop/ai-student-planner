import { db } from './database';
import type { Test, Progress } from '../types';

class TestAnalyzer {
  /**
   * Analyze test results and identify weak topics
   */
  analyzeTest(testId: string, userId: string): {
    percentage: number;
    weakTopics: string[];
    strongTopics: string[];
    recommendations: string[];
    nextActions: string[];
  } {
    const test = db.getTest(testId);
    if (!test) throw new Error('Test not found');

    const percentage = test.percentage;
    const correctRate = test.correctAnswers / test.totalQuestions;
    const recommendations: string[] = [];
    const nextActions: string[] = [];

    // Determine performance level
    if (percentage >= 80) {
      recommendations.push('Excellent performance! Keep up the good work.');
      nextActions.push('Move on to next topic');
    } else if (percentage >= 60) {
      recommendations.push('Good progress. Review weak areas before moving forward.');
      nextActions.push('Schedule review session for weak topics');
    } else if (percentage >= 40) {
      recommendations.push('You need more practice. Schedule additional study sessions.');
      nextActions.push('Increase study time for this topic');
      nextActions.push('Practice more problems');
    } else {
      recommendations.push('This topic needs significant review. Consider getting help.');
      nextActions.push('Schedule tutoring session');
      nextActions.push('Review fundamentals');
    }

    // Analyze time per question
    const avgTimePerQuestion = test.averageTimePerQuestion;
    if (avgTimePerQuestion > 180) {
      recommendations.push('You are spending too much time per question. Work on speed.');
      nextActions.push('Practice timed sessions');
    } else if (avgTimePerQuestion < 30) {
      recommendations.push('You might be rushing. Check your answers more carefully.');
      nextActions.push('Slow down and review answers');
    }

    return {
      percentage,
      weakTopics: [],
      strongTopics: [],
      recommendations,
      nextActions,
    };
  }

  /**
   * Update topic mastery based on test results
   */
  updateMastery(topicId: string, testPercentage: number): number {
    const progress = db.getProgressByTopic(topicId);
    let newMastery = testPercentage;

    if (progress) {
      // Weighted average: 70% new test, 30% previous
      newMastery = progress.percentage * 0.3 + testPercentage * 0.7;
      const updated = db.updateProgress(progress.id, { percentage: newMastery });
      return updated.percentage;
    }

    return newMastery;
  }

  /**
   * Calculate test score with configurable penalty
   */
  calculatePercentage(
    correct: number,
    wrong: number,
    blank: number,
    total: number,
    penalty: number = 0.25
  ): number {
    const score = correct - wrong * penalty;
    return Math.max(0, (score / total) * 100);
  }
}

export const testAnalyzer = new TestAnalyzer();
