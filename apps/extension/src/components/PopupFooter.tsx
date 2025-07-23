import React from 'react';

interface PopupFooterProps {
  onShowAbout: (show: boolean) => void;
}

const PopupFooter: React.FC<PopupFooterProps> = ({ onShowAbout }) => {
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-[#0a0a0a] mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onShowAbout(true)}
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
          </button>
        </div>
        
        <a
          href="https://github.com/MrlolDev/openmemo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/60 hover:text-[#A8FF00] transition-colors cursor-pointer underline-offset-2 hover:underline"
        >
          v1.0.0
        </a>
      </div>
    </div>
  );
};

export default PopupFooter;