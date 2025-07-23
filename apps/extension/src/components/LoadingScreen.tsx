import React from 'react';

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading memories...", 
  submessage 
}) => {
  return (
    <div className="w-full h-full bg-[#0d0d0d] relative overflow-hidden flex flex-col m-0 p-0">
      {/* Enhanced Background matching main app */}
      <div className="absolute inset-0">
        {/* Main Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#A8FF00]/8 via-[#0d0d0d] via-40% to-[#A8FF00]/4 pointer-events-none" />

        {/* Strategic Water Drop Placement */}
        <div className="absolute top-12 right-16 w-14 h-18 water-drop-primary opacity-20 floating-drop" />
        <div
          className="absolute top-48 left-8 w-10 h-13 water-drop-primary opacity-15 floating-drop"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-12 w-16 h-20 water-drop-primary opacity-25 floating-drop"
          style={{ animationDelay: "4s" }}
        />

        {/* Subtle Light Rays */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-32 bg-gradient-to-b from-[#A8FF00]/20 to-transparent" />

        {/* Water surface effect at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 water-surface pointer-events-none" />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          {/* Enhanced Loading Animation */}
          <div className="relative mb-6">
            {/* Outer rotating ring */}
            <div className="w-16 h-16 border-4 border-[#A8FF00]/20 border-t-[#A8FF00] rounded-full animate-spin mx-auto" />
            {/* Inner pulsing dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#A8FF00] rounded-full opacity-80 animate-pulse" />
            {/* Glow effect */}
            <div className="absolute inset-0 w-16 h-16 bg-[#A8FF00]/10 rounded-full animate-pulse mx-auto" 
                 style={{ filter: 'blur(8px)' }} />
          </div>

          {/* Main Message */}
          <div className="text-white text-lg font-semibold mb-2 animate-pulse">
            {message}
          </div>

          {/* Submessage */}
          {submessage && (
            <div className="text-white/60 text-sm max-w-xs mx-auto leading-relaxed">
              {submessage}
            </div>
          )}

          {/* Loading dots animation */}
          <div className="flex items-center justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-[#A8FF00]/60 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-[#A8FF00]/60 rounded-full animate-bounce" 
                 style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-[#A8FF00]/60 rounded-full animate-bounce" 
                 style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;