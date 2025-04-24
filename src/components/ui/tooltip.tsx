'use client';

import * as React from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(props, ref) {
  const { children, disabled, content, className = '' } = props;
  const [isVisible, setIsVisible] = React.useState(false);

  if (disabled) return children;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      ref={ref}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-10 px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-sm 
            bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 whitespace-nowrap ${className}`}
        >
          {content}
          <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
});
