/**
 * Recommendation Engine Service
 * Generates personalized wellbeing recommendations based on mood patterns
 */

class RecommendationService {
  constructor() {
    this.recommendations = this.loadRecommendations();
  }

  /**
   * Load predefined recommendations database
   */
  loadRecommendations() {
    return {
      high_mood: [
        {
          id: 1,
          title: 'Share Your Happiness',
          description: 'Reach out to friends or colleagues to share positive moments',
          activity: 'social',
          duration: '30 mins'
        },
        {
          id: 2,
          title: 'Creative Expression',
          description: 'Channel your positive energy into creative projects',
          activity: 'creative',
          duration: '1 hour'
        }
      ],
      medium_mood: [
        {
          id: 3,
          title: 'Mindfulness Session',
          description: 'Take a guided meditation to center yourself',
          activity: 'mindfulness',
          duration: '10-20 mins'
        },
        {
          id: 4,
          title: 'Light Exercise',
          description: 'Gentle yoga or stretching to boost energy',
          activity: 'exercise',
          duration: '20 mins'
        }
      ],
      low_mood: [
        {
          id: 5,
          title: 'Speak with Support',
          description: 'Reach out to counseling services or trusted mentor',
          activity: 'support',
          duration: 'As needed'
        },
        {
          id: 6,
          title: 'Self-Care Break',
          description: 'Take time for relaxation and self-care activities',
          activity: 'self-care',
          duration: '30 mins'
        },
        {
          id: 7,
          title: 'Breathing Exercises',
          description: 'Practice grounding techniques to manage stress',
          activity: 'breathing',
          duration: '5-10 mins'
        }
      ]
    };
  }

  /**
   * Get recommendations based on current mood and history
   * @param {number} currentMood - Current mood score (1-10)
   * @param {Array} moodHistory - Past mood entries
   * @param {Object} userContext - User preferences and context
   */
  getRecommendations(currentMood, moodHistory = [], userContext = {}) {
    let category;

    if (currentMood >= 7) {
      category = 'high_mood';
    } else if (currentMood >= 4) {
      category = 'medium_mood';
    } else {
      category = 'low_mood';
    }

    const recs = this.recommendations[category] || [];
    
    // Score and rank recommendations
    const scoredRecs = recs.map(rec => ({
      ...rec,
      score: this.calculateRelevanceScore(rec, currentMood, userContext),
      personalizationNote: this.generatePersonalNote(currentMood, moodHistory)
    }));

    // Sort by score and return top 3
    return scoredRecs.sort((a, b) => b.score - a.score).slice(0, 3);
  }

  /**
   * Calculate relevance score for a recommendation
   */
  calculateRelevanceScore(recommendation, mood, context) {
    let score = Math.random() * 0.3 + 0.7; // Base score 0.7-1.0
    
    // Boost score based on user preferences
    if (context.preferredActivities && context.preferredActivities.includes(recommendation.activity)) {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Generate personalized note explaining the recommendation
   */
  generatePersonalNote(mood, history) {
    if (history.length < 3) {
      return 'Based on your current mood level';
    }

    const recent = history.slice(-7);
    const average = recent.reduce((a, b) => a + b) / recent.length;

    if (mood > average) {
      return 'Great! You\'re feeling better than usual';
    } else if (mood < average) {
      return 'Noticed a dip - let\'s help you feel better';
    }

    return 'Maintaining your wellbeing routine';
  }

  /**
   * Log recommendation feedback
   */
  recordFeedback(recommendationId, helpful, userId) {
    return {
      recommendationId,
      helpful,
      userId,
      timestamp: new Date(),
      logged: true
    };
  }
}

module.exports = new RecommendationService();
