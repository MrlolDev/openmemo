import React from 'react';
import { TabNavigation as SharedTabNavigation, type Tab } from '@repo/ui';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <SharedTabNavigation
      activeTab={activeTab}
      onTabChange={onTabChange}
      appName="extension"
    />
  );
};

export default TabNavigation;
export type { Tab };