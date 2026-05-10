import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/MoodCalendar.css';

const MoodCalendar = ({ moodData = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const moodMap = useMemo(() => {
    const map = {};
    moodData.forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString('en-CA'); // YYYY-MM-DD format
      map[date] = entry.moodScore;
    });
    return map;
  }, [moodData]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMoodColor = (score) => {
    if (score === undefined) return '#e5e7eb';
    if (score <= 2) return '#ef4444';
    if (score <= 4) return '#f97316';
    if (score <= 6) return '#eab308';
    if (score <= 8) return '#84cc16';
    return '#22c55e';
  };

  const getMoodLabel = (score) => {
    if (score === undefined) return 'No data';
    if (score <= 2) return 'Very Low';
    if (score <= 4) return 'Low';
    if (score <= 6) return 'Neutral';
    if (score <= 8) return 'High';
    return 'Very High';
  };

  const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Empty cells for days before the month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="mood-calendar">
      <div className="calendar-header">
        <h3>📅 Mood Calendar</h3>
        <div className="calendar-controls">
          <button onClick={previousMonth} className="nav-btn">
            <ChevronLeft size={20} />
          </button>
          <span className="month-year">{monthName}</span>
          <button onClick={nextMonth} className="nav-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
          <span>Very Low (0-2)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f97316' }}></div>
          <span>Low (2-4)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#eab308' }}></div>
          <span>Neutral (4-6)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#84cc16' }}></div>
          <span>High (6-8)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#22c55e' }}></div>
          <span>Very High (8-10)</span>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="days">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="day empty"></div>;
            }

            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const moodScore = moodMap[dateStr];
            const color = getMoodColor(moodScore);
            const label = getMoodLabel(moodScore);

            return (
              <div
                key={day}
                className={`day ${moodScore !== undefined ? 'has-mood' : 'no-mood'}`}
                style={{
                  backgroundColor: color,
                  opacity: moodScore !== undefined ? 1 : 0.3
                }}
                title={`${dateStr}: ${label} (${moodScore !== undefined ? moodScore + '/10' : 'No entry'})`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <div className="calendar-stats">
        <div className="stat">
          <span className="stat-label">Total Entries</span>
          <span className="stat-value">{Object.keys(moodMap).length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Avg Mood</span>
          <span className="stat-value">
            {Object.values(moodMap).length > 0
              ? (Object.values(moodMap).reduce((a, b) => a + b, 0) / Object.values(moodMap).length).toFixed(1)
              : 'N/A'}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Best Mood</span>
          <span className="stat-value">
            {Object.values(moodMap).length > 0 ? Math.max(...Object.values(moodMap)) : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MoodCalendar;
