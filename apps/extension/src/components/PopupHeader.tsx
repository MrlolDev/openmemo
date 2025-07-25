import React, { useState } from 'react';
import { LogoBrand } from '@repo/ui';
import type { User } from '../services/api';

interface PopupHeaderProps {
  user: User | null;
  onLogout: () => void;
  usageStats?: any;
  loadingStats: boolean;
  onRefreshStats: () => void;
}

const PopupHeader: React.FC<PopupHeaderProps> = ({ 
  user, 
  onLogout, 
  usageStats, 
  loadingStats, 
  onRefreshStats 
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <div className="flex items-center justify-between">
      {/* Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="logo-drop floating-drop">
          <img 
            src="/logo.png" 
            alt="OpenMemo" 
            className="absolute inset-0 w-full h-full object-contain opacity-90"
            onError={(e) => {
              // Fallback if logo doesn't load
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.style.background = 'radial-gradient(ellipse at 30% 20%, #A8FF00, #85CC00)';
              }
            }}
          />
        </div>
        <h1 className="text-lg font-bold text-white">OpenMemo</h1>
      </div>

      {/* Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-all duration-300 cursor-pointer"
        >
          {user?.avatarUrl ? (
            <div className="water-drop-secondary w-8 h-8 flex items-center justify-center overflow-hidden">
              <img
                src={user.avatarUrl}
                alt={user.name || user.email}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-[#A8FF00]/20 rounded-full flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A8FF00"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`text-white/60 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {showProfileDropdown && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in-scale">
            {/* User Info */}
            <div className="p-4 border-b border-white/10">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || user?.email}
              </p>
              <p className="text-xs text-white/60 truncate">
                {user?.email && user.name ? user.email : 'OpenMemo User'}
              </p>
            </div>

            {/* Stats Section */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-white/90">Usage Stats</h4>
                <button
                  onClick={onRefreshStats}
                  className="text-xs text-[#A8FF00] hover:text-[#85CC00] transition-colors cursor-pointer hover:scale-105 active:scale-95"
                  disabled={loadingStats}
                >
                  {loadingStats ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              
              {usageStats ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-white/60">Total Memories</p>
                    <p className="text-white font-semibold">{usageStats.totalMemories || 0}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-white/60">Recent Activity</p>
                    <p className="text-white font-semibold">{usageStats.recentActivity || 0}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-white/60">Click refresh to load stats</p>
              )}
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={() => {
                  onLogout();
                  setShowProfileDropdown(false);
                }}
                className="w-full flex items-center gap-2 p-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showProfileDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </div>
  );
};

export default PopupHeader;