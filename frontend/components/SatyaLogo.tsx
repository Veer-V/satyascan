import React from 'react';

const SatyaLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="satya_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00E5FF" />
        <stop offset="1" stopColor="#7C4DFF" />
      </linearGradient>
      <filter id="glow_s" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Background with Gradient */}
    <rect width="100" height="100" rx="22" fill="url(#satya_grad)" />
    
    {/* White Cross Shape */}
    <path d="M38 20 H62 V38 H80 V62 H62 V80 H38 V62 H20 V38 H38 V20Z" fill="white" />
    
    {/* Person Figure (Negative Space Effect) */}
    {/* Head */}
    <circle cx="50" cy="38" r="6" fill="url(#satya_grad)" />
    {/* Body Swoosh */}
    <path d="M 50 48 Q 35 48 32 65 L 68 65 Q 65 48 50 48 Z" fill="url(#satya_grad)" />
    
    {/* Futuristic Accents */}
    <path d="M10 10 L30 10 L10 30 Z" fill="white" fillOpacity="0.3" />
    <circle cx="85" cy="15" r="2" fill="white" fillOpacity="0.6" />
    <path d="M90 90 L70 90 L90 70 Z" fill="white" fillOpacity="0.3" />
    <rect x="5" y="5" width="90" height="90" rx="20" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
  </svg>
);

export default SatyaLogo;