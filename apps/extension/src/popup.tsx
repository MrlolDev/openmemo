import { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { apiService, type Memory, type User } from "./services/api";
import { authService } from "./services/auth";
import { versionService, type UpdateStatus } from "./services/versionService";
import { FIXED_CATEGORIES } from "./constants/categories";
import LoadingScreen from "./components/LoadingScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import PopupHeader from "./components/PopupHeader";
// CategoryTabs now imported inside MemoriesTab
import MemoriesTab from "./components/MemoriesTab";
import PopupFooter from "./components/PopupFooter";
// AboutScreen removed - now redirects to web
import SimilarMemories from "./components/SimilarMemories";
import "./styles/globals.css";

console.log("OpenMemo: Popup script loaded");

const App = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [newMemory, setNewMemory] = useState({
    content: "",
    category: "Let AI decide",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthInProgress, setIsAuthInProgress] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [categories] = useState<string[]>([...FIXED_CATEGORIES]);
  // Remove activeTab state since we only have memories now
  const [usageStats, setUsageStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  // showAbout removed - now redirects to web
  const [, setVectorStoreInitialized] = useState(false);
  const [showSimilarMemories, setShowSimilarMemories] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  const filteredMemories = memories.filter((memory) => {
    const matchesSearch =
      memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || memory.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    // Listen for OAuth callback messages
    const handleMessage = (message: any) => {
      console.log("OpenMemo: Popup received message:", message);
      if (message.type === "OAUTH_CALLBACK") {
        console.log("OpenMemo: OAuth callback received in popup, re-checking auth");
        // Re-check auth after OAuth callback
        setTimeout(checkAuth, 1000);
      }
    };

    // Listen for auth state changes from the auth service
    const unsubscribeAuth = authService.onAuthStateChanged((authState) => {
      console.log("OpenMemo: Popup received auth state change:", authState);
      setIsAuthenticated(authState.isAuthenticated);
      setUser(authState.user);
      
      // Clear initialization state once we get our first auth state
      setIsInitializing(false);
      
      // Clear auth in progress when we get a definitive state
      if (authState.isAuthenticated || (!authState.isAuthenticated && !isLoading)) {
        setIsAuthInProgress(false);
      }
      
      if (authState.isAuthenticated && authState.user) {
        // Initialize vector store first, then load memories
        initializeVectorStore().then(() => {
          loadMemories();
        });
      } else {
        setMemories([]);
        setVectorStoreInitialized(false);
      }
    });

    chrome.runtime.onMessage.addListener(handleMessage);

    // Initial auth check with a small delay to ensure auth service is ready
    setTimeout(() => {
      checkAuth();
      checkForUpdates();
    }, 100);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
      unsubscribeAuth();
    };
  }, []);

  const checkForUpdates = useCallback(async () => {
    try {
      const status = await versionService.getUpdateStatus();
      setUpdateStatus(status);
      
      if (status.hasUpdate && status.updateMessage) {
        setShowUpdateNotification(true);
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setShowUpdateNotification(false);
          versionService.clearBadge(); // Clear any badge
        }, 5000);
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      console.log("OpenMemo: Starting auth check...");
      const authState = authService.getAuthState();
      console.log("OpenMemo: Auth state:", authState);
      setIsAuthenticated(authState.isAuthenticated);

      if (authState.isAuthenticated && authState.user) {
        console.log("OpenMemo: User authenticated:", authState.user);
        setUser(authState.user);
        await initializeVectorStore();
        await loadMemories();
      }
    } catch (error) {
      console.error("OpenMemo: Auth check failed:", error);
      if (error instanceof Error) {
        console.error("OpenMemo: Error details:", error.message);
      }
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      console.log("OpenMemo: Auth check completed");
    }
  }, []);

  const initializeVectorStore = useCallback(async () => {
    // Vector store is now automatically managed by the API
    // Just mark as initialized for UI purposes
    setVectorStoreInitialized(true);
    return Promise.resolve();
  }, []);

  const loadMemories = useCallback(async () => {
    try {
      const result = await apiService.getMemories({
        query: searchTerm || undefined,
        limit: 50,
        extractNewMemories: false, // Only extract when explicitly searching
      });
      
      // Filter memories by category on the client side since API doesn't support category filtering anymore
      let filteredMemories = result.memories;
      if (selectedCategory !== "All") {
        filteredMemories = result.memories.filter(memory => memory.category === selectedCategory);
      }
      
      setMemories(filteredMemories);
      
      // Log search type for debugging
      if (result.searchType) {
        console.log(`OpenMemo: Used ${result.searchType} search`);
      }
    } catch (error) {
      console.error("Failed to load memories:", error);
    }
  }, [selectedCategory, searchTerm]);

  // Categories are now fixed - no need to load them dynamically

  const loadUsageStats = useCallback(async () => {
    if (!isAuthenticated || loadingStats) return;

    try {
      setLoadingStats(true);
      const stats = await apiService.getUsageStats();
      setUsageStats(stats);
    } catch (error) {
      console.error("Failed to load usage statistics:", error);
    } finally {
      setLoadingStats(false);
    }
  }, [isAuthenticated, loadingStats]);

  // Load stats when authenticated
  useEffect(() => {
    if (isAuthenticated && !usageStats) {
      loadUsageStats();
    }
  }, [isAuthenticated, loadUsageStats, usageStats]);

  const addMemory = async () => {
    if (!newMemory.content.trim()) return;

    try {
      let finalCategory = newMemory.category;
      
      // If "Let AI decide" is selected, use General as fallback since auto-categorization is now handled by the API
      if (newMemory.category === "Let AI decide") {
        finalCategory = "General"; // AI will categorize automatically when creating the memory
      }

      await apiService.createMemory({
        content: newMemory.content,
        category: finalCategory,
        source: "manual",
      });

      await loadMemories();
      setNewMemory({ content: "", category: "Let AI decide" });
      setIsAddingMemory(false);
    } catch (error) {
      console.error("Failed to add memory:", error);
    }
  };

  const deleteMemory = async (id: string) => {
    try {
      await apiService.deleteMemory(id);
      await loadMemories();
    } catch (error) {
      console.error("Failed to delete memory:", error);
    }
  };

  const handleGithubAuth = async () => {
    try {
      console.log("OpenMemo: Starting GitHub authentication...");
      setIsAuthInProgress(true);
      await authService.startAuth('github');
      // Auth state changes will be handled by the global listener
    } catch (error) {
      console.error('GitHub auth error:', error);
      setIsAuthInProgress(false);
      // Show error message to user
      alert('Authentication failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      setMemories([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading || isInitializing) {
    return <LoadingScreen />;
  }

  if (isAuthInProgress) {
    return (
      <LoadingScreen 
        message="Authenticating with GitHub..."
        submessage="Please complete the authentication in the popup window"
      />
    );
  }

  if (!isAuthenticated) {
    return <WelcomeScreen onSignInClick={handleGithubAuth} />;
  }

  // About screen removed - now redirects to web via PopupFooter

  return (
    <div className="w-full h-full bg-[#0d0d0d] relative overflow-hidden flex flex-col m-0 p-0 animate-slide-in-left">
      {/* Enhanced Background matching WelcomeScreen */}
      <div className="absolute inset-0">
        {/* Main Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#A8FF00]/8 via-[#0d0d0d] via-40% to-[#A8FF00]/4 pointer-events-none" />

        {/* Strategic Water Drop Placement - Elegant Green Theme */}
        <div className="absolute top-12 right-16 w-14 h-18 water-drop-primary opacity-20 floating-drop" />
        <div
          className="absolute top-48 left-8 w-10 h-13 water-drop-primary opacity-15 floating-drop"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-12 w-16 h-20 water-drop-primary opacity-25 floating-drop"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute bottom-48 left-16 w-12 h-15 water-drop-primary opacity-12 floating-drop"
          style={{ animationDelay: "6s" }}
        />
        <div
          className="absolute top-64 right-6 w-8 h-10 water-drop-primary opacity-10 floating-drop"
          style={{ animationDelay: "1s" }}
        />

        {/* Subtle Light Rays */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-32 bg-gradient-to-b from-[#A8FF00]/20 to-transparent" />
        <div className="absolute top-0 left-1/3 w-0.5 h-24 bg-gradient-to-b from-[#A8FF00]/15 to-transparent" />
        <div className="absolute top-0 right-1/3 w-0.5 h-20 bg-gradient-to-b from-[#A8FF00]/10 to-transparent" />

        {/* Water surface effect at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 water-surface pointer-events-none" />
      </div>

      {/* Content Container - Full height with proper spacing */}
      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        {/* Header Section */}
        <div className="px-6 py-4">
          <PopupHeader 
            user={user} 
            onLogout={handleLogout}
            usageStats={usageStats}
            loadingStats={loadingStats}
            onRefreshStats={loadUsageStats}
          />
        </div>

        {/* Main Content Area - Full height */}
        <div className="flex-1 overflow-hidden min-h-0">
          <MemoriesTab
            memories={memories}
            filteredMemories={filteredMemories}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            categories={categories}
            isAddingMemory={isAddingMemory}
            newMemory={newMemory}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onAddMemoryClick={() => setIsAddingMemory(true)}
            onDeleteMemory={deleteMemory}
            onSaveMemory={addMemory}
            onCancelAddMemory={() => {
              setIsAddingMemory(false);
              setNewMemory({ content: "", category: "Let AI decide" });
            }}
            onNewMemoryChange={setNewMemory}
            onFindSimilar={setShowSimilarMemories}
          />
        </div>

        {/* Footer */}
        <PopupFooter />
      </div>

      {/* Update Notification */}
      {showUpdateNotification && updateStatus?.updateMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-gradient-to-r from-[#A8FF00] to-[#85CC00] text-black px-4 py-3 rounded-lg shadow-2xl max-w-sm">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              <div className="flex-1">
                <p className="font-medium text-sm">{updateStatus.updateMessage}</p>
                {updateStatus.isFirstRun && (
                  <p className="text-xs opacity-80 mt-1">Thanks for installing OpenMemo!</p>
                )}
              </div>
              <button
                onClick={() => setShowUpdateNotification(false)}
                className="text-black/70 hover:text-black/90 p-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Similar Memories Modal */}
      {showSimilarMemories && (
        <SimilarMemories
          memoryId={showSimilarMemories}
          onClose={() => setShowSimilarMemories(null)}
        />
      )}
    </div>
  );
};

// Initialize the popup
console.log("OpenMemo: Initializing popup...");
const container = document.getElementById("popup-root");
console.log("OpenMemo: Container found:", !!container);
if (container) {
  console.log("OpenMemo: Creating React root...");
  const root = createRoot(container);
  console.log("OpenMemo: Rendering App...");
  root.render(<App />);
} else {
  console.error("OpenMemo: popup-root element not found!");
}
