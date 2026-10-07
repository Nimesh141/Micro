import React from 'react';

/**
 * Geometric Abstract Illustration for Hero Section
 * Inspired by modern brutalist pastel editorial design:
 * Large soft cyan chat bubble, lavender rects, circles, thick dark outlines, small geometric accents.
 */
export const HeroIllustration = ({ className = "" }) => {
  return (
    <div className={`relative w-full max-w-lg aspect-square flex items-center justify-center p-4 ${className}`}>
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[4px_4px_0px_#202020] filter"
        style={{ overflow: 'visible' }}
      >
        {/* Pattern definitions */}
        <defs>
          <pattern id="diagonalHatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="12" stroke="#202020" strokeWidth="2" />
          </pattern>
          <pattern id="dotGrid" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2" fill="#536D6B" opacity="0.4" />
          </pattern>
        </defs>

        {/* Background Dot Grid Card */}
        <rect
          x="30"
          y="40"
          width="360"
          height="360"
          rx="16"
          fill="url(#dotGrid)"
          stroke="#202020"
          strokeWidth="2.5"
        />

        {/* Lavender Rectangular Element (Rotated Accent) */}
        <g transform="rotate(-6 220 180)">
          <rect
            x="70"
            y="70"
            width="280"
            height="180"
            rx="12"
            fill="#C9BDF2"
            stroke="#202020"
            strokeWidth="3.5"
          />
          {/* Decorative inner line */}
          <line x1="100" y1="120" x2="280" y2="120" stroke="#202020" strokeWidth="3" strokeDasharray="6 6" />
          <line x1="100" y1="150" x2="220" y2="150" stroke="#202020" strokeWidth="3" />
        </g>

        {/* Large Cyan Main Chat Bubble */}
        <g transform="rotate(4 260 270)">
          {/* Chat bubble body */}
          <path
            d="M 120 180 
               H 380 
               A 24 24 0 0 1 404 204 
               V 340 
               A 24 24 0 0 1 380 364 
               H 200 
               L 140 410 
               V 364 
               H 120 
               A 24 24 0 0 1 96 340 
               V 204 
               A 24 24 0 0 1 120 180 Z"
            fill="#C4F1F7"
            stroke="#202020"
            strokeWidth="3.5"
          />

          {/* Internal simulated text lines in chat bubble */}
          <rect x="140" y="225" width="180" height="14" rx="7" fill="#202020" />
          <rect x="140" y="255" width="220" height="14" rx="7" fill="#202020" opacity="0.8" />
          <rect x="140" y="285" width="120" height="14" rx="7" fill="#202020" opacity="0.6" />

          {/* Mini message bubble inside */}
          <rect
            x="240"
            y="310"
            width="120"
            height="32"
            rx="8"
            fill="#F2FFDF"
            stroke="#202020"
            strokeWidth="2.5"
          />
          <circle cx="260" cy="326" r="4" fill="#202020" />
          <circle cx="275" cy="326" r="4" fill="#202020" />
          <circle cx="290" cy="326" r="4" fill="#202020" />
        </g>

        {/* Floating Circular Element (White/Cream Accent Badge) */}
        <g transform="translate(350, 90)">
          <circle cx="45" cy="45" r="45" fill="#FFFFFF" stroke="#202020" strokeWidth="3" />
          <circle cx="45" cy="45" r="30" fill="#F2FFDF" stroke="#202020" strokeWidth="2.5" />
          {/* Star/Cross shape in center */}
          <path d="M 45 27 V 63 M 27 45 H 63" stroke="#202020" strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* Floating Pale Green Rect Badge: "ONLINE" */}
        <g transform="translate(40, 340) rotate(-4)">
          <rect x="0" y="0" width="140" height="42" rx="8" fill="#F2FFDF" stroke="#202020" strokeWidth="3" />
          <circle cx="24" cy="21" r="7" fill="#202020" />
          <text x="42" y="26" fill="#202020" fontSize="14" fontWeight="800" fontFamily="Space Grotesk, sans-serif">
            STAY CLOSE
          </text>
        </g>

        {/* Hatching Decorative Box */}
        <rect
          x="330"
          y="370"
          width="70"
          height="70"
          rx="10"
          fill="url(#diagonalHatch)"
          stroke="#202020"
          strokeWidth="2.5"
        />

        {/* Geometric Accents: Rotated Diamond & Small Circles */}
        <rect x="420" y="240" width="20" height="20" fill="#C9BDF2" stroke="#202020" strokeWidth="2" transform="rotate(45 420 240)" />
        <circle cx="60" cy="180" r="10" fill="#C4F1F7" stroke="#202020" strokeWidth="2" />
        <circle cx="220" cy="50" r="8" fill="#202020" />
        <circle cx="240" cy="50" r="5" fill="#202020" opacity="0.5" />
      </svg>
    </div>
  );
};

/**
 * Geometric Abstract Illustration for Authentication Page (Login / Sign Up)
 */
export const AuthIllustration = ({ className = "" }) => {
  return (
    <div className={`relative w-full max-w-md aspect-square flex items-center justify-center p-2 ${className}`}>
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[4px_4px_0px_#202020]"
        style={{ overflow: 'visible' }}
      >
        {/* Base Lavender Rounded Card */}
        <rect
          x="40"
          y="50"
          width="320"
          height="280"
          rx="16"
          fill="#C9BDF2"
          stroke="#202020"
          strokeWidth="3"
        />

        {/* Overlapping Cyan Shape */}
        <path
          d="M 70 90 L 330 90 A 12 12 0 0 1 342 102 L 342 240 A 12 12 0 0 1 330 252 L 200 252 L 140 290 L 140 252 L 70 252 A 12 12 0 0 1 58 240 L 58 102 A 12 12 0 0 1 70 90 Z"
          fill="#C4F1F7"
          stroke="#202020"
          strokeWidth="3"
        />

        {/* Lock Keyhole Geometric Graphic */}
        <g transform="translate(150, 120)">
          <rect x="10" y="30" width="80" height="70" rx="10" fill="#F2FFDF" stroke="#202020" strokeWidth="3" />
          <path d="M 25 30 V 20 A 25 25 0 0 1 75 20 V 30" stroke="#202020" strokeWidth="3.5" fill="none" />
          <circle cx="50" cy="58" r="8" fill="#202020" />
          <path d="M 50 64 V 78" stroke="#202020" strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* Floating Geometric Elements */}
        <circle cx="90" cy="310" r="24" fill="#FFFFFF" stroke="#202020" strokeWidth="3" />
        <rect x="280" y="40" width="36" height="36" rx="6" fill="#F2FFDF" stroke="#202020" strokeWidth="3" transform="rotate(15 280 40)" />
        <circle cx="70" cy="40" r="8" fill="#202020" />
        <line x1="310" y1="300" x2="350" y2="300" stroke="#202020" strokeWidth="4" strokeLinecap="round" />
        <line x1="325" y1="315" x2="350" y2="315" stroke="#202020" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
};

/**
 * Geometric Minimal Icons for Features
 */
export const FeatureIcon = ({ type }) => {
  if (type === 'simple') {
    return (
      <div className="w-14 h-14 bg-[#C4F1F7] border-[2.5px] border-[#202020] rounded-xl flex items-center justify-center shadow-[3px_3px_0px_#202020]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#202020" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#F2FFDF" />
        </svg>
      </div>
    );
  }

  if (type === 'secure') {
    return (
      <div className="w-14 h-14 bg-[#C9BDF2] border-[2.5px] border-[#202020] rounded-xl flex items-center justify-center shadow-[3px_3px_0px_#202020]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#202020" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="#FFFFFF" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-14 h-14 bg-[#F2FFDF] border-[2.5px] border-[#202020] rounded-xl flex items-center justify-center shadow-[3px_3px_0px_#202020]">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#202020" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" fill="#C4F1F7" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    </div>
  );
};
