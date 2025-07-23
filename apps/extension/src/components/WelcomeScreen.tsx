import React from "react";

interface WelcomeScreenProps {
  onSignInClick: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSignInClick }) => {
  return (
    <div className="w-full h-full bg-[#0d0d0d] flex flex-col relative overflow-hidden m-0 p-0">
      {/* Enhanced Background with Organized Water Drops */}
      <div className="absolute inset-0">
        {/* Main Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#A8FF00]/8 via-[#0d0d0d] via-40% to-[#A8FF00]/4 pointer-events-none" />

        {/* Strategic Water Drop Placement - Elegant Green Theme */}
        <div className="absolute top-12 right-16 w-14 h-18 water-drop-primary opacity-20 floating-drop" />
        <div
          className="absolute top-48 left-8 w-10 h-13 water-drop-primary opacity-15 floating-drop"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-12 w-16 h-20 water-drop-primary opacity-25 floating-drop"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute bottom-48 left-16 w-12 h-15 water-drop-primary opacity-12 floating-drop"
          style={{ animationDelay: "6s" }}
        />
        <div
          className="absolute top-64 right-6 w-8 h-10 water-drop-primary opacity-10 floating-drop"
          style={{ animationDelay: "1s" }}
        />

        {/* Subtle Light Rays */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-32 bg-gradient-to-b from-[#A8FF00]/20 to-transparent" />
        <div className="absolute top-0 left-1/3 w-0.5 h-24 bg-gradient-to-b from-[#A8FF00]/15 to-transparent" />
        <div className="absolute top-0 right-1/3 w-0.5 h-20 bg-gradient-to-b from-[#A8FF00]/10 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
          {/* Logo and Brand */}
          <div className="mb-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="logo-drop floating-drop hover:scale-110 transition-all duration-300 water-ripple">
                <img
                  src="/logo.png"
                  alt="OpenMemo"
                  className="absolute inset-0 w-full h-full object-contain opacity-95"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              OpenMemo
            </h1>

            <div className="flex justify-center mb-4">
              <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-[#A8FF00] to-transparent water-surface" />
            </div>

            <p className="text-white/60 text-sm font-medium tracking-wide uppercase">
              AI Memory Assistant
            </p>
          </div>

          {/* Description */}
          <div className="mb-10 text-center max-w-sm">
            <p className="text-white/75 text-sm leading-relaxed">
              Sync your memories across ChatGPT, Claude, and more with
              intelligent AI organization and categorization.
            </p>
          </div>
        </div>

        {/* Action Section */}
        <div className="px-8 pb-8">
          <div className="fluid-container p-6 text-center">
            <p className="text-white/60 text-xs mb-4 uppercase tracking-wide font-medium">
              Get Started
            </p>

            <button
              onClick={onSignInClick}
              className="group w-full btn-water-drop text-black font-semibold py-4 px-6 flex items-center justify-center gap-3 text-sm transition-all duration-300 cursor-pointer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="group-hover:scale-110 transition-transform"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>

            <p className="text-white/40 text-xs mt-3 leading-relaxed">
              Secure authentication • No data stored without permission
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
