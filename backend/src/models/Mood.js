/**
 * Mood entry data model
 * Stores mood tracking information with context
 */

class Mood {
  constructor(userId, moodScore, context = {}) {
    this.userId = userId;
    this.moodScore = moodScore; // 1-10 scale
    this.timestamp = new Date();
    this.context = {
      activity: context.activity || null,
      location: context.location || null,
      socialInteraction: context.socialInteraction || null,
      notes: context.notes || '',
      ...context
    };
  }

  toJSON() {
    return {
      userId: this.userId,
      moodScore: this.moodScore,
      timestamp: this.timestamp,
      context: this.context
    };
  }

  // Validate mood score is between 1-10
  isValid() {
    return this.moodScore >= 1 && this.moodScore <= 10;
  }
}

module.exports = Mood;
