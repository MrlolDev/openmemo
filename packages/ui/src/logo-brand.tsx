"use client";
interface LogoBrandProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
  appName?: string;
}

export function LogoBrand({
  className = "",
  size = "sm",
  showStatus = false,
  appName,
}: LogoBrandProps) {
  const sizeClasses = {
    sm: { width: "56px", height: "64px" },
    md: { width: "56px", height: "64px" },
    lg: { width: "56px", height: "64px" },
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="logo-drop floating-drop relative"
        style={{
          ...sizeClasses[size],
          background:
            "linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(38, 38, 38, 0.8) 100%)",
          border: "2px solid rgba(168, 255, 0, 0.4)",
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          boxShadow:
            "0 8px 32px rgba(168, 255, 0, 0.2), inset 0 2px 10px rgba(168, 255, 0, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Highlight effect - mimics ::before pseudo-element */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "25%",
            width: "35%",
            height: "35%",
            background: "rgba(168, 255, 0, 0.15)",
            borderRadius: "50%",
            filter: "blur(4px)",
          }}
        />
        <img
          src="/logo.png"
          alt="OpenMemo"
          className="absolute inset-0 w-full h-full object-contain opacity-90 z-10"
          onError={(e) => {
            // Fallback if logo doesn't load - logo stays visible with gradient background
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
      <span
        className={`text-white font-bold tracking-tight ${textSizes[size]}`}
      >
        {"OpenMemo"}
      </span>
      {showStatus && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-[#A8FF00] rounded-full animate-pulse"></div>
          <span className="text-[#A8FF00] text-xs">synced</span>
        </div>
      )}
    </div>
  );
}
