import React, { useState, useEffect } from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import '../styles/ThemeProvider.css';

const THEMES = {
  light: {
    name: 'Light',
    primary: '#8b5cf6',
    secondary: '#ec4899',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#1f2937',
    accent: '#06b6d4'
  },
  dark: {
    name: 'Dark',
    primary: '#a78bfa',
    secondary: '#f472b6',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    accent: '#06b6d4'
  },
  ocean: {
    name: 'Ocean',
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    background: '#ecf0f1',
    surface: '#ffffff',
    text: '#2c3e50',
    accent: '#3498db'
  },
  forest: {
    name: 'Forest',
    primary: '#16a34a',
    secondary: '#84cc16',
    background: '#f0fdf4',
    surface: '#ffffff',
    text: '#1b4332',
    accent: '#22c55e'
  },
  sunset: {
    name: 'Sunset',
    primary: '#f97316',
    secondary: '#ec4899',
    background: '#fef3c7',
    surface: '#ffffff',
    text: '#78350f',
    accent: '#f59e0b'
  }
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('mood-theme') || 'light';
    const savedDark = localStorage.getItem('mood-dark') === 'true';
    setTheme(savedTheme);
    setIsDark(savedDark);
    applyTheme(savedTheme, savedDark);
  }, []);

  const applyTheme = (themeName, darkMode = false) => {
    const themeConfig = THEMES[themeName];
    const root = document.documentElement;

    // Set CSS variables
    root.style.setProperty('--color-primary', themeConfig.primary);
    root.style.setProperty('--color-secondary', themeConfig.secondary);
    root.style.setProperty('--color-background', themeConfig.background);
    root.style.setProperty('--color-surface', themeConfig.surface);
    root.style.setProperty('--color-text', themeConfig.text);
    root.style.setProperty('--color-accent', themeConfig.accent);

    // Apply dark mode class
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }

    // Save preferences
    localStorage.setItem('mood-theme', themeName);
    localStorage.setItem('mood-dark', darkMode);
  };

  const handleThemeChange = (themeName) => {
    setTheme(themeName);
    applyTheme(themeName, isDark);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    applyTheme(theme, newDarkMode);
  };

  return (
    <>
      <div className="theme-provider-container" style={{
        backgroundColor: THEMES[theme].background,
        color: THEMES[theme].text,
        transition: 'all 0.3s ease'
      }}>
        {children}
      </div>

      {/* Theme Switcher Widget */}
      <ThemeSwitcher 
        currentTheme={theme}
        isDark={isDark}
        onThemeChange={handleThemeChange}
        onDarkModeToggle={handleDarkModeToggle}
      />
    </>
  );
};

const ThemeSwitcher = ({ currentTheme, isDark, onThemeChange, onDarkModeToggle }) => {
  const [showPalette, setShowPalette] = useState(false);

  return (
    <div className="theme-switcher">
      {/* Dark Mode Toggle */}
      <button 
        className="theme-btn dark-toggle"
        onClick={onDarkModeToggle}
        title="Toggle dark mode"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Theme Palette */}
      <button 
        className="theme-btn palette-toggle"
        onClick={() => setShowPalette(!showPalette)}
        title="Change theme"
      >
        <Palette size={20} />
      </button>

      {/* Palette Dropdown */}
      {showPalette && (
        <div className="palette-dropdown">
          <div className="palette-header">Select Theme</div>
          <div className="theme-grid">
            {Object.entries(THEMES).map(([key, config]) => (
              <button
                key={key}
                className={`theme-option ${currentTheme === key ? 'active' : ''}`}
                onClick={() => {
                  onThemeChange(key);
                  setShowPalette(false);
                }}
                title={config.name}
                style={{
                  background: `linear-gradient(135deg, ${config.primary} 0%, ${config.secondary} 100%)`
                }}
              >
                <span>{config.name}</span>
                {currentTheme === key && <span className="checkmark">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeProvider;
