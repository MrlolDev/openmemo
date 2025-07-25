"use client";

import React from "react";

export type Tab = 'memories' | 'stats';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  appName: "web" | "extension";
}

export function TabNavigation({ activeTab, onTabChange, appName }: TabNavigationProps) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'memories', label: 'Memories' },
    { id: 'stats', label: 'Stats' },
  ];

  return (
    <div className="flex p-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-3 py-2.5 font-medium text-sm transition-all duration-300 rounded-xl ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-[#A8FF00] to-[#85CC00] text-black font-semibold shadow-lg shadow-[#A8FF00]/20"
              : "text-white/70 hover:text-white hover:bg-white/5"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export type { Tab };