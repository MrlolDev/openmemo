import { FadeIn, StaggerContainer, GlowCard, WaterDrop } from "@repo/ui";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      content: "OpenMemo is a game-changer! I can finally have consistent conversations across different AI platforms. The memory sync is seamless.",
      author: "Alex Chen",
      role: "Software Engineer",
      avatar: "👨‍💻",
      platform: "ChatGPT & Claude"
    },
    {
      id: 2,
      content: "I love how OpenMemo remembers my project context. No more repeating myself when switching between AIs. It's like having a personal assistant!",
      author: "Sarah Rodriguez",
      role: "Product Manager", 
      avatar: "👩‍💼",
      platform: "Gemini & Perplexity"
    },
    {
      id: 3,
      content: "The fact that it's completely free and open source makes it even better. My memories are secure and I have full control over my data.",
      author: "David Kim",
      role: "Data Scientist",
      avatar: "👨‍🔬", 
      platform: "Claude & DeepSeek"
    },
    {
      id: 4,
      content: "OpenMemo transformed my research workflow. I can maintain context across multiple AI conversations and never lose track of important insights.",
      author: "Emily Thompson",
      role: "Researcher",
      avatar: "👩‍🎓",
      platform: "ChatGPT & Grok"
    }
  ];

  return (
    <section className="py-24 bg-[#0d0d0d] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00D4FF]/2 via-transparent to-[#A8FF00]/2" />
        <div className="absolute top-40 left-20 w-5 h-7 water-drop-primary opacity-8 floating-drop" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 right-16 w-7 h-9 water-drop-primary opacity-12 floating-drop" style={{ animationDelay: "3s" }} />
        <div className="absolute top-64 right-24 w-4 h-6 water-drop-primary opacity-6 floating-drop" style={{ animationDelay: "5s" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <StaggerContainer>
          {/* Section Header */}
          <FadeIn direction="up" delay={0}>
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <div className="px-4 py-2 bg-[#A8FF00]/10 border border-[#A8FF00]/30 rounded-full">
                  <span className="text-[#A8FF00] text-sm font-medium uppercase tracking-wide">
                    Testimonials
                  </span>
                </div>
              </div>
              <h2 className="text-white text-4xl font-bold mb-6">
                What our <span className="text-[#A8FF00]">community</span> says
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Join thousands of developers, researchers, and professionals who never lose context in their AI conversations
              </p>
            </div>
          </FadeIn>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeIn key={testimonial.id} direction="up" delay={200 + index * 100}>
                <GlowCard size="lg" className="p-6 h-full group hover:scale-105 transition-all duration-300">
                  <div className="flex flex-col h-full">
                    {/* Quote */}
                    <div className="flex-1 mb-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="text-[#A8FF00] text-2xl opacity-60">"</div>
                        <p className="text-white/80 leading-relaxed text-sm">
                          {testimonial.content}
                        </p>
                        <div className="text-[#A8FF00] text-2xl opacity-60 self-end">"</div>
                      </div>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#A8FF00]/10 to-[#00D4FF]/10 rounded-full flex items-center justify-center text-2xl border border-white/10 group-hover:border-[#A8FF00]/30 transition-colors">
                        {testimonial.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-semibold text-sm group-hover:text-[#A8FF00] transition-colors">
                            {testimonial.author}
                          </h4>
                        </div>
                        <p className="text-white/60 text-xs mb-1">{testimonial.role}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-white/40 text-xs">Uses:</span>
                          <span className="text-[#A8FF00] text-xs font-medium">{testimonial.platform}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </FadeIn>
            ))}
          </div>

          {/* Bottom CTA */}
          <FadeIn direction="up" delay={600}>
            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-8 p-6 bg-gradient-to-r from-[#A8FF00]/5 via-[#00D4FF]/5 to-[#A8FF00]/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <WaterDrop 
                    size="sm" 
                    className="w-6 h-8"
                    style={{
                      background: "linear-gradient(135deg, #A8FF00 0%, #85CC00 100%)",
                      filter: "drop-shadow(0 0 10px rgba(168, 255, 0, 0.3))"
                    }}
                  />
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm">Join the community</div>
                    <div className="text-white/60 text-xs">1000+ users and growing</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {['👨‍💻', '👩‍💼', '👨‍🔬', '👩‍🎓', '👨‍🎨'].map((emoji, index) => (
                      <div 
                        key={index}
                        className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm border-2 border-[#0d0d0d]"
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <div className="text-white/60 text-xs">+995 more</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </StaggerContainer>
      </div>
    </section>
  );
}
