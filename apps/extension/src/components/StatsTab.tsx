import React from 'react';
import { getServiceById } from '../config/services';

interface StatsTabProps {
  loadingStats: boolean;
  usageStats: any;
  onRefreshStats: () => void;
}

const StatsTab: React.FC<StatsTabProps> = ({
  loadingStats,
  usageStats,
  onRefreshStats,
}) => {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-white mb-2">
          Usage Statistics
        </h3>
        <p className="text-white/60 text-sm">
          Your memory usage across all platforms
        </p>
      </div>

      {loadingStats ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="rounded-full h-12 w-12 border-2 border-[#A8FF00]/30 border-t-[#A8FF00] glow-green mx-auto animate-spin" />
        </div>
      ) : usageStats ? (
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card-water-drop p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-[#A8FF00]/20 rounded-xl flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A8FF00"
                  strokeWidth="2"
                >
                  <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4" />
                  <polyline points="7,9 12,4 17,9" />
                  <line x1="12" y1="4" x2="12" y2="14" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {usageStats.totalMemories}
              </div>
              <div className="text-xs text-white/60">Total Memories</div>
            </div>

            <div className="card-water-drop p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-[#00bfff]/20 rounded-xl flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00bfff"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {usageStats.stats.totalQueries}
              </div>
              <div className="text-xs text-white/60">Total Searches</div>
            </div>
          </div>

          {/* Service Usage */}
          {usageStats.serviceUsage && usageStats.serviceUsage.length > 0 && (
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">
                Most Used Services
              </h4>
              <div className="space-y-2">
                {usageStats.serviceUsage
                  .slice(0, 5)
                  .map((stat: any) => {
                    const service = getServiceById(stat.service);
                    return (
                      <div
                        key={stat.service}
                        className="flex items-center justify-between p-3 card-water-drop"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                            style={{
                              backgroundColor: service?.color + '20',
                              color: service?.color,
                            }}
                          >
                            {service?.icon || '🤖'}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">
                              {service?.name || stat.service}
                            </div>
                            <div className="text-white/60 text-xs">
                              {stat.usageCount} uses
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white/80 text-sm">
                            {stat.avgResponseTime}ms
                          </div>
                          <div className="text-white/50 text-xs">avg time</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="p-4 card-water-drop">
            <h4 className="text-white font-semibold text-sm mb-3">
              Recent Activity
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#A8FF00] to-[#85CC00] rounded-xl flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                </svg>
              </div>
              <div>
                <div className="text-white text-lg font-bold">
                  {usageStats.recentActivity}
                </div>
                <div className="text-white/60 text-sm">
                  searches in the last 7 days
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white/40"
              >
                <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4" />
                <polyline points="7,9 12,4 17,9" />
                <line x1="12" y1="4" x2="12" y2="14" />
              </svg>
            </div>
            <p className="text-white/50 text-sm">
              Start using memories to see your statistics
            </p>
            <button
              onClick={onRefreshStats}
              className="mt-4 btn-water-drop-secondary px-6 py-3 text-sm font-medium transition-all duration-300"
            >
              Refresh Stats
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsTab;