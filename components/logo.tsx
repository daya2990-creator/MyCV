import React from 'react';

export const Logo = ({ 
  size = 32, 
  className = "", 
  textClassName = "text-slate-900" 
}: { 
  size?: number; 
  className?: string;
  textClassName?: string;
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Background Shape: Rounded Squircle */}
        <rect x="0" y="0" width="32" height="32" rx="8" className="fill-indigo-600" />
        
        {/* Abstract 'M' made of Resume Lines */}
        <path 
          d="M8 10C8 8.89543 8.89543 8 10 8H22C23.1046 8 24 8.89543 24 10V22C24 23.1046 23.1046 24 22 24H10C8.89543 24 8 23.1046 8 22V10Z" 
          className="fill-white opacity-20"
        />
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M11 11C10.4477 11 10 11.4477 10 12V20C10 20.5523 10.4477 21 11 21C11.5523 21 12 20.5523 12 20V14.4142L15.2929 17.7071C15.6834 18.0976 16.3166 18.0976 16.7071 17.7071L20 14.4142V20C20 20.5523 20.4477 21 21 21C21.5523 21 22 20.5523 22 20V12C22 11.4477 21.5523 11 21 11C20.4477 11 20 11.4477 20 12V12.5858L16.7071 15.8787C16.3166 16.2692 15.6834 16.2692 15.2929 15.8787L12 12.5858V12C12 11.4477 11.5523 11 11 11Z" 
          fill="white" 
        />
      </svg>
      <span className={`font-bold text-lg tracking-tight ${textClassName}`}>
        MyCV.guru
      </span>
    </div>
  );
};