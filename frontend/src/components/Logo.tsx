import React from 'react';

interface LogoProps {
  className?: string;
  height?: string;
  width?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', height = '40px', width = 'auto' }) => {
  return (
    <img
      src="/YTBSavings.png"
      alt="YTB Savings Logo"
      className={className}
      style={{ height, width }}
    />
  );
};

