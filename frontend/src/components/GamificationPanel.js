import React, { useState, useEffect } from 'react';
import { Zap, Award, Trophy, Flame, Target, Gift } from 'lucide-react';
import '../styles/GamificationPanel.css';

const GamificationPanel = ({ moodData = [], userName = 'User' }) => {
  const [achievements, setAchievements] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    calculateAchievements();
  }, [moodData]);

  const calculateAchievements = () => {
    let points = 0;
    let streak = 0;
    const earnedBadges = [];

    if (!moodData || moodData.length === 0) return;

    // Sort by date descending
    const sortedData = [...moodData].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Calculate streak
    const today = new Date();
    let checkDate = new Date(today);
    checkDate.setHours(0, 0, 0, 0);

    for (const entry of sortedData) {
      const entryDate = new Date(entry.timestamp);
      entryDate.setHours(0, 0, 0, 0);

      if (entryDate.getTime() === checkDate.getTime()) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Award points based on mood entries
    points += moodData.length * 10; // 10 points per entry

    // Track badges earned
    const badges = [
      {
        id: 'first-entry',
        name: '🎯 First Step',
        description: 'Log your first mood entry',
        earned: moodData.length >= 1
      },
      {
        id: 'week-warrior',
        name: '🔥 Week Warrior',
        description: 'Keep a 7-day streak',
        earned: streak >= 7
      },
      {
        id: 'month-master',
        name: '👑 Month Master',
        description: 'Keep a 30-day streak',
        earned: streak >= 30
      },
      {
        id: 'mood-enthusiast',
        name: '💚 Mood Enthusiast',
        description: 'Log 50 mood entries',
        earned: moodData.length >= 50
      },
      {
        id: 'consistency-king',
        name: '⭐ Consistency King',
        description: 'Log 100 mood entries',
        earned: moodData.length >= 100
      },
      {
        id: 'positive-vibes',
        name: '✨ Positive Vibes',
        description: 'Maintain average mood > 7 for a week',
        earned: checkAveragePositiveMood(moodData, 7) > 7
      },
      {
        id: 'resilience',
        name: '💪 Resilience',
        description: 'Log daily entries for 14 consecutive days',
        earned: streak >= 14
      },
      {
        id: 'mindful-master',
        name: '🧘 Mindful Master',
        description: 'Complete mindfulness recommendations 10 times',
        earned: countRecommendations(moodData, 'mindfulness') >= 10
      }
    ];

    // Calculate level
    const calculatedLevel = Math.floor(points / 100) + 1;

    // Add points for streaks
    if (streak >= 7) points += 50;
    if (streak >= 30) points += 200;

    badges.forEach(badge => {
      if (badge.earned && !earnedBadges.find(b => b.id === badge.id)) {
        earnedBadges.push(badge);
        points += 100; // Bonus points for achievement
      }
    });

    setCurrentStreak(streak);
    setTotalPoints(points);
    setAchievements(badges.filter(b => b.earned));
    setLevel(calculatedLevel);
  };

  const checkAveragePositiveMood = (data, days) => {
    if (data.length === 0) return 0;
    const recentData = data.slice(-days);
    return recentData.reduce((sum, m) => sum + m.moodScore, 0) / recentData.length;
  };

  const countRecommendations = (data, type) => {
    return data.filter(d => d.activityType === type).length;
  };

  return (
    <div className="gamification-panel">
      <h3>🏆 Your Achievements & Progress</h3>

      {/* Level & Points */}
      <div className="progress-section">
        <div className="level-card">
          <div className="level-display">
            <div className="level-number">{level}</div>
            <div className="level-label">Level</div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{
              width: `${((totalPoints % 100) / 100) * 100}%`
            }}></div>
          </div>
          <div className="points-text">{totalPoints % 100}/100 to next level</div>
        </div>

        <div className="streak-card">
          <Flame size={32} className="streak-icon" />
          <div className="streak-content">
            <div className="streak-number">{currentStreak}</div>
            <div className="streak-label">Day Streak</div>
          </div>
        </div>

        <div className="points-card">
          <Zap size={32} className="points-icon" />
          <div className="points-content">
            <div className="points-number">{totalPoints}</div>
            <div className="points-label">Total Points</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="badges-section">
        <h4>🎖️ Unlocked Badges ({achievements.length})</h4>
        <div className="badges-grid">
          {achievements.map(badge => (
            <div key={badge.id} className="badge earned" title={badge.description}>
              <div className="badge-icon">{badge.name.split(' ')[0]}</div>
              <div className="badge-info">
                <div className="badge-name">{badge.name}</div>
                <div className="badge-desc">{badge.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Badges */}
      <div className="all-badges-section">
        <h4>🎯 All Available Badges</h4>
        <div className="badges-grid">
          {[
            { id: 'first-entry', name: '🎯 First Step', description: 'Log your first mood entry' },
            { id: 'week-warrior', name: '🔥 Week Warrior', description: 'Keep a 7-day streak' },
            { id: 'month-master', name: '👑 Month Master', description: 'Keep a 30-day streak' },
            { id: 'mood-enthusiast', name: '💚 Mood Enthusiast', description: 'Log 50 mood entries' },
            { id: 'consistency-king', name: '⭐ Consistency King', description: 'Log 100 mood entries' },
            { id: 'positive-vibes', name: '✨ Positive Vibes', description: 'Maintain avg mood > 7' },
            { id: 'resilience', name: '💪 Resilience', description: '14 consecutive days' },
            { id: 'mindful-master', name: '🧘 Mindful Master', description: 'Complete 10 mindfulness recs' }
          ].map(badge => {
            const earned = achievements.find(a => a.id === badge.id);
            return (
              <div 
                key={badge.id} 
                className={`badge ${earned ? 'earned' : 'locked'}`}
                title={badge.description}
              >
                <div className="badge-icon">{badge.name.split(' ')[0]}</div>
                <div className="badge-info">
                  <div className="badge-name">{badge.name}</div>
                  <div className="badge-desc">{badge.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestones */}
      <div className="milestones-section">
        <h4>🎯 Milestones</h4>
        <div className="milestones-list">
          <div className={`milestone ${currentStreak >= 7 ? 'completed' : ''}`}>
            <div className="milestone-icon">7</div>
            <div className="milestone-info">
              <div className="milestone-title">Week Streak</div>
              <div className="milestone-progress">{currentStreak}/7 days</div>
            </div>
          </div>
          <div className={`milestone ${currentStreak >= 30 ? 'completed' : ''}`}>
            <div className="milestone-icon">30</div>
            <div className="milestone-info">
              <div className="milestone-title">Month Streak</div>
              <div className="milestone-progress">{currentStreak}/30 days</div>
            </div>
          </div>
          <div className={`milestone ${moodData.length >= 50 ? 'completed' : ''}`}>
            <div className="milestone-icon">50</div>
            <div className="milestone-info">
              <div className="milestone-title">Log 50 Entries</div>
              <div className="milestone-progress">{moodData.length}/50 entries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationPanel;
