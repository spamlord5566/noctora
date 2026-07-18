import React, { useEffect, useState } from 'react';
import { X, Mail, Quote, Check } from 'lucide-react';

// Inline LinkedIn SVG (lucide-react doesn't include this icon)
const LinkedInIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
import { playClick } from '../utils/audio';

export default function TeammateModal({ teammate, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Trigger ESC click listener for modal removal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Trigger loading fill transitions on modal entrance
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setAnimateProgress(true);
      }, 80);
      return () => clearTimeout(timer);
    } else {
      setAnimateProgress(false);
    }
  }, [isOpen]);

  if (!teammate) return null;

  const { name, role, dept, skills, email, linkedin, quote, image } = teammate;

  // Calculate default initials
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('')
    : 'N';

  const handleClose = () => {
    playClick();
    onClose();
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      playClick();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  // Convert skills comma list into array of skills, generating aesthetic progress level values
  const skillList = skills ? skills.split(',').map((skill, index) => {
    const skillName = skill.trim();
    // Deterministic nice stats between 85% and 98%
    const levels = [95, 92, 88, 96, 90, 85, 97];
    const val = levels[(skillName.length + index) % levels.length];
    return { name: skillName, level: val };
  }) : [];

  return (
    <div 
      className={`modal-backdrop ${isOpen ? 'open' : ''}`}
      onClick={handleClose}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Stop propagation to prevent backdrop close
      >
        {/* Close Button */}
        <button 
          className="modal-close-btn" 
          onClick={handleClose}
          aria-label="Close modal dialog"
        >
          <X size={18} />
        </button>

        {/* Modal Grid Body */}
        <div className="modal-body">
          {/* Left panel */}
          <div className="modal-hero-pane">
            <div className="modal-avatar-frame">
              {image && !imgError ? (
                <img 
                  src={image} 
                  alt={name} 
                  className="profile-img" 
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="modal-avatar-fallback">
                  {initials}
                </div>
              )}
            </div>
            <h3>{name}</h3>
            <span className="modal-role-pill">{dept}</span>
            <span className="modal-hero-role">{role}</span>

            {/* Social icons drawer */}
            <div className="social-links">
              <button 
                className="social-btn" 
                onClick={handleCopyEmail}
                aria-label="Copy Email address"
              >
                {copied ? <Check size={16} style={{ color: 'var(--accent-primary)' }} /> : <Mail size={16} />}
                <span className="tooltip">{copied ? 'Copied!' : 'Copy Email'}</span>
              </button>
              
              {linkedin && (
                <a 
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  onClick={() => playClick()}
                  aria-label="LinkedIn profile link"
                >
                  <LinkedInIcon size={16} />
                  <span className="tooltip">LinkedIn</span>
                </a>
              )}
            </div>
          </div>

          {/* Right panel details */}
          <div className="modal-info-pane">
            {/* Tagline/Quote block */}
            <h4>Motto & Philosophy</h4>
            <div className="modal-quote-wrapper">
              <div className="quote-icon-decor">
                <Quote size={24} style={{ fill: 'currentColor', transform: 'rotate(180deg)' }} />
              </div>
              <p className="modal-quote">"{quote}"</p>
            </div>

            {/* Structured Skill details with animated progress lines */}
            <h4>Technical Expertise</h4>
            <div className="modal-skills-panel">
              <div className="skills-list-meters">
                {skillList.map((skill, index) => (
                  <div key={index} className="skill-meter-row">
                    <div className="skill-meter-header">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="skill-meter-track">
                      <div 
                        className="skill-meter-fill"
                        style={{ width: animateProgress ? `${skill.level}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary contact link */}
            <h4>Direct Connection</h4>
            <a 
              href={`mailto:${email}`} 
              className="modal-contact-row"
              onClick={() => playClick()}
            >
              <Mail size={16} style={{ color: 'var(--accent-primary)' }} />
              <span>Reach out: {email}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
