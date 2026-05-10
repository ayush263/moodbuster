import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">☁️</div>
        <div className="brand-text">Moodbuster</div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/">Overview</Link>
        <Link to="/mood-tracker">Log Mood</Link>
        <Link to="/insights">Insights</Link>
        <Link to="/activities">Activities</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <div className="user-summary">
            <div className="user-avatar">{(user.name || 'U')[0]}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>
        ) : (
          <div className="user-summary empty">Not signed in</div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
