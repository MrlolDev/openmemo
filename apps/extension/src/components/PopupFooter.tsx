import React, { useState, useEffect } from 'react';
import { versionService } from '../services/versionService';

interface PopupFooterProps {
  // onShowAbout removed - now redirects to web
}

const PopupFooter: React.FC<PopupFooterProps> = ({}) => {
  const [version, setVersion] = useState('v1.0.0');

  useEffect(() => {
    versionService.getVersionDisplay().then(setVersion).catch(() => {
      // Fallback to default version if service fails
      setVersion('v1.0.0');
    });
  }, []);

  return (
    <div className="mt-auto">
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <a
            href="https://openmemo.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white/80 transition-colors cursor-pointer"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            About
          </a>
        </div>
        
        <a
          href="https://github.com/MrlolDev/openmemo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/60 hover:text-[#A8FF00] transition-colors cursor-pointer underline-offset-2 hover:underline"
        >
          {version}
        </a>
      </div>
    </div>
  );
};

export default PopupFooter;