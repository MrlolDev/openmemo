import { GlowCard, FadeIn, StaggerContainer, WaterDrop } from "@repo/ui";

export default function Features() {
  const features = [
    {
      title: "Smart Organization",
      subtitle: "AI-powered categorization",
      description: "Your memories are automatically organized by category and tagged intelligently. Find exactly what you need with powerful search and filtering.",
      icon: "🗂️",
      color: "#00D4FF",
      benefits: ["Auto-categorization", "Smart tagging", "Instant search"]
    },
    {
      title: "Privacy First",
      subtitle: "Your data, your control",
      description: "100% open source with GitHub authentication. Your memories are encrypted and never used for training. Complete transparency, zero tracking.",
      icon: "🔒",
      color: "#00FFB3",
      benefits: ["Open source", "End-to-end security", "No tracking"]
    },
    {
      title: "Real-time Sync",
      subtitle: "Always up to date",  
      description: "Changes sync instantly across all your devices and AI platforms. Your memory is always current, whether you're on mobile or desktop.",
      icon: "⚡",
      color: "#A8FF00",
      benefits: ["Instant sync", "Multi-device", "Always current"]
    },
    {
      title: "Context Preservation",
      subtitle: "Never lose the thread",
      description: "Maintains conversation context and relationships between memories. Resume complex discussions exactly where you left off.",
      icon: "🧵",
      color: "#00FFB3", 
      benefits: ["Context linking", "Thread continuity", "Smart recall"]
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#0d0d0d] relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#A8FF00]/3 via-transparent to-[#00D4FF]/3" />
        
        {/* Floating water drops */}
        <div className="absolute top-32 left-16 w-6 h-8 water-drop-primary opacity-15 floating-drop" style={{ animationDelay: "2s" }} />
        <div className="absolute top-64 right-20 w-8 h-10 water-drop-primary opacity-12 floating-drop" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-48 left-24 w-5 h-7 water-drop-primary opacity-18 floating-drop" style={{ animationDelay: "6s" }} />
        <div className="absolute bottom-32 right-16 w-7 h-9 water-drop-primary opacity-10 floating-drop" style={{ animationDelay: "1s" }} />
        
        {/* Subtle light rays */}
        <div className="absolute top-0 left-1/4 w-0.5 h-40 bg-gradient-to-b from-[#A8FF00]/15 to-transparent" />
        <div className="absolute top-0 right-1/3 w-0.5 h-32 bg-gradient-to-b from-[#00D4FF]/12 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <StaggerContainer>
          {/* Section Header */}
          <FadeIn direction="up" delay={0}>
            <div className="text-center mb-20">
              <div className="flex justify-center mb-6">
                <WaterDrop 
                  size="md" 
                  className="w-10 h-12"
                  style={{
                    background: "linear-gradient(135deg, #A8FF00 0%, #85CC00 100%)",
                    filter: "drop-shadow(0 0 20px rgba(168, 255, 0, 0.3))"
                  }}
                />
              </div>
              <h2 className="text-white text-5xl font-bold mb-6">
                Powerful <span className="text-[#A8FF00]">Features</span>
              </h2>
              <p className="text-white/70 text-xl max-w-3xl mx-auto leading-relaxed">
                Everything you need to give your AI a perfect memory, without the complexity
              </p>
            </div>
          </FadeIn>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <FadeIn key={index} direction="up" delay={200 + index * 100}>
                <GlowCard size="lg" className="p-8 h-full group hover:scale-105 transition-all duration-300">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 group-hover:border-[#A8FF00]/30 transition-all duration-300"
                      style={{ boxShadow: `0 0 20px ${feature.color}20` }}
                    >
                      {feature.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-white text-2xl font-bold mb-1 group-hover:text-[#A8FF00] transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-[#A8FF00] text-sm font-medium uppercase tracking-wide">
                          {feature.subtitle}
                        </p>
                      </div>
                      
                      <p className="text-white/70 mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                      
                      {/* Benefits */}
                      <div className="flex flex-wrap gap-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <span 
                            key={benefitIndex}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 text-xs font-medium hover:bg-[#A8FF00]/10 hover:border-[#A8FF00]/30 hover:text-[#A8FF00] transition-all duration-200"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </FadeIn>
            ))}
          </div>

          {/* Stats Section */}
          <FadeIn direction="up" delay={800}>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold text-[#A8FF00] mb-2">8+</div>
                <div className="text-white/60">AI Platforms</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-[#00D4FF] mb-2">100%</div>
                <div className="text-white/60">Open Source</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-[#00FFB3] mb-2">0</div>
                <div className="text-white/60">Tracking</div>
              </div>
            </div>
          </FadeIn>
        </StaggerContainer>
      </div>
    </section>
  );
}
