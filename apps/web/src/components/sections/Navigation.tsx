import { LogoBrand, WaterDropButton } from "@repo/ui";

const navigationLinks = [
  { id: 1, link: "Features", href: "#features" },
  { id: 2, link: "About", href: "#about" },
  { id: 3, link: "FAQ", href: "#faq" }
];

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0d0d0d]/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            className="group hover:scale-105 transition-transform duration-300"
            href="#"
          >
            <LogoBrand 
              size="md" 
              className="group-hover:scale-110 transition-all duration-300" 
              appName="web"
            />
          </a>

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="text-white/80 hover:text-[#A8FF00] transition-colors duration-300 font-medium relative group"
                >
                  {link.link}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#A8FF00] group-hover:w-full transition-all duration-300" />
                </a>
              </li>
            ))}
          </ul>

          {/* Get Started Button */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/yourusername/openmemo"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#A8FF00]/30 rounded-xl text-white/80 hover:text-[#A8FF00] transition-all duration-300 font-medium backdrop-blur-sm"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
            
            <WaterDropButton 
              size="md" 
              className="px-6 py-2 font-semibold"
              appName="web"
            >
              Get Started
            </WaterDropButton>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-white/80 hover:text-[#A8FF00] transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
