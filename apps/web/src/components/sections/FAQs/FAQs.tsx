"use client";
import { useState } from "react";
import { FadeIn, StaggerContainer, GlowCard, WaterDrop } from "@repo/ui";

export default function FAQs() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const faqData = [
    {
      id: 1,
      question: "What is OpenMemo?",
      answer: "OpenMemo is a browser extension that gives your AI assistants a persistent memory. It automatically captures and syncs your conversations across 8+ AI platforms, so you never lose context when switching between ChatGPT, Claude, Gemini, and others."
    },
    {
      id: 2,
      question: "How does it work?",
      answer: "Simply install the extension and authenticate with GitHub. OpenMemo runs quietly in the background, automatically capturing your AI conversations and organizing them by category. Your memories sync across all your devices in real-time."
    },
    {
      id: 3,
      question: "Is it completely free?",
      answer: "Yes! OpenMemo is 100% free and open source. There are no premium tiers, subscription fees, or hidden costs. We believe AI memory should be accessible to everyone."
    },
    {
      id: 4,
      question: "Which AI platforms are supported?",
      answer: "ChatGPT, Claude AI, Google Gemini, Perplexity, DeepSeek, Grok, Character.ai, You.com, and more. We're constantly adding support for new platforms based on user requests."
    },
    {
      id: 5,
      question: "Is my data private and secure?",
      answer: "We use GitHub authentication and never share your information with third parties. Your conversations stay private and under your control at all times. All data is stored securely in your GitHub account."
    },
    {
      id: 6,
      question: "Can I export my memories?",
      answer: "Yes! You can export all your memories at any time in various formats. Your data belongs to you, and you're never locked into our platform."
    }
  ];

  const handleQuestionClick = (id: number) =>
    id === activeQuestion ? setActiveQuestion(null) : setActiveQuestion(id);

  return (
    <section id="faq" className="py-16 bg-[#0d0d0d] relative overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <StaggerContainer>
          {/* Section Header */}
          <FadeIn direction="up" delay={0}>
            <div className="text-center mb-12">
              <h2 className="text-white text-3xl font-bold mb-2">
                <span className="text-[#A8FF00]">FAQ</span>
              </h2>
              <div className="w-12 h-0.5 bg-[#A8FF00] mx-auto rounded-full"></div>
            </div>
          </FadeIn>

          {/* FAQ Items - Enhanced Collapsible Design */}
          <div className="grid gap-4">
            {faqData.map((faq, index) => (
              <FadeIn key={faq.id} direction="up" delay={100 + index * 50}>
                <div className={`group bg-white/5 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 ${
                  activeQuestion === faq.id 
                    ? 'border-[#A8FF00]/30 shadow-lg shadow-[#A8FF00]/10' 
                    : 'border-white/10 hover:border-[#A8FF00]/20'
                }`}>
                  <button
                    onClick={() => handleQuestionClick(faq.id)}
                    className="w-full text-left focus:outline-none p-6 hover:bg-white/5 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-white text-lg font-semibold pr-4 group-hover:text-[#A8FF00]/90 transition-colors">
                        {faq.question}
                      </h3>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        activeQuestion === faq.id 
                          ? 'border-[#A8FF00] bg-[#A8FF00] rotate-45 scale-110' 
                          : 'border-[#A8FF00]/50 group-hover:border-[#A8FF00] group-hover:bg-[#A8FF00]/10'
                      }`}>
                        <svg 
                          className={`w-4 h-4 transition-all duration-300 ${
                            activeQuestion === faq.id ? 'text-black rotate-45' : 'text-[#A8FF00]'
                          }`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  
                  {/* Answer - Improved collapsible animation */}
                  <div className={`overflow-hidden transition-all duration-500 ease-out ${
                    activeQuestion === faq.id ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-6 pb-6 pt-0">
                      <div className="border-t border-white/10 pt-4">
                        <p className="text-white/80 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
