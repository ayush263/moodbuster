import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cloud, Zap } from 'recharts';
import { AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';
import '../styles/SentimentAnalysis.css';

const SentimentAnalysis = ({ moodNotes = [] }) => {
  const [sentimentData, setSentimentData] = useState(null);
  const [topKeywords, setTopKeywords] = useState([]);
  const [emotionTrends, setEmotionTrends] = useState([]);

  useEffect(() => {
    analyzeSentiment();
  }, [moodNotes]);

  const analyzeSentiment = () => {
    if (!moodNotes || moodNotes.length === 0) return;

    // Sentiment keywords
    const sentimentKeywords = {
      positive: ['happy', 'great', 'amazing', 'wonderful', 'excellent', 'good', 'love', 'fantastic', 'grateful', 'blessed', 'awesome', 'proud', 'excited', 'motivated', 'confident', 'hopeful'],
      negative: ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'anxious', 'worried', 'stressed', 'depressed', 'lonely', 'disappointed', 'overwhelmed', 'scared', 'guilty'],
      neutral: ['okay', 'fine', 'alright', 'normal', 'average', 'meh', 'whatever', 'just', 'somewhat', 'kind of']
    };

    const keywordCount = {};
    let emotionCount = { positive: 0, negative: 0, neutral: 0 };
    const emotionTimeline = [];

    moodNotes.forEach(note => {
      if (!note.note) return;

      const text = note.note.toLowerCase();
      let sentiment = 'neutral';

      // Count emotion keywords
      for (const keyword of sentimentKeywords.positive) {
        if (text.includes(keyword)) {
          emotionCount.positive++;
          sentiment = 'positive';
        }
      }

      for (const keyword of sentimentKeywords.negative) {
        if (text.includes(keyword)) {
          emotionCount.negative++;
          sentiment = 'negative';
        }
      }

      for (const keyword of sentimentKeywords.neutral) {
        if (text.includes(keyword)) {
          if (sentiment === 'neutral') emotionCount.neutral++;
        }
      }

      // Extract keywords
      const words = text.split(/\s+/);
      words.forEach(word => {
        const cleanWord = word.replace(/[^a-z0-9]/g, '');
        if (cleanWord.length > 3) {
          keywordCount[cleanWord] = (keywordCount[cleanWord] || 0) + 1;
        }
      });

      emotionTimeline.push({
        date: new Date(note.timestamp).toLocaleDateString(),
        sentiment: sentiment,
        score: note.moodScore || 5
      });
    });

    // Get top keywords (exclude common words)
    const commonWords = ['that', 'this', 'have', 'with', 'from', 'about', 'been', 'have', 'their', 'what', 'some', 'which', 'when', 'make', 'them', 'where', 'your', 'into', 'there', 'more', 'just'];
    const topWords = Object.entries(keywordCount)
      .filter(([word]) => !commonWords.includes(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    setSentimentData(emotionCount);
    setTopKeywords(topWords);
    setEmotionTrends(emotionTimeline);
  };

  if (!sentimentData) {
    return <div className="sentiment-loading">Analyzing sentiment...</div>;
  }

  const total = sentimentData.positive + sentimentData.negative + sentimentData.neutral;
  const positivePercent = ((sentimentData.positive / total) * 100).toFixed(1);
  const negativePercent = ((sentimentData.negative / total) * 100).toFixed(1);
  const neutralPercent = ((sentimentData.neutral / total) * 100).toFixed(1);

  return (
    <div className="sentiment-analysis">
      <h3>🧠 Sentiment & Keyword Analysis</h3>

      {/* Sentiment Overview */}
      <div className="sentiment-overview">
        <div className="sentiment-card positive">
          <div className="sentiment-icon">😊</div>
          <div className="sentiment-content">
            <p className="sentiment-label">Positive</p>
            <p className="sentiment-value">{sentimentData.positive}</p>
            <p className="sentiment-percent">{positivePercent}%</p>
          </div>
        </div>
        <div className="sentiment-card negative">
          <div className="sentiment-icon">😟</div>
          <div className="sentiment-content">
            <p className="sentiment-label">Negative</p>
            <p className="sentiment-value">{sentimentData.negative}</p>
            <p className="sentiment-percent">{negativePercent}%</p>
          </div>
        </div>
        <div className="sentiment-card neutral">
          <div className="sentiment-icon">😐</div>
          <div className="sentiment-content">
            <p className="sentiment-label">Neutral</p>
            <p className="sentiment-value">{sentimentData.neutral}</p>
            <p className="sentiment-percent">{neutralPercent}%</p>
          </div>
        </div>
      </div>

      {/* Sentiment Distribution */}
      <div className="sentiment-chart">
        <h4>📊 Sentiment Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { name: 'Positive', value: sentimentData.positive, fill: '#22c55e' },
            { name: 'Neutral', value: sentimentData.neutral, fill: '#eab308' },
            { name: 'Negative', value: sentimentData.negative, fill: '#ef4444' }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
            <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Keywords */}
      <div className="keywords-section">
        <h4>🔑 Top Keywords in Your Notes</h4>
        <div className="keywords-cloud">
          {topKeywords.map(([word, count], index) => {
            const fontSize = Math.min(24, 12 + (count * 2));
            return (
              <span
                key={index}
                className="keyword"
                style={{ fontSize: `${fontSize}px` }}
                title={`Mentioned ${count} times`}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="sentiment-insights">
        <h4>💡 AI Insights</h4>
        <div className="insights-list">
          {sentimentData.positive > sentimentData.negative && (
            <div className="insight-item success">
              <TrendingUp size={20} />
              <div>
                <p className="insight-title">Positive Outlook</p>
                <p className="insight-desc">Your notes show more positive emotions than negative ones. Great mindset!</p>
              </div>
            </div>
          )}
          {sentimentData.negative > sentimentData.positive && (
            <div className="insight-item warning">
              <AlertCircle size={20} />
              <div>
                <p className="insight-title">Focus on Wellbeing</p>
                <p className="insight-desc">Consider engaging in activities that boost positive emotions and mood.</p>
              </div>
            </div>
          )}
          {topKeywords.length > 0 && (
            <div className="insight-item info">
              <Lightbulb size={20} />
              <div>
                <p className="insight-title">Key Themes</p>
                <p className="insight-desc">Your most mentioned themes: {topKeywords.slice(0, 3).map(([w]) => w).join(', ')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
