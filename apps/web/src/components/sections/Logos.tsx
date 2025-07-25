"use client";
import { FadeIn } from "@repo/ui";
import Image from "next/image";
import { useState } from "react";

export default function Logos() {
  // Expanded list of AI platforms, including all from the roadmap
  const aiPlatforms = [
    {
      name: "ChatGPT",
      color: "#10A37F",
      icon: "🤖",
      logo: "/logos/chatgpt.png",
    },
    {
      name: "Claude",
      color: "#FF8C00",
      icon: "🧠",
      logo: "/logos/claude.png",
    },
    {
      name: "T3 Chat",
      color: "#10B981",
      icon: "💬",
      logo: "/logos/t3chat.webp",
    },
    {
      name: "DeepSeek",
      color: "#06B6D4",
      icon: "🌊",
      logo: "/logos/deepseek.webp",
    },
    {
      name: "Grok",
      color: "#EAB308",
      icon: "⚡",
      logo: "/logos/grok.png",
    },
    {
      name: "Perplexity",
      color: "#8B5CF6",
      icon: "🔍",
      logo: "/logos/perplexity.png",
    },
    {
      name: "Google Gemini",
      color: "#4285F4",
      icon: "✨",
      logo: "/logos/gemini.png",
    },
    {
      name: "Delphi",
      color: "#6366F1",
      icon: "🎯",
      logo: "/logos/delphi.webp",
    },
    {
      name: "Groq",
      color: "#FF4A4A",
      icon: "🚀",
      logo: "/logos/groq.webp",
    },
    {
      name: "Qwen",
      color: "#00B3FF",
      icon: "🦄",
      logo: "/logos/qwen.webp",
    },
    {
      name: "Kimi",
      color: "#00D4FF",
      icon: "🧩",
      logo: "/logos/kimi.webp",
    },
    {
      name: "Copilot",
      color: "#24292F",
      icon: "👨‍💻",
      logo: "/logos/copilot.webp",
    },
    {
      name: "Poe",
      color: "#8B5CF6",
      icon: "🦉",
      logo: "/logos/poe.webp",
    },
    {
      name: "Le Chat",
      color: "#F472B6",
      icon: "🐱",
      logo: "/logos/lechat.webp",
    },
    {
      name: "YouChat",
      color: "#EC4899",
      icon: "🔮",
      logo: "/logos/you.webp",
    },
    {
      name: "Character.ai",
      color: "#F59E0B",
      icon: "🎭",
      logo: "/logos/character.webp",
    },
    {
      name: "Meta AI",
      color: "#1877F2",
      icon: "🌐",
      logo: "/logos/metaai.webp",
    },
  ];

  // Component to handle image with fallback
  const PlatformLogo = ({
    platform,
    className,
  }: {
    platform: (typeof aiPlatforms)[0];
    className?: string;
  }) => {
    const [imageError, setImageError] = useState(false);

    if (imageError || !platform.logo) {
      return (
        <span
          className={`text-2xl group-hover:scale-110 transition-transform duration-300 flex items-center gap-2 ${className}`}
          style={{ color: platform.color }}
        >
          {platform.icon}
          <span className="font-medium text-sm">{platform.name}</span>
        </span>
      );
    }

    return (
      <Image
        src={platform.logo}
        alt={`${platform.name} logo`}
        width={120}
        height={48}
        className={`group-hover:scale-110 transition-transform duration-300 ${className}`}
        style={{ objectFit: "contain" }}
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <section className="py-16 bg-[#0d0d0d] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#A8FF00]/3 via-transparent to-[#00D4FF]/3" />

      <div className="relative z-10">
        <FadeIn direction="up" delay={0}>
          <div className="text-center mb-12">
            <p className="text-white/60 text-sm uppercase tracking-wide font-medium mb-4">
              Works seamlessly with
            </p>
            <h3 className="text-white text-2xl font-bold">
              <span className="text-[#A8FF00]">Universal</span> AI Memory
            </h3>
          </div>
        </FadeIn>

        {/* Animated Marquee */}
        <div className="relative">
          {/* Gradient masks for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0d0d0d] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0d0d0d] to-transparent z-10" />

          {/* Scrolling container */}
          <div className="flex animate-marquee gap-8 py-4">
            {/* First set */}
            {aiPlatforms.map((platform, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300 whitespace-nowrap min-w-fit group"
              >
                <PlatformLogo platform={platform} />
              </div>
            ))}

            {/* Duplicate for seamless loop */}
            {aiPlatforms.map((platform, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300 whitespace-nowrap min-w-fit group"
              >
                <PlatformLogo platform={platform} />
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <FadeIn direction="up" delay={200}>
          <div className="text-center mt-12">
            <div className="flex items-center justify-center gap-8 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#A8FF00] rounded-full animate-pulse" />
                <span>Real-time sync</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 bg-[#00D4FF] rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                />
                <span>Universal memory</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 bg-[#00FFB3] rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
                <span>Zero setup</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
