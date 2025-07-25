"use client";

import { GlowCard, FadeIn, StaggerContainer } from "@repo/ui";

export default function About() {
  return (
    <section id="about" className="py-24 bg-[#0d0d0d] relative">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#A8FF00]/5 to-transparent" />
        <div className="absolute top-20 left-8 w-8 h-10 water-drop-primary opacity-10 floating-drop" style={{ animationDelay: "3s" }} />
        <div className="absolute bottom-32 right-12 w-6 h-8 water-drop-primary opacity-8 floating-drop" style={{ animationDelay: "5s" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <StaggerContainer>
          {/* Section Header */}
          <FadeIn direction="up" delay={0}>
            <div className="text-center mb-16">
              <h2 className="text-white text-4xl font-bold mb-4">
                Open Source <span className="text-[#A8FF00]">Philosophy</span>
              </h2>
              <div className="flex justify-center mb-6">
                <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-[#A8FF00] to-transparent" />
              </div>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                100% free and open source. No tracking, no limits, no surprises.
              </p>
            </div>
          </FadeIn>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Why OpenMemo */}
            <FadeIn direction="up" delay={200}>
              <GlowCard size="lg" className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#A8FF00]">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                  <h3 className="text-white text-2xl font-bold">Why OpenMemo?</h3>
                </div>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Built with transparency and community collaboration. We believe AI memory tools should be accessible to everyone, always.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: "❤️", title: "Community Driven", desc: "Built by developers, for developers" },
                    { icon: "🔒", title: "Privacy First", desc: "Your data stays private, no tracking" },
                    { icon: "🚀", title: "Always Free", desc: "No premium tiers, no hidden costs" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                        <p className="text-white/60 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </FadeIn>

            {/* Supported Platforms */}
            <FadeIn direction="up" delay={400}>
              <GlowCard size="lg" className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#A8FF00]">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="M10 4v4"/>
                    <path d="M14 4v4"/>
                    <path d="M4 8h16"/>
                  </svg>
                  <h3 className="text-white text-2xl font-bold">Universal Support</h3>
                </div>
                <p className="text-white/70 mb-6">
                  Works seamlessly across all major AI platforms:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "ChatGPT", color: "#10B981" },
                    { name: "Claude AI", color: "#F59E0B" },
                    { name: "Google Gemini", color: "#3B82F6" },
                    { name: "Perplexity", color: "#8B5CF6" },
                    { name: "DeepSeek", color: "#06B6D4" },
                    { name: "Grok", color: "#EAB308" },
                    { name: "T3.chat", color: "#10B981" },
                    { name: "Delphi AI", color: "#6366F1" }
                  ].map((platform, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: platform.color }} />
                      <span className="text-white/80 text-sm font-medium">{platform.name}</span>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </FadeIn>
          </div>

          {/* Call to Action */}
          <FadeIn direction="up" delay={600}>
            <div className="text-center">
              <h3 className="text-white text-2xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Join thousands of users who never lose context in their AI conversations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://github.com/MrlolDev/openmemo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#A8FF00]/10 hover:bg-[#A8FF00]/20 border border-[#A8FF00]/30 rounded-xl text-[#A8FF00] hover:text-[#85CC00] transition-all duration-300 font-medium"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View on GitHub
                </a>
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <span>Made with</span>
                  <span className="text-red-400">❤️</span>
                  <span>by</span>
                  <a href="https://twitter.com/mrloldev" target="_blank" rel="noopener noreferrer" className="text-[#A8FF00] hover:text-[#85CC00] transition-colors">
                    @mrloldev
                  </a>
                  <span>&</span>
                  <a href="https://twitter.com/disamdev" target="_blank" rel="noopener noreferrer" className="text-[#A8FF00] hover:text-[#85CC00] transition-colors">
                    @disamdev
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </StaggerContainer>
      </div>
    </section>
  );
}