import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { playThemeSwitch, playClick } from '../utils/audio';

export default function Header({ theme, toggleTheme }) {
  const isDark = theme === 'dark';

  const handleToggle = () => {
    // Generate synthesize switch chime
    playThemeSwitch(!isDark);
    toggleTheme();
  };

  return (
    <header>
      <div className="container header-inner">
        <a href="/" className="brand" onClick={(e) => { e.preventDefault(); playClick(); }}>
          <div className="eclipse-logo">
            <Sparkles size={16} style={{ color: 'var(--bg-primary)' }} />
          </div>
          <span className="brand-text">Noctora</span>
        </a>

        <button 
          className="theme-toggle-btn" 
          onClick={handleToggle}
          aria-label="Toggle theme mode"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          {isDark ? (
            <Sun size={20} className="icon-sun animate-spin-slow" />
          ) : (
            <Moon size={20} className="icon-moon" />
          )}
        </button>
      </div>
    </header>
  );
}
