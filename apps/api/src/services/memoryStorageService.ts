import { GitHubService } from './githubService';
import { PrismaClient } from '@prisma/client';
import { generateEmbedding } from './aiService';

const prisma = new PrismaClient();

export interface MemoryData {
  id: string;
  content: string;
  category: string;
  source: string;
  tags: string;
  embedding?: number[];
  createdAt: string;
  updatedAt: string;
}

export class MemoryStorageService {
  private githubService: GitHubService;
  
  constructor(githubService: GitHubService) {
    this.githubService = githubService;
  }

  /**
   * Create a new memory with hybrid storage
   */
  async createMemory(userId: string, memoryData: Omit<MemoryData, 'id' | 'createdAt' | 'updatedAt'>): Promise<MemoryData> {
    const memoryId = this.generateMemoryId();
    const now = new Date().toISOString();
    
    // Generate embedding for the content
    const embedding = await generateEmbedding(memoryData.content);
    
    const fullMemory: MemoryData = {
      id: memoryId,
      content: memoryData.content,
      category: memoryData.category,
      source: memoryData.source,
      tags: memoryData.tags,
      embedding,
      createdAt: now,
      updatedAt: now
    };

    try {
      // Save full memory data to GitHub
      await this.githubService.saveMemory(userId, fullMemory);

      // Save metadata and embedding to database
      const dbMemory = await prisma.memory.create({
        data: {
          id: memoryId,
          category: memoryData.category,
          source: memoryData.source,
          tags: memoryData.tags,
          userId,
          embedding: {
            create: {
              embedding,
              dimensions: embedding.length,
              model: 'multilingual-e5-large-instruct'
            }
          }
        },
        include: {
          embedding: true
        }
      });

      return fullMemory;
    } catch (error) {
      console.error('Error creating memory:', error);
      throw new Error('Failed to create memory');
    }
  }

  /**
   * Retrieve a memory by ID
   */
  async getMemory(userId: string, memoryId: string): Promise<MemoryData | null> {
    try {
      // Check if memory exists in database
      const dbMemory = await prisma.memory.findFirst({
        where: {
          id: memoryId,
          userId
        }
      });

      if (!dbMemory) {
        return null;
      }

      // Retrieve full memory content from GitHub
      const fullMemory = await this.githubService.getMemory(userId, memoryId);
      return fullMemory;
    } catch (error) {
      console.error('Error retrieving memory:', error);
      return null;
    }
  }

  /**
   * Update an existing memory
   */
  async updateMemory(userId: string, memoryId: string, updates: Partial<Omit<MemoryData, 'id' | 'createdAt'>>): Promise<MemoryData | null> {
    try {
      // Get existing memory
      const existingMemory = await this.getMemory(userId, memoryId);
      if (!existingMemory) {
        return null;
      }

      // Merge updates
      const updatedMemory: MemoryData = {
        ...existingMemory,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // If content changed, regenerate embedding
      if (updates.content && updates.content !== existingMemory.content) {
        updatedMemory.embedding = await generateEmbedding(updates.content);
      }

      // Save updated memory to GitHub
      await this.githubService.saveMemory(userId, updatedMemory);

      // Update database metadata and embedding if changed
      const updateData: any = {};
      if (updates.category) updateData.category = updates.category;
      if (updates.source) updateData.source = updates.source;
      if (updates.tags) updateData.tags = updates.tags;
      updateData.updatedAt = new Date();

      const dbUpdateData: any = { ...updateData };
      
      if (updatedMemory.embedding && updatedMemory.embedding !== existingMemory.embedding) {
        dbUpdateData.embedding = {
          update: {
            embedding: updatedMemory.embedding,
            dimensions: updatedMemory.embedding.length,
            updatedAt: new Date()
          }
        };
      }

      await prisma.memory.update({
        where: {
          id: memoryId,
          userId
        },
        data: dbUpdateData
      });

      return updatedMemory;
    } catch (error) {
      console.error('Error updating memory:', error);
      throw new Error('Failed to update memory');
    }
  }

  /**
   * Delete a memory
   */
  async deleteMemory(userId: string, memoryId: string): Promise<boolean> {
    try {
      // Delete from GitHub
      await this.githubService.deleteMemory(userId, memoryId);

      // Delete from database (this will cascade delete the embedding)
      await prisma.memory.delete({
        where: {
          id: memoryId,
          userId
        }
      });

      return true;
    } catch (error) {
      console.error('Error deleting memory:', error);
      return false;
    }
  }

  /**
   * List all memories for a user with metadata only
   */
  async listMemories(userId: string, options: {
    category?: string;
    source?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  } = {}): Promise<{ id: string; category: string; source: string; tags: string; createdAt: Date; updatedAt: Date }[]> {
    try {
      const where: any = { userId };
      
      if (options.category) {
        where.category = options.category;
      }
      
      if (options.source) {
        where.source = options.source;
      }
      
      if (options.tags && options.tags.length > 0) {
        // Search for memories that contain any of the specified tags
        where.tags = {
          contains: options.tags[0] // Simple implementation - could be improved with full-text search
        };
      }

      const memories = await prisma.memory.findMany({
        where,
        select: {
          id: true,
          category: true,
          source: true,
          tags: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: options.limit || 50,
        skip: options.offset || 0
      });

      return memories;
    } catch (error) {
      console.error('Error listing memories:', error);
      return [];
    }
  }

  /**
   * Get all memories from GitHub for a user (used for bulk operations)
   */
  async getAllMemoriesFromGitHub(userId: string): Promise<MemoryData[]> {
    try {
      return await this.githubService.getAllMemories(userId);
    } catch (error) {
      console.error('Error getting all memories from GitHub:', error);
      return [];
    }
  }

  /**
   * Search memories using embeddings and retrieve full content
   */
  async searchMemories(userId: string, query: string, limit: number = 10): Promise<MemoryData[]> {
    try {
      // Generate embedding for the search query
      const queryEmbedding = await generateEmbedding(query);

      // Find similar memories using vector search
      const similarMemories = await this.findSimilarMemoriesFromDB(userId, queryEmbedding, limit);

      // Retrieve full content from GitHub for each similar memory
      const fullMemories: MemoryData[] = [];
      
      for (const memory of similarMemories) {
        try {
          const fullMemory = await this.githubService.getMemory(userId, memory.id);
          if (fullMemory) {
            fullMemories.push(fullMemory);
          }
        } catch (error) {
          console.error(`Error retrieving memory ${memory.id} from GitHub:`, error);
          // Continue with other memories
        }
      }

      return fullMemories;
    } catch (error) {
      console.error('Error searching memories:', error);
      return [];
    }
  }

  /**
   * Find similar memories using database embeddings
   */
  private async findSimilarMemoriesFromDB(userId: string, queryEmbedding: number[], limit: number): Promise<{ id: string; similarity: number }[]> {
    try {
      // Get all memories with embeddings for the user
      const memories = await prisma.memory.findMany({
        where: { userId },
        include: {
          embedding: true
        }
      });

      // Calculate cosine similarity for each memory
      const similarities = memories
        .filter(memory => memory.embedding?.embedding)
        .map(memory => ({
          id: memory.id,
          similarity: this.cosineSimilarity(queryEmbedding, memory.embedding!.embedding)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      return similarities;
    } catch (error) {
      console.error('Error finding similar memories:', error);
      return [];
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Generate a unique memory ID
   */
  private generateMemoryId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Create a memory storage service for a user
 */
export async function createMemoryStorageService(userId: string): Promise<MemoryStorageService> {
  // Get user's GitHub access token
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { githubToken: true }
  });

  if (!user?.githubToken) {
    throw new Error('User GitHub token not found');
  }

  const githubService = new GitHubService(user.githubToken);
  return new MemoryStorageService(githubService);
}