import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  animate?: boolean;
}

export const GradientText = ({ 
  children, 
  className = '', 
  gradient = 'linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #EC4899 100%)',
  animate = false
}: GradientTextProps) => {
  return (
    <span 
      className={`${className} ${animate ? 'animate-gradient' : ''}`}
      style={{
        background: animate ? 
          'linear-gradient(270deg, #2563EB, #7C3AED, #EC4899, #F59E0B, #10B981, #2563EB)' : 
          gradient,
        backgroundSize: animate ? '400% 400%' : 'auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: animate ? 'gradient 8s ease infinite' : 'none'
      }}
    >
      {children}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </span>
  );
};

export default GradientText;
