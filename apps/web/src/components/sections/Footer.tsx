import { WaterDrop, FadeIn } from "@repo/ui";
import Link from "next/link";

export default function Footer() {
  const footerLinks = [
    {
      category: "Product",
      links: [
        { text: "Features", href: "#features" },
        { text: "About", href: "#about" },
        { text: "GitHub", href: "https://github.com/MrlolDev/openmemo" }
      ]
    },
    {
      category: "Legal", 
      links: [
        { text: "Privacy Policy", href: "/privacy" },
        { text: "Terms of Service", href: "/terms" }
      ]
    },
    {
      category: "Community",
      links: [
        { text: "Twitter", href: "https://twitter.com/mrloldev" },
        { text: "Discord", href: "#" },
        { text: "Support", href: "mailto:support@openmemo.app" }
      ]
    }
  ];

  return (
    <footer className="bg-[#0d0d0d] border-t border-white/10 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#A8FF00]/3 to-transparent" />
        <div className="absolute bottom-20 left-16 w-4 h-6 water-drop-primary opacity-8 floating-drop" style={{ animationDelay: "3s" }} />
        <div className="absolute bottom-32 right-24 w-6 h-8 water-drop-primary opacity-12 floating-drop" style={{ animationDelay: "5s" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <FadeIn direction="up" delay={0}>
          <div className="grid lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <WaterDrop 
                  size="sm" 
                  className="w-8 h-10"
                  style={{
                    background: "linear-gradient(135deg, #A8FF00 0%, #85CC00 100%)",
                    filter: "drop-shadow(0 0 10px rgba(168, 255, 0, 0.3))"
                  }}
                />
                <span className="text-white text-xl font-bold tracking-tight">
                  OpenMemo
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                The open source AI memory assistant that works across all platforms. 
                Never lose context again.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/MrlolDev/openmemo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-[#A8FF00]/10 border border-white/10 hover:border-[#A8FF00]/30 rounded-xl text-white/70 hover:text-[#A8FF00] transition-all duration-300 text-sm font-medium"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Star on GitHub
                </a>
              </div>
            </div>

            {/* Links Sections */}
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                  {section.category}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.href.startsWith('http') ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/60 hover:text-[#A8FF00] transition-colors duration-200 text-sm"
                        >
                          {link.text}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-white/60 hover:text-[#A8FF00] transition-colors duration-200 text-sm"
                        >
                          {link.text}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-white/40 text-sm">
                © 2025 OpenMemo. Made with ❤️ by <a href="https://x.com/mrloldev" target="_blank" rel="noopener noreferrer" className="text-[#A8FF00]/80 hover:text-[#A8FF00] transition-colors">@mrloldev</a> and <a href="https://x.com/disamdev" target="_blank" rel="noopener noreferrer" className="text-[#A8FF00]/80 hover:text-[#A8FF00] transition-colors">@disamdev</a>.
              </div>
              <div className="flex items-center gap-1 text-white/40 text-sm">
                <span>Powered by</span>
                <a 
                  href="https://ai.nahcrof.com/home" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#A8FF00] hover:text-[#85CC00] transition-colors"
                >
                  AI
                </a> ✨
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
