import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface MemoryEmbedding {
  id: string;
  embedding: number[];
  content: string;
  category: string;
  tags: string;
  createdAt: string;
}

interface VectorSearchResult {
  id: string;
  content: string;
  category: string;
  tags: string;
  createdAt: string;
  similarity: number;
}

export class VectorService {
  private embeddings: Map<string, MemoryEmbedding> = new Map();

  /**
   * Generate embeddings using Groq API
   * Since Groq doesn't have a native embeddings endpoint, we'll use a workaround
   * by generating semantic features through the chat API
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Use a lightweight approach: generate semantic keywords and convert to vectors
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Extract exactly 50 semantic keywords/concepts from the following text. Return them as a single line, separated by commas. Focus on:
- Key concepts and topics
- Entities (people, places, organizations)
- Actions and verbs
- Descriptive adjectives
- Technical terms
- Emotional context
- Time-related terms
- Categories and classifications

Make sure to return exactly 50 keywords, padding with related concepts if needed.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.1,
        max_tokens: 300,
      });

      const keywords = completion.choices[0]?.message?.content?.trim() || '';
      
      // Convert keywords to a simple vector representation
      return this.keywordsToVector(keywords, text);
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Fallback to a simple text-based vector
      return this.textToSimpleVector(text);
    }
  }

  /**
   * Convert keywords and text to a vector representation
   */
  private keywordsToVector(keywords: string, originalText: string): number[] {
    const vector = new Array(100).fill(0);
    
    // Split keywords and original text
    const keywordList = keywords.toLowerCase().split(',').map(k => k.trim());
    const textWords = originalText.toLowerCase().split(/\s+/);
    
    // Create a hash-based vector from keywords and text
    [...keywordList, ...textWords].forEach((word, index) => {
      if (word.length > 2) { // Skip very short words
        const hash = this.simpleHash(word);
        const pos1 = Math.abs(hash) % 100;
        const pos2 = Math.abs(hash * 31) % 100;
        const pos3 = Math.abs(hash * 17) % 100;
        
        // Weight based on word importance
        const weight = keywordList.includes(word) ? 0.8 : 0.4;
        
        vector[pos1] += weight;
        vector[pos2] += weight * 0.5;
        vector[pos3] += weight * 0.3;
      }
    });
    
    // Normalize the vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      return vector.map(val => val / magnitude);
    }
    
    return vector;
  }

  /**
   * Fallback: convert text to simple vector
   */
  private textToSimpleVector(text: string): number[] {
    const vector = new Array(100).fill(0);
    const words = text.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      if (word.length > 2) {
        const hash = this.simpleHash(word);
        const pos = Math.abs(hash) % 100;
        vector[pos] += 1;
      }
    });
    
    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      return vector.map(val => val / magnitude);
    }
    
    return vector;
  }

  /**
   * Simple hash function
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) {
      return 0;
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      magnitudeA += vectorA[i] * vectorA[i];
      magnitudeB += vectorB[i] * vectorB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Add or update memory embedding in vector store
   */
  async addMemory(memory: {
    id: string;
    content: string;
    category: string;
    tags: string;
    createdAt: string;
  }): Promise<void> {
    try {
      const embedding = await this.generateEmbedding(
        `${memory.content} ${memory.category} ${memory.tags}`
      );

      this.embeddings.set(memory.id, {
        id: memory.id,
        embedding,
        content: memory.content,
        category: memory.category,
        tags: memory.tags,
        createdAt: memory.createdAt,
      });
    } catch (error) {
      console.error('Error adding memory to vector store:', error);
    }
  }

  /**
   * Remove memory from vector store
   */
  removeMemory(memoryId: string): void {
    this.embeddings.delete(memoryId);
  }

  /**
   * Search memories using vector similarity
   */
  async searchMemories(
    query: string,
    userId: string,
    limit: number = 10,
    similarityThreshold: number = 0.1
  ): Promise<VectorSearchResult[]> {
    try {
      if (this.embeddings.size === 0) {
        return [];
      }

      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(query);

      // Calculate similarities and sort
      const similarities: VectorSearchResult[] = [];

      for (const [memoryId, memoryEmbedding] of this.embeddings.entries()) {
        const similarity = this.cosineSimilarity(queryEmbedding, memoryEmbedding.embedding);
        
        if (similarity >= similarityThreshold) {
          similarities.push({
            id: memoryEmbedding.id,
            content: memoryEmbedding.content,
            category: memoryEmbedding.category,
            tags: memoryEmbedding.tags,
            createdAt: memoryEmbedding.createdAt,
            similarity,
          });
        }
      }

      // Sort by similarity (highest first) and limit results
      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

    } catch (error) {
      console.error('Error searching memories with vectors:', error);
      return [];
    }
  }

  /**
   * Initialize vector store with existing memories
   */
  async initializeFromMemories(memories: any[]): Promise<void> {
    console.log(`Initializing vector store with ${memories.length} memories...`);
    
    for (const memory of memories) {
      await this.addMemory({
        id: memory.id,
        content: memory.content,
        category: memory.category,
        tags: memory.tags || '',
        createdAt: memory.createdAt.toISOString(),
      });
    }
    
    console.log(`Vector store initialized with ${this.embeddings.size} embeddings`);
  }

  /**
   * Get statistics about the vector store
   */
  getStats(): {
    totalEmbeddings: number;
    memoryIds: string[];
  } {
    return {
      totalEmbeddings: this.embeddings.size,
      memoryIds: Array.from(this.embeddings.keys()),
    };
  }

  /**
   * Find similar memories to a given memory
   */
  async findSimilarMemories(
    memoryId: string,
    limit: number = 5,
    similarityThreshold: number = 0.3
  ): Promise<VectorSearchResult[]> {
    const targetMemory = this.embeddings.get(memoryId);
    if (!targetMemory) {
      return [];
    }

    const similarities: VectorSearchResult[] = [];

    for (const [id, memoryEmbedding] of this.embeddings.entries()) {
      if (id === memoryId) continue; // Skip the target memory itself

      const similarity = this.cosineSimilarity(
        targetMemory.embedding,
        memoryEmbedding.embedding
      );

      if (similarity >= similarityThreshold) {
        similarities.push({
          id: memoryEmbedding.id,
          content: memoryEmbedding.content,
          category: memoryEmbedding.category,
          tags: memoryEmbedding.tags,
          createdAt: memoryEmbedding.createdAt,
          similarity,
        });
      }
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }
}

// Export singleton instance
export const vectorService = new VectorService();