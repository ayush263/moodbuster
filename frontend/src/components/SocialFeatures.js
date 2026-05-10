import React, { useState } from 'react';
import { Share2, Copy, Check, Heart, MessageCircle } from 'lucide-react';
import '../styles/SocialFeatures.css';

const SocialFeatures = ({ userName = 'User', currentMood = 5, moodHistory = [] }) => {
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  const generateShareText = () => {
    const moodLabel = currentMood <= 2 ? 'rough' : 
                     currentMood <= 4 ? 'challenging' : 
                     currentMood <= 6 ? 'okay' : 
                     currentMood <= 8 ? 'great' : 
                     'amazing';
    
    return `I'm having an ${moodLabel} day! 🌟 Currently at ${currentMood}/10 mood using Moodbuster - AI-Enhanced Mood Tracking. Join me on this wellness journey! 💚`;
  };

  const copyShareText = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareToSocial = (platform) => {
    const text = generateShareText();
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const calculateStreak = () => {
    if (!moodHistory || moodHistory.length === 0) return 0;
    
    const sortedData = [...moodHistory].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    let streak = 0;
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
    return streak;
  };

  const streak = calculateStreak();
  const avgMood = moodHistory.length > 0 
    ? (moodHistory.reduce((sum, m) => sum + m.moodScore, 0) / moodHistory.length).toFixed(1)
    : 0;

  return (
    <div className="social-features">
      <h3>🤝 Share Your Wellness Journey</h3>

      {/* Personal Stats Card */}
      <div className="stats-card">
        <div className="stat">
          <span className="stat-label">Current Mood</span>
          <span className="stat-value">{currentMood}/10</span>
        </div>
        <div className="stat">
          <span className="stat-label">Average Mood</span>
          <span className="stat-value">{avgMood}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Day Streak</span>
          <span className="stat-value">{streak}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Entries</span>
          <span className="stat-value">{moodHistory.length}</span>
        </div>
      </div>

      {/* Share Options */}
      <div className="share-section">
        <h4>📤 Share Your Progress</h4>
        
        <div className="share-preview">
          <div className="preview-header">Preview:</div>
          <p className="preview-text">{generateShareText()}</p>
        </div>

        <div className="share-buttons">
          <button 
            className={`share-btn copy ${copied ? 'copied' : ''}`}
            onClick={copyShareText}
            title="Copy to clipboard"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
          <button 
            className="share-btn twitter"
            onClick={() => shareToSocial('twitter')}
            title="Share on Twitter"
          >
            <Share2 size={20} />
            <span>Share on Twitter</span>
          </button>
          <button 
            className="share-btn facebook"
            onClick={() => shareToSocial('facebook')}
            title="Share on Facebook"
          >
            <Share2 size={20} />
            <span>Share on Facebook</span>
          </button>
        </div>
      </div>

      {/* Wellness Community */}
      <div className="community-section">
        <h4>💚 Wellness Community Features</h4>
        <div className="community-features">
          <div className="feature-item">
            <Heart size={24} />
            <div>
              <p className="feature-title">Support System</p>
              <p className="feature-desc">Connect with others on their wellness journey</p>
            </div>
          </div>
          <div className="feature-item">
            <MessageCircle size={24} />
            <div>
              <p className="feature-title">Share Wins</p>
              <p className="feature-desc">Celebrate achievements and progress together</p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="privacy-notice">
        <p>🔒 Your mood data is private. Sharing is completely optional and only shows what you choose.</p>
      </div>
    </div>
  );
};

export default SocialFeatures;
