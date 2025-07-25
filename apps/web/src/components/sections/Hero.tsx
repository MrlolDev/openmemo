"use client";
import { WaterDropButton, BackgroundEffect, FadeIn, WaterDrop, MemoryCard, LogoBrand, type Memory } from "@repo/ui";

export default function Hero() {
  // Fake memories for the preview
  const fakeMemories: Memory[] = [
    {
      id: "1",
      content: "Help me build a React component with TypeScript",
      category: "Development",
      tags: "react,typescript",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      source: "ChatGPT",
      updatedAt: new Date().toISOString()
    },
    {
      id: "2", 
      content: "Explain machine learning algorithms simply",
      category: "Learning",
      tags: "ai,ml",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      source: "Claude AI",
      updatedAt: new Date().toISOString()
    },
    {
      id: "3",
      content: "Draft a product launch strategy",
      category: "Business", 
      tags: "strategy",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      source: "Gemini",
      updatedAt: new Date().toISOString()
    },
    {
      id: "4",
      content: "Design patterns for scalable APIs",
      category: "Architecture",
      tags: "api", 
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      source: "Perplexity",
      updatedAt: new Date().toISOString()
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative overflow-hidden flex items-center justify-center pb-16">
      {/* Enhanced Background matching extension */}
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

        {/* Water surface effect at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 water-surface pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="up" delay={0}>
            <div className="text-center lg:text-left">
              {/* Logo */}
              <div className="mb-8 flex justify-center lg:justify-start">
                <div className="logo-drop floating-drop hover:scale-110 transition-all duration-300 water-ripple">
                  <WaterDrop 
                    size="lg" 
                    className="w-12 h-16 mx-auto"
                    style={{
                      background: "linear-gradient(135deg, #A8FF00 0%, #85CC00 100%)",
                      filter: "drop-shadow(0 0 20px rgba(168, 255, 0, 0.3))"
                    }}
                  />
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-white text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Your AI's Perfect{" "}
                <span className="text-[#A8FF00] relative">
                  Memory
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A8FF00] to-[#85CC00] opacity-60" />
                </span>
              </h1>

              <p className="text-white/70 text-lg lg:text-xl mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Never lose context again. <span className="text-[#A8FF00]/80 font-medium">OpenMemo</span> gives your AI a long-term memory, 
                so you can pick up conversations where you left off, across <span className="text-white font-medium">8+ AI platforms</span>.
              </p>

              <div className="mb-8 flex flex-wrap gap-3 justify-center lg:justify-start text-sm">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#A8FF00]/10 border border-[#A8FF00]/30 rounded-xl text-[#A8FF00]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                  <span className="font-medium">100% Free & Open Source</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white/70">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1l3 6 6 .75-4.5 4.25L18 18.5 12 15l-6 3.5 1.5-6.25L3 7.75 9 7z"/>
                  </svg>
                  <span>GitHub Authentication</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white/70">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                    <path d="M12 21c0-1-1-3-3-3s-3 2-3 3 1 3 3 3 3-2 3-3"/>
                    <path d="M12 3c0 1 1 3 3 3s3-2 3-3-1-3-3-3-3 2-3 3"/>
                  </svg>
                  <span>Zero Tracking</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <WaterDropButton 
                  size="lg" 
                  className="group px-8 py-4 text-lg font-semibold"
                  appName="web"
                >
                  <div className="flex items-center gap-3">
                    <span>Get Started Free</span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </WaterDropButton>

                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#A8FF00]/30 rounded-2xl text-white hover:text-[#A8FF00] transition-all duration-300 font-medium backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span>View on GitHub</span>
                  </div>
                </button>
              </div>

            </div>
          </FadeIn>

          <FadeIn direction="left" delay={400}>
            <div className="relative">
              {/* Extension Popup Demo */}
              <div className="mx-auto" style={{ width: "400px", height: "600px" }}>
                <div className="relative w-full h-full">
                  {/* Extension Container */}
                  <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden w-full h-full flex flex-col">
                    {/* Extension Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                      <LogoBrand 
                        size="sm" 
                        showStatus={true}
                        appName="extension"
                      />
                      {/* Account */}
                      <div className="flex items-center gap-2">
                        <div className="relative group">
                          <button className="w-8 h-8 bg-gradient-to-br from-[#A8FF00]/30 to-[#A8FF00]/10 hover:from-[#A8FF00]/40 hover:to-[#A8FF00]/20 border border-[#A8FF00]/30 hover:border-[#A8FF00]/50 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#A8FF00"
                              strokeWidth="2"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#A8FF00"
                              strokeWidth="3"
                              className="absolute -bottom-0.5 -right-0.5"
                            >
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </button>
                          
                          {/* Dropdown Menu (fake for preview) */}
                          <div className="absolute right-0 top-full mt-1 w-36 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none z-30">
                            <div className="p-1">
                              <div className="px-3 py-2 text-xs text-white/60 hover:bg-white/5 rounded-md cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-[#A8FF00] rounded-full"></div>
                                  <span>Profile</span>
                                </div>
                              </div>
                              <div className="px-3 py-2 text-xs text-white/60 hover:bg-white/5 rounded-md cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                    <polyline points="16,17 21,12 16,7"/>
                                    <line x1="21" y1="12" x2="9" y2="12"/>
                                  </svg>
                                  <span>Sign out</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Content Area with background animation */}
                    <div className="flex-1 overflow-hidden min-h-0">
                      <div className="h-full flex flex-col relative">
                        <div className="flex-1 flex flex-col min-h-0 p-4 relative mx-2 my-2">
                          {/* Background animation container */}
                          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
                            {/* Rotating conic gradient animation */}
                            <div
                              className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] pointer-events-none"
                              style={{
                                background: `conic-gradient(
                                  from 0deg at 50% 50%,
                                  transparent 0deg,
                                  rgba(168, 255, 0, 0.1) 45deg,
                                  transparent 90deg,
                                  rgba(0, 212, 255, 0.1) 225deg,
                                  transparent 270deg
                                )`,
                                animation: "rotate 20s linear infinite",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-[#A8FF00]/8 via-transparent to-[#A8FF00]/4 opacity-60" />
                            <div className="absolute inset-0 bg-gradient-to-tl from-[#00D4FF]/6 via-transparent to-[#00FFB3]/6 opacity-40" />
                          </div>

                          {/* Search Section */}
                          <div className="pb-2 flex-shrink-0 relative z-10">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search memories..."
                                className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-xl text-white/70 text-sm placeholder-white/40 focus:border-[#A8FF00]/30 focus:outline-none transition-colors input-openmemo"
                                readOnly
                              />
                              <svg className="absolute left-3 top-2.5 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                          </div>

                          {/* Memories List */}
                          <div className="flex-1 overflow-y-auto min-h-0 space-y-3 relative z-10 extension-scrollbar">
                      {fakeMemories.map((memory) => (
                        <div key={memory.id} className="p-3 bg-white/5 hover:bg-[#A8FF00]/5 border border-white/10 hover:border-[#A8FF00]/20 rounded-xl transition-all duration-200 cursor-pointer group">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-[#A8FF00] rounded-full"></div>
                              <span className="text-[#A8FF00] text-xs font-medium uppercase tracking-wide">
                                {memory.category}
                              </span>
                            </div>
                            <span className="text-white/40 text-xs">
                              {new Date(memory.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-white/80 text-sm leading-relaxed mb-2 group-hover:text-white transition-colors">
                            {memory.content}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-white/40 text-xs">from</span>
                              <span className="text-[#00D4FF] text-xs font-medium">{memory.source}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {(typeof memory.tags === 'string' ? memory.tags.split(',') : memory.tags).slice(0, 2).map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 bg-white/10 text-white/60 text-xs rounded-full">
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                          </div>

                          {/* Floating Add Button - Bottom right corner */}
                          <div className="absolute bottom-4 right-4 z-20">
                            <div className="relative group">
                              <button className="w-14 h-14 bg-gradient-to-br from-[#A8FF00] to-[#85CC00] text-black font-medium flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 shadow-lg hover:shadow-[#A8FF00]/30 hover:shadow-2xl relative overflow-hidden">
                                {/* Water drop shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full opacity-60"></div>
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  className="relative z-10"
                                >
                                  <line x1="12" y1="5" x2="12" y2="19" />
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                {/* Ripple effect on hover */}
                                <div className="absolute inset-0 rounded-full bg-white/20 transform scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
                              </button>
                              {/* Glow effect */}
                              <div className="absolute inset-0 rounded-full bg-[#A8FF00]/30 blur-lg scale-110 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Enhanced Glow effect */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#A8FF00]/10 via-[#00D4FF]/5 to-[#A8FF00]/10 blur-3xl rounded-full opacity-60"></div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
      
      {/* Custom scrollbar styling for extension preview */}
      <style jsx>{`
        .extension-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .extension-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .extension-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #A8FF00 0%, #85CC00 100%);
          border-radius: 3px;
          opacity: 0.8;
        }
        .extension-scrollbar::-webkit-scrollbar-thumb:hover {
          opacity: 1;
          background: linear-gradient(135deg, #A8FF00 0%, #85CC00 100%);
        }
        /* Firefox */
        .extension-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #A8FF00 rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
