import React from 'react';

type Tab = 'memories' | 'stats';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
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
          className={`flex-1 px-3 py-2.5 font-medium text-sm ${
            activeTab === tab.id
              ? "tab-water-drop-active"
              : "tab-water-drop"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
export type { Tab };