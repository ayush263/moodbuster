import React, { useEffect, useState } from 'react';
import { userService } from '../services/apiService';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await userService.getProfile();
        setProfile(res.data || res);
      } catch (e) {
        const stored = localStorage.getItem('user');
        setProfile(stored ? JSON.parse(stored) : null);
      }
    };
    load();
  }, []);

  if (!profile) return (
    <section className="page profile-page"><h2>Profile</h2><p>Loading profile…</p></section>
  );

  return (
    <section className="page profile-page">
      <h2>Profile</h2>
      <div className="profile-card">
        <div className="avatar">{(profile.name || 'U')[0]}</div>
        <div className="profile-info">
          <div className="profile-name">{profile.name}</div>
          <div className="profile-email">{profile.email}</div>
        </div>
      </div>
    </section>
  );
}
