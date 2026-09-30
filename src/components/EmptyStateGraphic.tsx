import React from 'react';

interface EmptyStateGraphicProps {
  className?: string;
  variant?: 'document' | 'interview' | 'camera';
}

export const EmptyStateGraphic: React.FC<EmptyStateGraphicProps> = ({
  className = 'w-32 h-32',
  variant = 'interview'
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background soft aura */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#FDF2F0] to-[#F3EFE8] -z-0 opacity-80" />

      {variant === 'interview' && (
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          {/* Base pedestal plate */}
          <rect x="24" y="90" width="72" height="6" rx="3" fill="#E2DDD5" />
          
          {/* Card / Tablet Frame */}
          <rect x="32" y="22" width="56" height="66" rx="8" fill="#FFFFFF" stroke="#D1CAC0" strokeWidth="2" />
          
          {/* Audio Wave lines on card */}
          <rect x="42" y="34" width="24" height="4" rx="2" fill="#E65A3C" />
          <rect x="42" y="42" width="36" height="3" rx="1.5" fill="#E2DDD5" />
          <rect x="42" y="48" width="30" height="3" rx="1.5" fill="#E2DDD5" />
          
          {/* Video indicator circle */}
          <circle cx="60" cy="68" r="11" fill="#FAF8F5" stroke="#E65A3C" strokeWidth="2" />
          <polygon points="58,63 65,68 58,73" fill="#E65A3C" />

          {/* Floating accent elements */}
          <circle cx="28" cy="38" r="3" fill="#1B4332" opacity="0.6" />
          <circle cx="92" cy="54" r="4" fill="#E65A3C" opacity="0.4" />
          <circle cx="86" cy="28" r="2.5" fill="#B45309" opacity="0.5" />
        </svg>
      )}

      {variant === 'document' && (
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          <rect x="28" y="92" width="64" height="5" rx="2.5" fill="#E2DDD5" />
          <rect x="36" y="20" width="48" height="68" rx="6" fill="#FFFFFF" stroke="#D1CAC0" strokeWidth="2" />
          
          {/* Document header banner */}
          <path d="M38 22H82V32H38V22Z" fill="#FAF8F5" />
          <circle cx="46" cy="27" r="2" fill="#E65A3C" />
          <circle cx="53" cy="27" r="2" fill="#D1CAC0" />
          
          {/* Text rows */}
          <rect x="44" y="42" width="32" height="3.5" rx="1.75" fill="#1C1917" opacity="0.7" />
          <rect x="44" y="50" width="24" height="3" rx="1.5" fill="#E2DDD5" />
          <rect x="44" y="57" width="28" height="3" rx="1.5" fill="#E2DDD5" />
          <rect x="44" y="64" width="20" height="3" rx="1.5" fill="#E2DDD5" />

          {/* Verification check seal */}
          <circle cx="70" cy="74" r="9" fill="#1B4332" />
          <path d="M66.5 74L69 76.5L74 71.5" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {variant === 'camera' && (
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          {/* Camera body */}
          <rect x="26" y="38" width="68" height="48" rx="10" fill="#FFFFFF" stroke="#D1CAC0" strokeWidth="2" />
          <path d="M46 38L52 30H68L74 38H46Z" fill="#FAF8F5" stroke="#D1CAC0" strokeWidth="2" />
          
          {/* Camera Lens */}
          <circle cx="60" cy="62" r="16" fill="#FAF8F5" stroke="#E65A3C" strokeWidth="2.5" />
          <circle cx="60" cy="62" r="8" fill="#1C1917" opacity="0.8" />
          <circle cx="63" cy="59" r="2.5" fill="#FFFFFF" />

          {/* Red indicator dot */}
          <circle cx="82" cy="48" r="3" fill="#E65A3C" />
        </svg>
      )}
    </div>
  );
};
