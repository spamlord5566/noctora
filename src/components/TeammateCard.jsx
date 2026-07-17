import React, { useRef, useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';

// Inline LinkedIn SVG (lucide-react doesn't include this icon)
const LinkedInIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
import { playClick, playHoverTick, playModalOpen } from '../utils/audio';

export default function TeammateCard({ teammate, onViewProfile }) {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  
  const { name, role, dept, skills, email, linkedin, quote, image } = teammate;
  
  // Calculate default initials
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('')
    : 'N';

  // State to handle image loading state/errors
  const [imgError, setImgError] = useState(false);

  // Direct DOM implementation of mouse position tracking (glow + tilt) for optimal performance
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate inside the card
    const y = e.clientY - rect.top;  // y coordinate inside the card

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // Parallax 3D tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((e.clientY - rect.top - centerY) / centerY) * 10; // Max 10 deg
    const rotateY = ((e.clientX - rect.left - centerX) / centerX) * 10;  // Max 10 deg

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseEnter = () => {
    playHoverTick();
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    
    // Smoothly reset card transform
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  const handleCopyEmail = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      playClick();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const handleViewProfile = () => {
    playModalOpen();
    onViewProfile(teammate);
  };

  return (
    <div 
      ref={cardRef}
      className="team-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Profile Pic or Initials Frame */}
      <div className="profile-frame">
        <div className="profile-img-container">
          {image && !imgError ? (
            <img 
              src={image} 
              alt={name} 
              className="profile-img" 
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="profile-avatar-fallback">
              {initials}
            </div>
          )}
        </div>
      </div>

      {/* Profile Metadata */}
      <div className="teammate-info">
        <span className="teammate-role-pill">{role}</span>
        <h3 className="teammate-card-name">{name}</h3>
        <p className="teammate-dept">{dept}</p>
        
        {/* Short quote snippet */}
        <p className="teammate-quote-short">
          "{quote.length > 70 ? `${quote.substring(0, 68)}...` : quote}"
        </p>

        {/* Micro Skill Badges */}
        <div className="skills-preview-tags">
          {skills.split(',').slice(0, 2).map((skill, index) => (
            <span key={index} className="skill-tag-micro">
              {skill.trim()}
            </span>
          ))}
          {skills.split(',').length > 2 && (
            <span className="skill-tag-micro">+{skills.split(',').length - 2}</span>
          )}
        </div>
      </div>

      {/* Socials / Launch Actions Drawer */}
      <div className="card-actions">
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

        <button 
          className="view-profile-btn" 
          onClick={handleViewProfile}
        >
          Profile <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
