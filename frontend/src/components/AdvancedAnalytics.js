import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock, AlertCircle, Zap } from 'lucide-react';
import '../styles/AdvancedAnalytics.css';

const AdvancedAnalytics = ({ moodData, timeRange = '7days' }) => {
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    if (moodData) {
      generateAnalytics();
    }
  }, [moodData, timeRange]);

  const generateAnalytics = () => {
    const moodEntries = moodData || [];
    
    // Calculate peak moods by hour
    const hourlyData = {};
    moodEntries.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      if (!hourlyData[hour]) hourlyData[hour] = [];
      hourlyData[hour].push(entry.moodScore);
    });

    const peakHours = Object.keys(hourlyData).map(hour => ({
      hour: `${hour}:00`,
      average: (hourlyData[hour].reduce((a, b) => a + b) / hourlyData[hour].length).toFixed(1),
      count: hourlyData[hour].length
    }));

    // Mood distribution
    const moodCounts = { very_low: 0, low: 0, neutral: 0, high: 0, very_high: 0 };
    moodEntries.forEach(entry => {
      const score = entry.moodScore;
      if (score <= 2) moodCounts.very_low++;
      else if (score <= 4) moodCounts.low++;
      else if (score <= 6) moodCounts.neutral++;
      else if (score <= 8) moodCounts.high++;
      else moodCounts.very_high++;
    });

    const moodDistribution = [
      { name: 'Very Low', value: moodCounts.very_low, color: '#ef4444' },
      { name: 'Low', value: moodCounts.low, color: '#f97316' },
      { name: 'Neutral', value: moodCounts.neutral, color: '#eab308' },
      { name: 'High', value: moodCounts.high, color: '#84cc16' },
      { name: 'Very High', value: moodCounts.very_high, color: '#22c55e' }
    ];

    // Calculate trends
    const avgMood = (moodEntries.reduce((sum, m) => sum + m.moodScore, 0) / moodEntries.length).toFixed(1);
    const highestMood = Math.max(...moodEntries.map(m => m.moodScore));
    const lowestMood = Math.min(...moodEntries.map(m => m.moodScore));
    const volatility = ((highestMood - lowestMood) / 10 * 100).toFixed(1);

    setAnalyticsData({
      peakHours,
      moodDistribution,
      metrics: {
        avgMood,
        highestMood,
        lowestMood,
        volatility,
        totalEntries: moodEntries.length
      }
    });
  };

  if (!analyticsData) return <div className="analytics-loading">Loading analytics...</div>;

  const { peakHours, moodDistribution, metrics } = analyticsData;

  return (
    <div className="advanced-analytics">
      <h2>📊 Advanced Analytics</h2>
      
      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon mood">📊</div>
          <div className="metric-content">
            <p className="metric-label">Average Mood</p>
            <p className="metric-value">{metrics.avgMood}/10</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon high">⬆️</div>
          <div className="metric-content">
            <p className="metric-label">Highest Mood</p>
            <p className="metric-value">{metrics.highestMood}/10</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon low">⬇️</div>
          <div className="metric-content">
            <p className="metric-label">Lowest Mood</p>
            <p className="metric-value">{metrics.lowestMood}/10</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon volatility">⚡</div>
          <div className="metric-content">
            <p className="metric-label">Mood Volatility</p>
            <p className="metric-value">{metrics.volatility}%</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        {/* Peak Hours Chart */}
        <div className="chart-section">
          <h3>🕐 Peak Hours Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="average" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mood Distribution Pie */}
        <div className="chart-section">
          <h3>🎯 Mood Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={moodDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {moodDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend">
            {moodDistribution.map((item, index) => (
              <div key={index} className="legend-item">
                <span 
                  className="legend-color" 
                  style={{ backgroundColor: item.color }}
                ></span>
                <span>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="insights-section">
        <h3>💡 AI-Powered Insights</h3>
        <div className="insight-cards">
          {metrics.volatility > 50 && (
            <div className="insight-card warning">
              <AlertCircle size={20} />
              <div>
                <p className="insight-title">High Mood Volatility</p>
                <p className="insight-desc">Your mood fluctuates significantly. Consider stress management techniques.</p>
              </div>
            </div>
          )}
          {metrics.avgMood < 5 && (
            <div className="insight-card alert">
              <TrendingDown size={20} />
              <div>
                <p className="insight-title">Low Mood Trend</p>
                <p className="insight-desc">Your average mood is below 5. Consider reaching out to support.</p>
              </div>
            </div>
          )}
          {metrics.avgMood > 7 && (
            <div className="insight-card success">
              <TrendingUp size={20} />
              <div>
                <p className="insight-title">Positive Wellbeing</p>
                <p className="insight-desc">Great job! Your mood is consistently positive. Keep it up!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
