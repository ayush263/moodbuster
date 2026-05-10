import React, { useState, useEffect } from 'react';
import { moodService, recommendationService } from '../services/apiService';
import { moodScaleToLabel, moodScaleToColor } from '../utils/moodHelpers';
import ChartWidget from './ChartWidget';
import ParticleBackground from './ParticleBackground';

function Dashboard() {
  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [moodStats, setMoodStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [activeActivity, setActiveActivity] = useState(null);
  const [activityStarted, setActivityStarted] = useState(false);
  const [learnMoreActivity, setLearnMoreActivity] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const moodRes = await moodService.getMoodHistory();
        setMoodHistory(moodRes.data);
        if (moodRes.data.length > 0) {
          setCurrentMood(moodRes.data[moodRes.data.length - 1]);
        }

        const statsRes = await moodService.getMoodStats();
        setMoodStats(statsRes.data);

        const recRes = await recommendationService.getRecommendations();
        setRecommendations(recRes.data);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const getMoodInsight = () => {
    if (!moodStats) return '';
    const { trend, averageMood } = moodStats;
    
    if (trend === 'improving') {
      return `🚀 Your wellbeing is improving! You're averaging ${averageMood}/10. Keep maintaining these positive habits.`;
    } else if (trend === 'declining') {
      return `💙 We noticed a shift. Your average mood is ${averageMood}/10. Consider prioritizing self-care and reaching out to support.`;
    }
    return `⚖️ You're maintaining emotional balance at ${averageMood}/10. Continue your wellness routine.`;
  };

  const getTrendEmoji = () => {
    if (!moodStats) return '─';
    return moodStats.trend === 'improving' ? '📈' : moodStats.trend === 'declining' ? '📉' : '─';
  };

  const handleStartActivity = (activity) => {
    setActiveActivity(activity);
    setActivityStarted(true);
    // Log activity feedback
    recommendationService.submitFeedback(activity.id, true).catch(err => console.error(err));
  };

  const handleLearnMore = (activity) => {
    setLearnMoreActivity(activity);
  };

  const handleCloseLearnMore = () => {
    setLearnMoreActivity(null);
  };

  const handleCloseActivity = () => {
    setActivityStarted(false);
    setTimeout(() => setActiveActivity(null), 300);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Analyzing your emotional landscape...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <ParticleBackground />
      {/* Header Section */}
      <section className="dashboard-header">
        <h2>Your Wellbeing Dashboard</h2>
        <p className="dashboard-subtitle">Personalized insights powered by AI</p>
      </section>

      {/* UI Showcase - flashy widgets to impress */}
      <section className="ui-showcase">
        <div className="showcase-hero">
          <div className="hero-left">
            <h3>Welcome back, explorer ✨</h3>
            <p className="hero-sub">A curated snapshot of your emotional health — live, beautiful, and actionable.</p>
            <div className="hero-actions">
              <button className="btn-ghost">Quick Check</button>
              <button className="btn-primary" onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}>Deep Insights</button>
            </div>
          </div>
          <div className="hero-right">
            <div className="sparkle-grid">
              <div className="spark-card">💡<span>Tips</span></div>
              <div className="spark-card">⏱️<span>Sessions</span></div>
              <div className="spark-card">📅<span>Streak</span></div>
            </div>
          </div>
        </div>

        <div className="showcase-stats">
          <div className="stat-large">
            <div className="stat-head">Mood Momentum</div>
              <div className="stat-chart" aria-hidden>
                <ChartWidget />
              </div>
            <div className="stat-value">+6% <span className="muted">vs last week</span></div>
          </div>
          <div className="stat-small">
            <div className="small-title">Focus Index</div>
            <div className="small-value">78</div>
          </div>
          <div className="stat-small">
            <div className="small-title">Calm Score</div>
            <div className="small-value">82</div>
          </div>
        </div>
      </section>

      {/* Current Mood Card */}
      <section className="mood-overview">
        <h3 className="section-title">Current State</h3>
        {currentMood ? (
          <div className="mood-card-premium" style={{ borderColor: moodScaleToColor(currentMood.moodScore) }}>
            <div className="mood-card-header">
              <div className="mood-circle-large" style={{ backgroundColor: moodScaleToColor(currentMood.moodScore) }}>
                {currentMood.moodScore}
              </div>
              <div className="mood-info">
                <h3 className="mood-label-large">{moodScaleToLabel(currentMood.moodScore)}</h3>
                <p className="mood-timestamp">{new Date(currentMood.timestamp).toLocaleString()}</p>
              </div>
            </div>
            {currentMood.context && (
              <div className="mood-context">
                {currentMood.context.activity && (
                  <span className="context-tag">📌 {currentMood.context.activity}</span>
                )}
                {currentMood.context.location && (
                  <span className="context-tag">📍 {currentMood.context.location}</span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <p>📝 Start tracking your mood to receive personalized insights</p>
          </div>
        )}
      </section>

      {/* Statistics Section */}
      {moodStats && (
        <section className="analytics-section">
          <h3 className="section-title">Your Analytics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <p className="stat-label">Average Mood</p>
                <p className="stat-value">{moodStats.averageMood}/10</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <p className="stat-label">Trend</p>
                <p className="stat-value">{getTrendEmoji()} {moodStats.trend}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <p className="stat-label">Entries</p>
                <p className="stat-value">{moodStats.totalEntries}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <p className="stat-label">Range</p>
                <p className="stat-value">{moodStats.lowestMood} - {moodStats.highestMood}</p>
              </div>
            </div>
          </div>
          <div className="insight-banner">
            <div className="insight-icon">💡</div>
            <div className="insight-text">
              <h4>Insight</h4>
              <p>{getMoodInsight()}</p>
            </div>
          </div>
        </section>
      )}

      {/* Recent History */}
      {moodHistory.length > 1 && (
        <section className="history-section">
          <h3 className="section-title">Recent Entries</h3>
          <div className="history-timeline">
            {moodHistory.slice(-5).reverse().map((mood, idx) => (
              <div key={mood.id} className="timeline-item">
                <div 
                  className="timeline-marker" 
                  style={{ backgroundColor: moodScaleToColor(mood.moodScore) }}
                >
                  {mood.moodScore}
                </div>
                <div className="timeline-content">
                  <p className="timeline-label">{moodScaleToLabel(mood.moodScore)}</p>
                  <p className="timeline-time">{new Date(mood.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations Section */}
      <section className="recommendations-section">
        <h3 className="section-title">Personalized Recommendations</h3>
        <p className="recommendations-subtitle">Based on your emotional patterns and preferences</p>
        <div className="recommendations-grid">
          {recommendations.map((rec) => (
            <div 
              key={rec.id} 
              className={`recommendation-card-advanced ${selectedRecommendation?.id === rec.id ? 'active' : ''}`}
              onClick={() => setSelectedRecommendation(selectedRecommendation?.id === rec.id ? null : rec)}
            >
              <div className="rec-header">
                <div className="rec-icon">{rec.icon}</div>
                <div className="rec-meta">
                  <h4>{rec.title}</h4>
                  <span className="rec-duration">⏱️ {rec.duration}</span>
                </div>
              </div>
              <p className="rec-description">{rec.description}</p>
              <div className="rec-footer">
                <span className="rec-category">{rec.category}</span>
                <span className={`rec-score score-${Math.floor(rec.score / 20)}`}>
                  {rec.score}% match
                </span>
              </div>
              {selectedRecommendation?.id === rec.id && (
                <div className="rec-expanded">
                  <button 
                    className="start-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartActivity(rec);
                    }}
                  >
                    ▶ Start Activity
                  </button>
                  <button 
                    className="learn-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLearnMore(rec);
                    }}
                  >
                    Learn More
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="action-card log-mood">
          <div className="action-icon">📝</div>
          <h4>Log Mood</h4>
          <p>Check in with yourself</p>
        </div>
        <div className="action-card explore">
          <div className="action-icon">🔍</div>
          <h4>Explore</h4>
          <p>Discover more activities</p>
        </div>
        <div className="action-card insights">
          <div className="action-icon">📚</div>
          <h4>Learn</h4>
          <p>Mental wellness guides</p>
        </div>
      </section>

      {/* Activity Modal */}
      {activeActivity && (
        <div className={`activity-modal ${activityStarted ? 'active' : ''}`}>
          <div className="activity-overlay" onClick={handleCloseActivity}></div>
          <div className="activity-panel">
            <button className="close-btn" onClick={handleCloseActivity}>✕</button>
            
            <div className="activity-header">
              <div className="activity-icon-large">{activeActivity.icon}</div>
              <h2>{activeActivity.title}</h2>
            </div>

            <div className="activity-content">
              <div className="activity-info-card">
                <h3>📋 About This Activity</h3>
                <p>{activeActivity.description}</p>
              </div>

              <div className="activity-details-grid">
                <div className="detail-item">
                  <span className="detail-icon">⏱️</span>
                  <div>
                    <p className="detail-label">Duration</p>
                    <p className="detail-value">{activeActivity.duration}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🏷️</span>
                  <div>
                    <p className="detail-label">Category</p>
                    <p className="detail-value">{activeActivity.category}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">⭐</span>
                  <div>
                    <p className="detail-label">Relevance</p>
                    <p className="detail-value">{activeActivity.score}% match</p>
                  </div>
                </div>
              </div>

              <div className="activity-tips">
                <h3>💡 Tips for Success</h3>
                <ul>
                  <li>Find a quiet, comfortable space</li>
                  <li>Minimize distractions</li>
                  <li>Set a timer for {activeActivity.duration}</li>
                  <li>Be present and mindful</li>
                  <li>Log your mood afterward to track progress</li>
                </ul>
              </div>

              <div className="activity-actions">
                <button className="btn-complete" onClick={handleCloseActivity}>
                  ✓ I've Completed This
                </button>
                <button className="btn-skip" onClick={handleCloseActivity}>
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learn More Modal */}
      {learnMoreActivity && (
        <div className="learn-more-modal">
          <div className="learn-overlay" onClick={handleCloseLearnMore}></div>
          <div className="learn-panel">
            <button className="learn-close-btn" onClick={handleCloseLearnMore}>✕</button>
            
            <div className="learn-header">
              <div className="learn-icon-large">{learnMoreActivity.icon}</div>
              <h2>{learnMoreActivity.title}</h2>
            </div>

            <div className="learn-content">
              <div className="learn-section">
                <h3>📖 About This Activity</h3>
                <p>{learnMoreActivity.description}</p>
              </div>

              <div className="learn-meta-grid">
                <div className="learn-meta-item">
                  <span className="learn-meta-icon">⏱️</span>
                  <div>
                    <p className="learn-meta-label">Duration</p>
                    <p className="learn-meta-value">{learnMoreActivity.duration}</p>
                  </div>
                </div>
                <div className="learn-meta-item">
                  <span className="learn-meta-icon">🏷️</span>
                  <div>
                    <p className="learn-meta-label">Category</p>
                    <p className="learn-meta-value">{learnMoreActivity.category}</p>
                  </div>
                </div>
                <div className="learn-meta-item">
                  <span className="learn-meta-icon">⭐</span>
                  <div>
                    <p className="learn-meta-label">Match Score</p>
                    <p className="learn-meta-value">{learnMoreActivity.score}%</p>
                  </div>
                </div>
              </div>

              <div className="learn-benefits">
                <h3>✨ Benefits of This Activity</h3>
                <ul>
                  <li>Personalized based on your mood patterns</li>
                  <li>Scientifically proven to boost wellbeing</li>
                  <li>Can be done anywhere, anytime</li>
                  <li>Recommended specifically for your needs</li>
                  <li>Part of comprehensive mental health care</li>
                </ul>
              </div>

              <div className="learn-recommendation">
                <h3>💡 Why This Is Recommended</h3>
                <p>This activity has been tailored specifically for you based on your recent mood entries, emotional patterns, and wellness goals. It's designed to help you manage stress, improve focus, or enhance your overall mental wellbeing depending on your current state.</p>
              </div>

              <div className="learn-actions">
                <button className="btn-learn-start" onClick={() => {
                  handleCloseLearnMore();
                  handleStartActivity(learnMoreActivity);
                }}>
                  ▶ Start Now
                </button>
                <button className="btn-learn-close" onClick={handleCloseLearnMore}>
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
