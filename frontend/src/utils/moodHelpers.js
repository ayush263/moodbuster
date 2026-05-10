/**
 * Utility functions for mood analysis and data transformation
 */

export const moodScaleToLabel = (score) => {
  if (score >= 8) return 'Excellent';
  if (score >= 6) return 'Good';
  if (score >= 4) return 'Neutral';
  if (score >= 2) return 'Challenging';
  return 'Difficult';
};

export const moodScaleToColor = (score) => {
  if (score >= 8) return '#10b981'; // Green
  if (score >= 6) return '#3b82f6'; // Blue
  if (score >= 4) return '#f59e0b'; // Amber
  if (score >= 2) return '#f97316'; // Orange
  return '#ef4444'; // Red
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const calculateMoodTrend = (moodHistory) => {
  if (moodHistory.length < 2) return null;
  
  const recent = moodHistory.slice(-7);
  const previous = moodHistory.slice(-14, -7);
  
  const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
  const previousAvg = previous.reduce((a, b) => a + b) / previous.length;
  
  const change = recentAvg - previousAvg;
  
  if (Math.abs(change) < 0.5) return 'stable';
  return change > 0 ? 'improving' : 'declining';
};

export const prepareChartData = (moodHistory) => {
  return {
    labels: moodHistory.map((_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Mood Score',
        data: moodHistory,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };
};
