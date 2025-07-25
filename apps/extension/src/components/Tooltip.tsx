import React from 'react';
import { Tooltip as SharedTooltip } from '@repo/ui';
import type { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  delay = 500 
}) => {
  return (
    <SharedTooltip
      content={content}
      side={position}
      delay={delay}
      variant="default"
    >
      {children}
    </SharedTooltip>
  );
};

export default Tooltip;