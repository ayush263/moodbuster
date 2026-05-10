import React, { useState } from 'react';
import { moodService } from '../services/apiService';
import { moodScaleToLabel, moodScaleToColor } from '../utils/moodHelpers';

function MoodTracker() {
  const [moodScore, setMoodScore] = useState(5);
  const [context, setContext] = useState({
    activity: '',
    notes: '',
    location: '',
    energy: '5',
    stress: '5'
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const getMoodDescription = () => {
    const descriptions = {
      1: { emoji: '😢', text: 'Struggling', color: '#ef4444' },
      2: { emoji: '😞', text: 'Down', color: '#f97316' },
      3: { emoji: '😕', text: 'Sad', color: '#f59e0b' },
      4: { emoji: '😐', text: 'Neutral', color: '#eab308' },
      5: { emoji: '🙂', text: 'Okay', color: '#84cc16' },
      6: { emoji: '😊', text: 'Good', color: '#22c55e' },
      7: { emoji: '😄', text: 'Great', color: '#10b981' },
      8: { emoji: '🥰', text: 'Wonderful', color: '#06b6d4' },
      9: { emoji: '😍', text: 'Fantastic', color: '#0ea5e9' },
      10: { emoji: '🎉', text: 'Ecstatic', color: '#3b82f6' }
    };
    return descriptions[moodScore] || descriptions[5];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await moodService.logMood(moodScore, context);
      setSubmitted(true);
      setTimeout(() => {
        setMoodScore(5);
        setContext({ activity: '', notes: '', location: '', energy: '5', stress: '5' });
        setSubmitted(false);
        setActiveStep(1);
      }, 3000);
    } catch (error) {
      console.error('Failed to log mood:', error);
      alert('Failed to save mood. Please try again.');
    }
  };

  const moodDesc = getMoodDescription();

  if (submitted) {
    return (
      <div className="mood-tracker">
        <div className="success-celebration">
          <div className="celebration-icon">✨</div>
          <h2>Thank You for Checking In!</h2>
          <p>Your emotional wellbeing matters to us</p>
          <div className="success-message-detail">
            <p>💪 You're building healthy self-awareness habits</p>
            <p>📊 This data helps personalize your recommendations</p>
            <p>🎯 Keep tracking to unlock deeper insights</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mood-tracker">
      <div className="tracker-header">
        <h2>How Are You Feeling?</h2>
        <p>Take a moment to reflect on your emotional state</p>
      </div>

      <form onSubmit={handleSubmit} className="mood-form advanced">
        {/* Step 1: Mood Selection */}
        <div className={`form-step ${activeStep === 1 ? 'active' : ''}`}>
          <h3 className="step-title">Your Current Mood</h3>
          
          <div className="mood-display-advanced">
            <div className="mood-circle-advanced" style={{ backgroundColor: moodScaleToColor(moodScore) }}>
              <div className="mood-emoji">{moodDesc.emoji}</div>
              <div className="mood-score-display">{moodScore}</div>
            </div>
            <div className="mood-details">
              <h4 style={{ color: moodDesc.color }}>{moodDesc.text}</h4>
              <p>{moodScaleToLabel(moodScore)}</p>
            </div>
          </div>

          <div className="slider-container">
            <div className="slider-labels">
              <span>Not Good</span>
              <span>Excellent</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={moodScore}
              onChange={(e) => setMoodScore(parseInt(e.target.value))}
              className="mood-slider-advanced"
            />
            <div className="slider-ticks">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="tick"></div>
              ))}
            </div>
          </div>

          <button 
            type="button" 
            className="next-btn"
            onClick={() => setActiveStep(2)}
          >
            Next: Add Context →
          </button>
        </div>

        {/* Step 2: Context */}
        <div className={`form-step ${activeStep === 2 ? 'active' : ''}`}>
          <h3 className="step-title">What's Influencing Your Mood?</h3>

          <div className="form-group">
            <label htmlFor="activity">Primary Activity</label>
            <select
              id="activity"
              value={context.activity}
              onChange={(e) => setContext({ ...context, activity: e.target.value })}
              className="form-select"
            >
              <option value="">Select what you're doing...</option>
              <option value="work">💼 Work / Productivity</option>
              <option value="exercise">🏃 Exercise / Movement</option>
              <option value="relaxing">🧘 Relaxing / Meditation</option>
              <option value="socializing">👥 Socializing / Time with Others</option>
              <option value="studying">📚 Learning / Studying</option>
              <option value="creative">🎨 Creative / Artistic</option>
              <option value="entertainment">🎮 Entertainment / Fun</option>
              <option value="rest">😴 Rest / Sleep</option>
              <option value="other">📌 Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              placeholder="e.g., Home, Office, Park, Café"
              value={context.location}
              onChange={(e) => setContext({ ...context, location: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="energy">Energy Level</label>
              <input
                id="energy"
                type="range"
                min="1"
                max="10"
                value={context.energy}
                onChange={(e) => setContext({ ...context, energy: e.target.value })}
                className="form-range"
              />
              <span className="range-value">{context.energy}/10</span>
            </div>

            <div className="form-group">
              <label htmlFor="stress">Stress Level</label>
              <input
                id="stress"
                type="range"
                min="1"
                max="10"
                value={context.stress}
                onChange={(e) => setContext({ ...context, stress: e.target.value })}
                className="form-range"
              />
              <span className="range-value">{context.stress}/10</span>
            </div>
          </div>

          <div className="form-navigation">
            <button 
              type="button" 
              className="back-btn"
              onClick={() => setActiveStep(1)}
            >
              ← Back
            </button>
            <button 
              type="button" 
              className="next-btn"
              onClick={() => setActiveStep(3)}
            >
              Next: Notes →
            </button>
          </div>
        </div>

        {/* Step 3: Notes */}
        <div className={`form-step ${activeStep === 3 ? 'active' : ''}`}>
          <h3 className="step-title">Any Additional Thoughts?</h3>
          <p className="step-subtitle">Optional but helps us understand you better</p>

          <div className="form-group">
            <label htmlFor="notes">Journal Entry</label>
            <textarea
              id="notes"
              placeholder="What's on your mind? Share any thoughts, triggers, or observations..."
              value={context.notes}
              onChange={(e) => setContext({ ...context, notes: e.target.value })}
              className="form-textarea"
              rows="5"
            />
            <p className="char-count">{context.notes.length} characters</p>
          </div>

          <div className="insights-preview">
            <h4>📊 What We'll Do With This</h4>
            <ul>
              <li>🔍 Identify mood patterns and triggers</li>
              <li>💡 Personalize recommendations based on your context</li>
              <li>📈 Track progress over time</li>
              <li>🎯 Provide actionable wellness insights</li>
            </ul>
          </div>

          <div className="form-navigation">
            <button 
              type="button" 
              className="back-btn"
              onClick={() => setActiveStep(2)}
            >
              ← Back
            </button>
            <button 
              type="submit" 
              className="submit-btn-advanced"
            >
              ✓ Save & Continue
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default MoodTracker;
