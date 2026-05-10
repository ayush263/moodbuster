import React from 'react';
import { useNavigate } from 'react-router-dom';

function Topbar({ onLogout }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle">☰</button>
        <div className="search">
          <input placeholder="Search insights, activities, tips..." />
        </div>
      </div>

      <div className="topbar-right">
        <div className="notifications">🔔</div>
        <div className="user-pill" onClick={() => navigate('/profile')}>{user ? user.name : 'Guest'}</div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Topbar;
