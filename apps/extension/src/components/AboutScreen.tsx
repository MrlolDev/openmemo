import React from "react";

interface AboutScreenProps {
  onClose: () => void;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ onClose }) => {
  return (
    <div className="w-full h-full bg-[#0d0d0d] relative overflow-hidden flex flex-col m-0 p-0">
      {/* Enhanced Background matching main screen */}
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

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white">About OpenMemo</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-all duration-300 cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white/60 hover:text-white transition-colors"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="fluid-container p-6 max-w-none">
            {/* Extension Info */}
            <div className="mb-6 text-center">
              <div className="mb-4 flex justify-center">
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
              <h2 className="text-2xl font-bold text-white mb-2">OpenMemo</h2>
              <div className="flex justify-center mb-3">
                <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-[#A8FF00] to-transparent water-surface" />
              </div>
              <p className="text-white/60 text-sm mb-2">
                AI Memory Assistant for ChatGPT, Claude & More
              </p>
              <p className="text-white/40 text-xs">Version 1.0.0</p>
            </div>

            {/* Free & Open Source Section */}
            <div className="fluid-container p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
                Free & Open Source
              </h3>
              <div className="text-center">
                <p className="text-white/80 mb-3">
                  OpenMemo is{" "}
                  <span className="text-[#A8FF00] font-medium">
                    completely free
                  </span>{" "}
                  and{" "}
                  <span className="text-[#A8FF00] font-medium">
                    100% open source
                  </span>
                  !
                </p>
                <p className="text-white/60 text-sm mb-4">
                  Built with transparency and community collaboration. We believe
                  AI memory tools should be accessible to everyone, always.
                </p>
                <div className="mb-4">
                  <p className="text-white/70 text-sm mb-2">
                    <span className="text-[#A8FF00] font-medium">Donation-supported:</span>{" "}
                    Help us keep OpenMemo free forever
                  </p>
                  <p className="text-white/50 text-xs">
                    Your support covers development costs and keeps this project thriving
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://github.com/MrlolDev/openmemo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#A8FF00]/10 hover:bg-[#A8FF00]/20 border border-[#A8FF00]/30 rounded-xl text-[#A8FF00] hover:text-[#85CC00] transition-all duration-300 cursor-pointer"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View on GitHub
                  </a>
                  
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded-xl text-pink-400 hover:text-pink-300 transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      // This would open a donation modal or redirect to donation page
                      // For now, just log to console
                      console.log('Donation support coming soon!');
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    Support the Project
                  </button>
                </div>
              </div>
            </div>

            {/* Creators Section */}
            <div className="fluid-container p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Creators
              </h3>

              <div className="space-y-6">
                {/* Leonardo */}
                <div className="text-center">
                  <div className="mb-4">
                    <p className="text-white/80 text-lg font-medium mb-2">
                      Leonardo
                    </p>
                    <p className="text-white/60 text-sm mb-3">
                      Extension & Backend Development
                    </p>
                  </div>

                  <div className="flex justify-center items-center gap-4 mb-4">
                    <a
                      href="https://twitter.com/mrloldev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 cursor-pointer border border-white/10 hover:border-[#A8FF00]/30"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-white/70"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span className="text-white/70 text-sm">@mrloldev</span>
                    </a>

                    <a
                      href="https://github.com/MrlolDev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 cursor-pointer border border-white/10 hover:border-[#A8FF00]/30"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-white/70"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span className="text-white/70 text-sm">MrlolDev</span>
                    </a>
                  </div>

                  <p className="text-white/60 text-xs leading-relaxed">
                    Codes the extension and backend infrastructure. Passionate
                    about building tools that enhance productivity and make AI
                    more accessible.
                  </p>
                </div>

                {/* Divider */}
                <div className="flex justify-center">
                  <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>

                {/* Samuel */}
                <div className="text-center">
                  <div className="mb-4">
                    <p className="text-white/80 text-lg font-medium mb-2">
                      Samuel
                    </p>
                    <p className="text-white/60 text-sm mb-3">
                      Website & Marketing
                    </p>
                  </div>

                  <div className="flex justify-center items-center gap-4 mb-4">
                    <a
                      href="https://twitter.com/disamdev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 cursor-pointer border border-white/10 hover:border-[#A8FF00]/30"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-white/70"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span className="text-white/70 text-sm">@disamdev</span>
                    </a>
                  </div>

                  <p className="text-white/60 text-xs leading-relaxed">
                    Works on the website and marketing efforts to bring OpenMemo
                    to more users and help them discover the power of AI memory
                    management.
                  </p>
                </div>
              </div>
            </div>

            {/* Current Features */}
            <div className="fluid-container p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20,6 9,17 4,12" />
                </svg>
                Current Features
              </h3>
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full"></div>
                  <span className="text-sm">
                    Memory sync across AI platforms
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full"></div>
                  <span className="text-sm">
                    Intelligent categorization & tagging
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full"></div>
                  <span className="text-sm">Real-time memory loading</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full"></div>
                  <span className="text-sm">Secure GitHub authentication</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full"></div>
                  <span className="text-sm">Cross-platform compatibility</span>
                </div>
              </div>
            </div>

            {/* Coming Soon */}
            <div className="fluid-container p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                Coming Soon
              </h3>
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                  <span className="text-sm">Google Drive integration</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                  <span className="text-sm">Advanced AI organization</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                  <span className="text-sm">Memory templates & snippets</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                  <span className="text-sm">Team collaboration features</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                  <span className="text-sm">Third-party API integrations</span>
                </div>
              </div>
            </div>

            {/* Supported Platforms */}
            <div className="fluid-container p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M10 4v4" />
                  <path d="M14 4v4" />
                  <path d="M4 8h16" />
                </svg>
                Supported Platforms
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>ChatGPT</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span>Claude AI</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>Google Gemini</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  <span>Perplexity</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  <span>DeepSeek</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  <span>T3.chat</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                  <span>Grok</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  <span>Delphi AI</span>
                  <span className="text-xs text-[#A8FF00] ml-1">
                    (where I work!)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutScreen;
