// Version and update management service for OpenMemo extension

export interface VersionInfo {
  current_version: string;
  install_date?: string;
  last_update?: string;
  previous_version?: string;
  first_run: boolean;
}

export interface UpdateStatus {
  hasUpdate: boolean;
  isFirstRun: boolean;
  isRecentUpdate: boolean;
  updateMessage?: string;
}

class VersionService {
  private versionInfo: VersionInfo | null = null;

  /**
   * Get version information from background script
   */
  async getVersionInfo(): Promise<VersionInfo> {
    if (this.versionInfo) {
      return this.versionInfo;
    }

    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: "GET_VERSION_INFO" },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }
          
          this.versionInfo = response;
          resolve(response);
        }
      );
    });
  }

  /**
   * Check if this is a first run or recent update
   */
  async getUpdateStatus(): Promise<UpdateStatus> {
    const info = await this.getVersionInfo();
    
    const isFirstRun = info.first_run;
    const isRecentUpdate = !!info.last_update && this.isRecentUpdate(info.last_update);
    
    let updateMessage = '';
    if (isFirstRun) {
      updateMessage = `Welcome to OpenMemo v${info.current_version}! 🎉`;
      // Clear first_run flag immediately after checking to prevent repeated notifications
      this.clearFirstRunFlag();
    } else if (isRecentUpdate && info.previous_version) {
      updateMessage = `Updated to v${info.current_version} from v${info.previous_version}`;
    }

    return {
      hasUpdate: isFirstRun || isRecentUpdate,
      isFirstRun,
      isRecentUpdate,
      updateMessage
    };
  }

  /**
   * Check if an update timestamp is recent (within last 24 hours)
   */
  private isRecentUpdate(updateTime: string): boolean {
    const updateDate = new Date(updateTime);
    const now = new Date();
    const hoursDiff = (now.getTime() - updateDate.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff < 24; // Consider updates within 24 hours as "recent"
  }

  /**
   * Clear the extension badge
   */
  async clearBadge(): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: "CLEAR_BADGE" },
        () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }
          resolve();
        }
      );
    });
  }

  /**
   * Clear the first_run flag to prevent repeated notifications
   */
  private clearFirstRunFlag(): void {
    chrome.storage.local.set({ 'first_run': false }, () => {
      if (chrome.runtime.lastError) {
        console.error('Failed to clear first_run flag:', chrome.runtime.lastError);
      } else {
        console.log('First run flag cleared');
        // Clear cached version info so next call gets fresh data
        this.versionInfo = null;
      }
    });
  }

  /**
   * Get formatted version display text
   */
  async getVersionDisplay(): Promise<string> {
    const info = await this.getVersionInfo();
    return `v${info.current_version}`;
  }

  /**
   * Get installation date formatted
   */
  async getInstallDate(): Promise<string | null> {
    const info = await this.getVersionInfo();
    if (info.install_date) {
      return new Date(info.install_date).toLocaleDateString();
    }
    return null;
  }

  /**
   * Check if extension was recently installed (within last 7 days)
   */
  async isNewInstallation(): Promise<boolean> {
    const info = await this.getVersionInfo();
    if (!info.install_date) return false;
    
    const installDate = new Date(info.install_date);
    const now = new Date();
    const daysDiff = (now.getTime() - installDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysDiff < 7;
  }
}

export const versionService = new VersionService();