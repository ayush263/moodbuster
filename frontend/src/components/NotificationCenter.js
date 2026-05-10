import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Lightbulb, Zap } from 'lucide-react';
import '../styles/NotificationCenter.css';

const NotificationCenter = ({ moodData = [], streakDays = 0 }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showCenter, setShowCenter] = useState(false);

  useEffect(() => {
    generateNotifications();
  }, [moodData, streakDays]);

  const generateNotifications = () => {
    const newNotifications = [];

    // Daily reminder notification
    const lastEntry = moodData?.[moodData.length - 1];
    if (lastEntry) {
      const lastDate = new Date(lastEntry.timestamp).toDateString();
      const today = new Date().toDateString();
      
      if (lastDate !== today) {
        newNotifications.push({
          id: 'daily-reminder',
          type: 'reminder',
          title: 'Time to Check In',
          message: 'How are you feeling today? Log your mood to maintain your streak.',
          icon: Bell,
          color: '#3b82f6',
          read: false,
          timestamp: new Date()
        });
      }
    }

    // Streak milestone
    if (streakDays === 7) {
      newNotifications.push({
        id: 'streak-7',
        type: 'achievement',
        title: '🎉 Week Warrior!',
        message: 'You\'ve logged for 7 consecutive days! Keep it up!',
        icon: Zap,
        color: '#f59e0b',
        read: false,
        timestamp: new Date()
      });
    }

    if (streakDays === 30) {
      newNotifications.push({
        id: 'streak-30',
        type: 'achievement',
        title: '👑 Month Master!',
        message: 'You\'ve achieved a 30-day streak! Incredible dedication!',
        icon: Zap,
        color: '#ec4899',
        read: false,
        timestamp: new Date()
      });
    }

    // Low mood alert
    if (lastEntry?.moodScore < 3) {
      newNotifications.push({
        id: 'low-mood',
        type: 'alert',
        title: 'We Noticed You\'re Down',
        message: 'Your recent mood entry is low. Consider taking a break or reaching out to someone.',
        icon: AlertCircle,
        color: '#ef4444',
        read: false,
        timestamp: new Date()
      });
    }

    // High mood celebration
    if (lastEntry?.moodScore >= 8) {
      newNotifications.push({
        id: 'high-mood',
        type: 'success',
        title: '😊 Great Mood!',
        message: 'You\'re in a great mood! Consider sharing this positive energy with others.',
        icon: CheckCircle,
        color: '#22c55e',
        read: false,
        timestamp: new Date()
      });
    }

    // Recommendation notification
    if (moodData.length > 0) {
      const avg = moodData.reduce((sum, m) => sum + m.moodScore, 0) / moodData.length;
      if (avg < 5) {
        newNotifications.push({
          id: 'wellness-tip',
          type: 'tip',
          title: '💡 Wellness Tip',
          message: 'Your average mood is lower than usual. Try a 10-minute meditation session.',
          icon: Lightbulb,
          color: '#8b5cf6',
          read: false,
          timestamp: new Date()
        });
      }
    }

    setNotifications(newNotifications);
    setUnreadCount(newNotifications.filter(n => !n.read).length);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notification-center-widget">
      {/* Floating Bell Icon */}
      <button
        className="notification-bell"
        onClick={() => setShowCenter(!showCenter)}
        title="Notifications"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showCenter && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button
              className="close-btn"
              onClick={() => setShowCenter(false)}
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="empty-state">
              <Bell size={32} />
              <p>No new notifications</p>
              <p className="subtext">You're all caught up! 🎉</p>
            </div>
          ) : (
            <>
              <div className="notifications-list">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`notification-item ${notif.type} ${notif.read ? 'read' : 'unread'}`}
                    style={{ borderLeftColor: notif.color }}
                  >
                    <div className="notification-icon" style={{ color: notif.color }}>
                      <notif.icon size={20} />
                    </div>
                    <div className="notification-content" onClick={() => markAsRead(notif.id)}>
                      <p className="notification-title">{notif.title}</p>
                      <p className="notification-message">{notif.message}</p>
                      <p className="notification-time">{formatTime(notif.timestamp)}</p>
                    </div>
                    <button
                      className="dismiss-btn"
                      onClick={() => dismissNotification(notif.id)}
                      title="Dismiss"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {notifications.length > 0 && (
                <div className="notification-footer">
                  <button className="clear-all-btn" onClick={clearAll}>
                    Clear All
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const formatTime = (timestamp) => {
  const now = new Date();
  const diff = now - new Date(timestamp);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return timestamp.toLocaleDateString();
};

export default NotificationCenter;
