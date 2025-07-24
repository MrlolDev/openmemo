import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";

const openai = new OpenAI({
  apiKey: process.env.NAHCROF_API_KEY,
  baseURL: "https://ai.nahcrof.com/v2",
});

const prisma = new PrismaClient();

interface VectorSearchResult {
  id: string;
  content: string;
  category: string;
  tags: string;
  createdAt: string;
  similarity: number;
}

export class VectorService {
  /**
   * Generate embeddings using OpenAI embeddings API
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: "multilingual-e5-large-instruct",
        encoding_format: "float",
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw new Error("Failed to generate embedding");
    }
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
   * Add or update memory embedding in the database
   */
  async addMemory(memory: {
    id: string;
    content: string;
    category: string;
    tags: string;
    createdAt: string;
  }): Promise<void> {
    try {
      // Generate embedding for the complete memory context
      const embeddingText = `${memory.content} ${memory.category} ${memory.tags}`;
      const embedding = await this.generateEmbedding(embeddingText);

      // Use a single transaction to ensure atomicity
      await prisma.$transaction(async (tx) => {
        // Verify the memory exists before creating embedding
        const memoryExists = await tx.memory.findUnique({
          where: { id: memory.id },
          select: { id: true },
        });

        if (!memoryExists) {
          throw new Error(`Memory ${memory.id} does not exist`);
        }

        // Create or update the embedding
        await tx.memoryEmbedding.upsert({
          where: { memoryId: memory.id },
          update: {
            embedding,
            dimensions: embedding.length,
            model: "multilingual-e5-large-instruct",
            updatedAt: new Date(),
          },
          create: {
            memoryId: memory.id,
            embedding,
            dimensions: embedding.length,
            model: "multilingual-e5-large-instruct",
          },
        });
      });
    } catch (error) {
      console.error(
        `Failed to create embedding for memory ${memory.id}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Remove memory embedding from the database
   * Note: Since Prisma schema has onDelete: Cascade, embeddings are automatically deleted when memory is deleted
   * This function is primarily for manual embedding deletion when memory still exists
   */
  async removeMemory(memoryId: string): Promise<void> {
    try {
      // Check if embedding exists
      const existingEmbedding = await prisma.memoryEmbedding.findUnique({
        where: { memoryId },
        select: { id: true },
      });

      if (!existingEmbedding) {
        return; // Success - embedding doesn't exist
      }

      // Delete the embedding
      await prisma.memoryEmbedding.delete({
        where: { memoryId },
      });
    } catch (error: any) {
      // Handle Prisma "Record to delete does not exist" error
      if (
        error?.code === "P2025" ||
        error?.message?.includes("Record to delete does not exist")
      ) {
        return; // Success - embedding was already deleted
      }

      console.error(`Error deleting embedding for memory ${memoryId}:`, error);
      throw error;
    }
  }

  /**
   * Search memories using vector similarity with database storage
   */
  async searchMemories(
    query: string,
    userId: string,
    limit: number = 10,
    similarityThreshold: number = 0.1
  ): Promise<VectorSearchResult[]> {
    try {
      console.log("Query:", query);
      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(query);
      // Get all memory embeddings for the user
      const memoryEmbeddings = await prisma.memoryEmbedding.findMany({
        include: {
          memory: {
            select: {
              id: true,
              content: true,
              category: true,
              tags: true,
              createdAt: true,
              userId: true,
            },
          },
        },
        where: {
          memory: {
            userId,
          },
        },
      });

      if (memoryEmbeddings.length === 0) {
        return [];
      }

      // Calculate similarities
      const similarities: VectorSearchResult[] = [];

      for (const memoryEmbedding of memoryEmbeddings) {
        if (!memoryEmbedding.memory || memoryEmbedding.memory.userId !== userId)
          continue;

        const similarity = this.cosineSimilarity(
          queryEmbedding,
          memoryEmbedding.embedding
        );

        if (similarity >= similarityThreshold) {
          similarities.push({
            id: memoryEmbedding.memory.id,
            content: memoryEmbedding.memory.content,
            category: memoryEmbedding.memory.category,
            tags: memoryEmbedding.memory.tags,
            createdAt: memoryEmbedding.memory.createdAt.toISOString(),
            similarity,
          });
        }
      }

      // Sort by similarity (highest first) and limit results
      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    } catch (error) {
      console.error("Error searching memories with vectors:", error);
      return [];
    }
  }

  /**
   * Initialize embeddings for existing memories that don't have them
   */
  async initializeFromMemories(memories: any[]): Promise<void> {
    console.log(
      `Initializing vector store with ${memories.length} memories...`
    );

    let processedCount = 0;
    let errorCount = 0;

    for (const memory of memories) {
      try {
        // Check if embedding already exists
        const existingEmbedding = await prisma.memoryEmbedding.findUnique({
          where: { memoryId: memory.id },
        });

        if (!existingEmbedding) {
          await this.addMemory({
            id: memory.id,
            content: memory.content,
            category: memory.category,
            tags: memory.tags || "",
            createdAt: memory.createdAt.toISOString(),
          });
          processedCount++;
        }
      } catch (error) {
        console.error(
          `Error initializing embedding for memory ${memory.id}:`,
          error
        );
        errorCount++;
      }
    }

    console.log(
      `Vector store initialization complete: ${processedCount} new embeddings created, ${errorCount} errors`
    );
  }

  /**
   * Get statistics about the vector store
   */
  async getStats(): Promise<{
    totalEmbeddings: number;
    embeddingsByModel: Record<string, number>;
    averageDimensions: number;
  }> {
    try {
      const embeddings = await prisma.memoryEmbedding.findMany({
        select: {
          model: true,
          dimensions: true,
        },
      });

      const totalEmbeddings = embeddings.length;
      const embeddingsByModel: Record<string, number> = {};
      let totalDimensions = 0;

      for (const embedding of embeddings) {
        embeddingsByModel[embedding.model] =
          (embeddingsByModel[embedding.model] || 0) + 1;
        totalDimensions += embedding.dimensions;
      }

      return {
        totalEmbeddings,
        embeddingsByModel,
        averageDimensions:
          totalEmbeddings > 0 ? totalDimensions / totalEmbeddings : 0,
      };
    } catch (error) {
      console.error("Error getting vector store stats:", error);
      return {
        totalEmbeddings: 0,
        embeddingsByModel: {},
        averageDimensions: 0,
      };
    }
  }

  /**
   * Find similar memories to a given memory
   */
  async findSimilarMemories(
    memoryId: string,
    userId: string,
    limit: number = 5,
    similarityThreshold: number = 0.3
  ): Promise<VectorSearchResult[]> {
    try {
      const targetEmbedding = await prisma.memoryEmbedding.findUnique({
        where: { memoryId },
        include: {
          memory: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (!targetEmbedding || targetEmbedding.memory?.userId !== userId) {
        return [];
      }

      // Get all other memory embeddings for the user
      const otherEmbeddings = await prisma.memoryEmbedding.findMany({
        where: {
          memoryId: { not: memoryId },
          memory: {
            userId,
          },
        },
        include: {
          memory: {
            select: {
              id: true,
              content: true,
              category: true,
              tags: true,
              createdAt: true,
            },
          },
        },
      });

      const similarities: VectorSearchResult[] = [];

      for (const embedding of otherEmbeddings) {
        if (!embedding.memory) continue;

        const similarity = this.cosineSimilarity(
          targetEmbedding.embedding,
          embedding.embedding
        );

        if (similarity >= similarityThreshold) {
          similarities.push({
            id: embedding.memory.id,
            content: embedding.memory.content,
            category: embedding.memory.category,
            tags: embedding.memory.tags,
            createdAt: embedding.memory.createdAt.toISOString(),
            similarity,
          });
        }
      }

      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    } catch (error) {
      console.error("Error finding similar memories:", error);
      return [];
    }
  }

  /**
   * Batch update embeddings for multiple memories
   */
  async batchUpdateEmbeddings(
    memories: Array<{
      id: string;
      content: string;
      category: string;
      tags: string;
      createdAt: string;
    }>
  ): Promise<{ success: number; errors: number }> {
    let success = 0;
    let errors = 0;

    console.log(`Starting batch update for ${memories.length} memories...`);

    // Process in smaller batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < memories.length; i += batchSize) {
      const batch = memories.slice(i, i + batchSize);

      await Promise.allSettled(
        batch.map(async (memory) => {
          try {
            await this.addMemory(memory);
            success++;
          } catch (error) {
            console.error(
              `Error updating embedding for memory ${memory.id}:`,
              error
            );
            errors++;
          }
        })
      );

      // Small delay between batches to be respectful to the API
      if (i + batchSize < memories.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    console.log(`Batch update complete: ${success} success, ${errors} errors`);
    return { success, errors };
  }

  /**
   * Clean up orphaned embeddings (embeddings without corresponding memories)
   */
  async cleanupOrphanedEmbeddings(): Promise<number> {
    try {
      // Find all memory IDs
      const memoryIds = await prisma.memory.findMany({
        select: {
          id: true,
        },
      });

      const validMemoryIds = memoryIds.map((m) => m.id);

      // Delete embeddings that don't have corresponding memories
      const result = await prisma.memoryEmbedding.deleteMany({
        where: {
          memoryId: {
            notIn: validMemoryIds,
          },
        },
      });

      console.log(`Cleaned up ${result.count} orphaned embeddings`);
      return result.count;
    } catch (error) {
      console.error("Error cleaning up orphaned embeddings:", error);
      return 0;
    }
  }

  /**
   * Quick check if a specific memory has an embedding
   */
  async checkMemoryEmbedding(memoryId: string): Promise<{
    hasEmbedding: boolean;
    embeddingId?: string;
    createdAt?: Date;
  }> {
    try {
      const embedding = await prisma.memoryEmbedding.findUnique({
        where: { memoryId },
        select: { id: true, createdAt: true },
      });

      return {
        hasEmbedding: !!embedding,
        embeddingId: embedding?.id,
        createdAt: embedding?.createdAt,
      };
    } catch (error) {
      console.error(
        `[EMBEDDING] Error checking embedding for memory ${memoryId}:`,
        error
      );
      return { hasEmbedding: false };
    }
  }

  /**
   * Diagnose database consistency issues
   */
  async diagnoseDatabaseConsistency(): Promise<{
    totalMemories: number;
    totalEmbeddings: number;
    memoriesWithoutEmbeddings: number;
    embeddingsWithoutMemories: number;
    duplicateEmbeddings: number;
  }> {
    try {
      console.log("[EMBEDDING] Starting database consistency diagnosis...");

      // Count total memories
      const totalMemories = await prisma.memory.count();
      console.log(`[EMBEDDING] Total memories in database: ${totalMemories}`);

      // Count total embeddings
      const totalEmbeddings = await prisma.memoryEmbedding.count();
      console.log(
        `[EMBEDDING] Total embeddings in database: ${totalEmbeddings}`
      );

      // Find memories without embeddings
      const memoriesWithoutEmbeddings = await prisma.memory.count({
        where: { embedding: null },
      });
      console.log(
        `[EMBEDDING] Memories without embeddings: ${memoriesWithoutEmbeddings}`
      );

      // Find embeddings without corresponding memories
      const allMemoryIds = await prisma.memory.findMany({
        select: { id: true },
      });
      const validMemoryIds = allMemoryIds.map((m) => m.id);

      const embeddingsWithoutMemories = await prisma.memoryEmbedding.count({
        where: {
          memoryId: { notIn: validMemoryIds },
        },
      });
      console.log(
        `[EMBEDDING] Embeddings without corresponding memories: ${embeddingsWithoutMemories}`
      );

      // Check for duplicate embeddings (multiple embeddings for same memory)
      const duplicateEmbeddings = await prisma.memoryEmbedding.groupBy({
        by: ["memoryId"],
        having: {
          memoryId: { _count: { gt: 1 } },
        },
        _count: { memoryId: true },
      });
      console.log(
        `[EMBEDDING] Memories with duplicate embeddings: ${duplicateEmbeddings.length}`
      );

      if (duplicateEmbeddings.length > 0) {
        console.warn(
          "[EMBEDDING] Found duplicate embeddings for memories:",
          duplicateEmbeddings
        );
      }

      return {
        totalMemories,
        totalEmbeddings,
        memoriesWithoutEmbeddings,
        embeddingsWithoutMemories,
        duplicateEmbeddings: duplicateEmbeddings.length,
      };
    } catch (error) {
      console.error("[EMBEDDING] Error during database diagnosis:", error);
      throw error;
    }
  }

  /**
   * Clean up orphaned memories (memories without corresponding embeddings)
   * and create embeddings for them
   */
  async cleanupOrphanedMemories(): Promise<{
    created: number;
    failed: number;
  }> {
    try {
      // Find memories that don't have embeddings
      const memoriesWithoutEmbeddings = await prisma.memory.findMany({
        where: {
          embedding: null,
        },
        select: {
          id: true,
          content: true,
          category: true,
          tags: true,
          createdAt: true,
        },
      });

      console.log(
        `Found ${memoriesWithoutEmbeddings.length} memories without embeddings`
      );

      let created = 0;
      let failed = 0;

      // Create embeddings for memories that don't have them
      for (const memory of memoriesWithoutEmbeddings) {
        try {
          await this.addMemory({
            id: memory.id,
            content: memory.content,
            category: memory.category,
            tags: memory.tags,
            createdAt: memory.createdAt.toISOString(),
          });
          created++;
        } catch (error) {
          console.error(
            `Failed to create embedding for memory ${memory.id}:`,
            error
          );
          failed++;
        }
      }

      console.log(
        `Cleanup complete: ${created} embeddings created, ${failed} failed`
      );
      return { created, failed };
    } catch (error) {
      console.error("Error cleaning up orphaned memories:", error);
      return { created: 0, failed: 0 };
    }
  }
}

// Export singleton instance
export const vectorService = new VectorService();
