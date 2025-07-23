import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface SimilarMemoriesProps {
  memoryId: string;
  onClose: () => void;
}

interface SimilarMemory {
  id: string;
  content: string;
  category: string;
  tags: string;
  createdAt: string;
  similarity: number;
}

const SimilarMemories: React.FC<SimilarMemoriesProps> = ({ memoryId, onClose }) => {
  const [similarMemories, setSimilarMemories] = useState<SimilarMemory[]>([]);
  const [targetMemory, setTargetMemory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSimilarMemories();
  }, [memoryId]);

  const loadSimilarMemories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First, get all memories to find the target memory
      const allMemoriesResult = await apiService.getMemories({ limit: 1000 });
      const targetMemoryData = allMemoriesResult.memories.find(m => m.id === memoryId);
      
      if (!targetMemoryData) {
        setError('Target memory not found');
        return;
      }
      
      setTargetMemory({
        id: targetMemoryData.id,
        content: targetMemoryData.content,
        category: targetMemoryData.category
      });
      
      // Use vector search with the target memory's content to find similar memories
      const vectorResult = await apiService.vectorSearch(targetMemoryData.content, 6, 0.1);
      
      // Filter out the target memory itself and format the results
      const similarMemoriesData = vectorResult.results
        .filter(memory => memory.id !== memoryId)
        .slice(0, 5) // Limit to 5 similar memories
        .map(memory => ({
          id: memory.id,
          content: memory.content,
          category: memory.category,
          tags: memory.tags,
          createdAt: memory.createdAt,
          similarity: memory.similarity
        }));
      
      setSimilarMemories(similarMemoriesData);
    } catch (error) {
      console.error('Failed to load similar memories:', error);
      setError('Failed to find similar memories using vector search');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.7) return 'text-[#A8FF00]';
    if (similarity >= 0.5) return 'text-[#00D4FF]';
    if (similarity >= 0.3) return 'text-[#00FFB3]';
    return 'text-white/60';
  };

  const getSimilarityLabel = (similarity: number) => {
    if (similarity >= 0.7) return 'Very Similar';
    if (similarity >= 0.5) return 'Similar';
    if (similarity >= 0.3) return 'Somewhat Similar';
    return 'Related';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d0d0d] border border-[#A8FF00]/30 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#A8FF00]/20">
          <h3 className="text-lg font-semibold text-white">Similar Memories</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* Target Memory */}
          {targetMemory && (
            <div className="mb-6 p-3 bg-[#A8FF00]/10 border border-[#A8FF00]/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-[#A8FF00] rounded-full" />
                <span className="text-[#A8FF00] text-sm font-medium">Selected Memory</span>
                <span className="text-white/40 text-xs">{targetMemory.category}</span>
              </div>
              <p className="text-white text-sm leading-relaxed">
                {targetMemory.content}
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#A8FF00]/20 border-t-[#A8FF00] rounded-full animate-spin" />
              <span className="ml-3 text-white/60">Finding similar memories...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <div className="text-red-400 mb-2">⚠️ {error}</div>
              <button
                onClick={loadSimilarMemories}
                className="text-[#A8FF00] hover:text-[#A8FF00]/80 text-sm"
              >
                Try again
              </button>
            </div>
          )}

          {/* Similar Memories */}
          {!isLoading && !error && (
            <>
              {similarMemories.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-white/80 text-sm font-medium mb-3">
                    Found {similarMemories.length} similar memories
                  </h4>
                  
                  {similarMemories.map((memory) => (
                    <div
                      key={memory.id}
                      className="p-3 bg-[#1a1a1a] border border-white/10 rounded-lg hover:border-[#A8FF00]/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-white/60 text-xs">{memory.category}</span>
                          <span className="text-white/40 text-xs">•</span>
                          <span className="text-white/40 text-xs">{formatDate(memory.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className={`text-xs font-medium ${getSimilarityColor(memory.similarity)}`}>
                            {getSimilarityLabel(memory.similarity)}
                          </div>
                          <div className="text-white/30 text-xs">
                            ({(memory.similarity * 100).toFixed(0)}%)
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-white/90 text-sm leading-relaxed mb-2">
                        {memory.content}
                      </p>
                      
                      {memory.tags && (
                        <div className="flex flex-wrap gap-1">
                          {memory.tags.split(', ').filter(tag => tag.trim()).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-[#A8FF00]/10 text-[#A8FF00] text-xs rounded"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-white/60 mb-2">🔍 No similar memories found</div>
                  <div className="text-white/40 text-sm">
                    This memory appears to be unique in your collection
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#A8FF00]/20 bg-[#1a1a1a]/30">
          <div className="text-white/40 text-xs text-center">
            ✨ Similar memories found using vector database semantic search
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimilarMemories;