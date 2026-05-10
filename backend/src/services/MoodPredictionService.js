/**
 * Mood Prediction Service
 * Uses TensorFlow.js to predict future mood states based on historical data
 */

const tf = require('@tensorflow/tfjs');

class MoodPredictionService {
  constructor() {
    this.model = null;
    this.inputShape = [30]; // 30 previous mood entries
  }

  /**
   * Create a simple LSTM model for mood prediction
   */
  buildModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.lstm({
          units: 64,
          inputShape: [this.inputShape[0], 1],
          returnSequences: true
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.lstm({ units: 32, returnSequences: false }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    return model;
  }

  /**
   * Train model with mood history
   * @param {Array} moodHistory - Array of mood scores
   */
  async train(moodHistory) {
    if (moodHistory.length < this.inputShape[0]) {
      console.warn('Not enough data for training');
      return null;
    }

    const xs = tf.tensor3d([moodHistory.slice(0, -1)], [1, this.inputShape[0], 1]);
    const ys = tf.tensor2d([[moodHistory[moodHistory.length - 1] / 10]], [1, 1]);

    this.model = this.buildModel();

    await this.model.fit(xs, ys, {
      epochs: 50,
      batchSize: 1,
      verbose: 0
    });

    xs.dispose();
    ys.dispose();

    return this.model;
  }

  /**
   * Predict next mood score
   * @param {Array} recentMoods - Recent mood entries
   * @returns {Object} Prediction with score and confidence
   */
  async predict(recentMoods) {
    if (!this.model) {
      throw new Error('Model not trained');
    }

    if (recentMoods.length < this.inputShape[0]) {
      return { score: null, confidence: 0, reason: 'Insufficient data' };
    }

    const input = tf.tensor3d([recentMoods.slice(-30)], [1, 30, 1]);
    const prediction = this.model.predict(input);
    const score = (await prediction.data())[0] * 10;

    input.dispose();
    prediction.dispose();

    return {
      score: Math.round(score * 10) / 10,
      confidence: 0.75, // Placeholder confidence
      timestamp: new Date()
    };
  }

  /**
   * Detect mood trends
   */
  detectTrend(moodHistory) {
    if (moodHistory.length < 2) return null;

    const recent = moodHistory.slice(-7);
    const older = moodHistory.slice(-14, -7);

    const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b) / older.length;

    const change = recentAvg - olderAvg;

    if (Math.abs(change) < 0.5) return 'stable';
    return change > 0 ? 'improving' : 'declining';
  }
}

module.exports = new MoodPredictionService();
