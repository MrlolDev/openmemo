import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { aiService } from "../services/aiService";
import { createMemoryStorageService } from "../services/memoryStorageService";
import { createGitHubService } from "../services/githubService";

const router = Router();

// Security middleware to ensure user can only access their own data
const validateUserAccess = (req: any, res: any, next: any) => {
  const userId = req.body.userId || req.query.userId;
  const userIdFromToken = req.user?.id; // Set by auth middleware

  // If no userId provided in request, use the authenticated user's ID
  if (!userId && userIdFromToken) {
    if (req.body) req.body.userId = userIdFromToken;
    if (req.query) req.query.userId = userIdFromToken;
    return next();
  }

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  // Validate against authenticated user - must match
  if (userIdFromToken && userId !== userIdFromToken) {
    return res
      .status(403)
      .json({ error: "Unauthorized: Cannot access other users data" });
  }

  next();
};

// Apply security middleware to all routes
router.use(validateUserAccess);

interface RequestWithPrisma extends Request {
  prisma: PrismaClient;
}

// GET /api/memories - Load memories with GitHub storage
router.get("/", async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      userId,
      query,
      limit = 10,
      extractNewMemories = "false",
    } = req.query;
    const prisma = (req as any).prisma;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    let newMemoryDetected = false;
    let newMemorySaved = null;

    // Initialize GitHub storage service
    const storageService = await createMemoryStorageService(userId as string);

    // Extract new memories from query if requested
    if (query && extractNewMemories === "true") {
      try {
        // Get existing memories metadata to check against duplicates
        const existingMemories = await storageService.listMemories(userId as string, { limit: 50 });

        // Get full content for recent memories to check duplicates
        const recentMemoriesWithContent = await Promise.all(
          existingMemories.slice(0, 10).map(async (meta) => {
            const fullMemory = await storageService.getMemory(userId as string, meta.id);
            return fullMemory ? {
              id: fullMemory.id,
              content: fullMemory.content,
              category: fullMemory.category,
              source: fullMemory.source,
              tags: fullMemory.tags ? fullMemory.tags.split(",").filter((t: string) => t.trim()) : [],
              createdAt: fullMemory.createdAt,
            } : null;
          })
        );

        const validMemories = recentMemoriesWithContent.filter(Boolean);

        const memoryDetection = await aiService.detectNewMemoryInQuery(
          query as string,
          validMemories,
          [
            "General",
            "Personal Info",
            "Work & Career",
            "Technology",
            "Learning & Education",
          ]
        );

        if (memoryDetection.hasNewMemory && memoryDetection.extractedMemory) {
          // Save the detected memory using GitHub storage
          const savedMemory = await storageService.createMemory(userId as string, {
            content: memoryDetection.extractedMemory,
            category: memoryDetection.category || "General",
            source: "query-extraction",
            tags: "",
          });

          newMemoryDetected = true;
          newMemorySaved = {
            id: savedMemory.id,
            content: savedMemory.content,
            category: savedMemory.category,
            source: savedMemory.source,
            createdAt: savedMemory.createdAt,
          };
        }
      } catch (memoryError) {
        console.error("Error extracting new memory:", memoryError);
      }
    }

    // If no query provided, return metadata for all memories
    if (!query) {
      const memoriesMetadata = await storageService.listMemories(userId as string, {
        limit: parseInt(limit as string)
      });

      // Get full content for the memories
      const memoriesWithContent = await Promise.all(
        memoriesMetadata.map(async (meta) => {
          const fullMemory = await storageService.getMemory(userId as string, meta.id);
          return fullMemory || {
            id: meta.id,
            content: "(Content not available)",
            category: meta.category,
            source: meta.source,
            tags: meta.tags,
            createdAt: meta.createdAt,
            updatedAt: meta.updatedAt,
          };
        })
      );

      return res.json({
        memories: memoriesWithContent,
        searchType: "all",
        newMemoryDetected,
        newMemorySaved,
        responseTime: Date.now() - startTime,
      });
    }

    // Perform semantic search using embeddings
    try {
      const searchResults = await storageService.searchMemories(
        userId as string,
        query as string,
        parseInt(limit as string)
      );

      if (searchResults.length > 0) {
        // Log the query
        await prisma.queryLog.create({
          data: {
            userId: userId as string,
            query: query as string,
            source: "extension",
            resultCount: searchResults.length,
            responseTime: Date.now() - startTime,
          },
        });

        return res.json({
          memories: searchResults,
          searchType: "vector-semantic",
          newMemoryDetected,
          newMemorySaved,
          responseTime: Date.now() - startTime,
        });
      }
    } catch (vectorError) {
      console.warn("Vector search failed, falling back to metadata search:", vectorError);
    }

    // Fallback to metadata-based search with AI assistance
    const allMemoriesMetadata = await storageService.listMemories(userId as string);

    if (allMemoriesMetadata.length === 0) {
      return res.json({
        memories: [],
        searchType: "no-memories",
        newMemoryDetected,
        newMemorySaved,
        responseTime: Date.now() - startTime,
      });
    }

    // Get full content for AI-powered search (limited to avoid performance issues)
    const limitedMemories = allMemoriesMetadata.slice(0, 50);
    const memoriesWithContent = await Promise.all(
      limitedMemories.map(async (meta) => {
        const fullMemory = await storageService.getMemory(userId as string, meta.id);
        return fullMemory ? {
          id: fullMemory.id,
          content: fullMemory.content,
          category: fullMemory.category,
          source: fullMemory.source,
          tags: fullMemory.tags,
          createdAt: fullMemory.createdAt,
        } : null;
      })
    );

    const validMemories = memoriesWithContent.filter(Boolean);

    const relevantMemories = await aiService.findRelevantMemories(
      query as string,
      validMemories,
      parseInt(limit as string),
      userId as string
    );

    // Log the query
    await prisma.queryLog.create({
      data: {
        userId: userId as string,
        query: query as string,
        source: "extension",
        resultCount: relevantMemories.length,
        responseTime: Date.now() - startTime,
      },
    });

    res.json({
      memories: relevantMemories,
      searchType: "ai-powered",
      newMemoryDetected,
      newMemorySaved,
      responseTime: Date.now() - startTime,
    });
  } catch (error) {
    console.error("Error loading memories:", error);
    res.status(500).json({ error: "Failed to load memories" });
  }
});

// POST /api/memories - Create memory(ies) with GitHub storage
router.post("/", async (req, res) => {
  try {
    const {
      memories,
      content,
      category,
      source = "manual",
      tags = [],
      userId,
    } = req.body;
    const prisma = (req as any).prisma;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Initialize GitHub storage service
    const storageService = await createMemoryStorageService(userId);

    // Handle bulk memory creation
    if (memories && Array.isArray(memories)) {
      if (memories.length === 0) {
        return res
          .status(400)
          .json({ error: "memories array cannot be empty" });
      }

      const createdMemories = [];
      let processed = 0;
      let skipped = 0;
      const batchSize = 5; // Reduced batch size for GitHub API rate limits

      // Process memories in batches with AI operations
      for (let i = 0; i < memories.length; i += batchSize) {
        const batch = memories.slice(i, i + batchSize);

        const batchPromises = batch.map(async (memoryContent) => {
          if (!memoryContent || typeof memoryContent !== "string") {
            return { success: false, reason: "invalid_content" };
          }

          try {
            // Run categorization and tag generation
            const [categorizedCategory, generatedTags] = await Promise.all([
              aiService.categorizeMemory(memoryContent).catch(() => "General"),
              aiService.generateMemoryTags(memoryContent).catch(() => ""),
            ]);

            // Create memory using GitHub storage service
            const savedMemory = await storageService.createMemory(userId, {
              content: memoryContent,
              category: categorizedCategory || "General",
              source,
              tags: Array.isArray(generatedTags) ? generatedTags.join(", ") : generatedTags || "",
            });

            return { success: true, memory: savedMemory };
          } catch (error) {
            console.error("Error creating memory:", error);
            return {
              success: false,
              reason: "creation_error",
              error: error instanceof Error ? error.message : String(error),
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);

        // Process batch results
        for (const result of batchResults) {
          if (result.success) {
            createdMemories.push(result.memory);
            processed++;
          } else {
            skipped++;
          }
        }
      }

      return res.status(201).json({
        memories: createdMemories,
        processed,
        skipped,
        total: memories.length,
      });
    }

    // Handle single memory creation
    if (!content) {
      return res.status(400).json({ error: "content is required" });
    }

    // Auto-categorize and generate tags
    const finalCategory = await aiService.categorizeMemory(content).catch(() => "General");
    const finalTags = await aiService.generateMemoryTags(content).catch(() => "");

    const memory = await storageService.createMemory(userId, {
      content,
      category: finalCategory || "General",
      source,
      tags: Array.isArray(finalTags) ? finalTags.join(", ") : finalTags || "",
    });

    res.status(201).json({ memory });
  } catch (error) {
    console.error("Error creating memory:", error);
    res.status(500).json({ error: "Failed to create memory" });
  }
});

// PUT /api/memories/:id - Update a memory
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content, category, tags, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Initialize GitHub storage service
    const storageService = await createMemoryStorageService(userId);

    // Update the memory
    const updates: any = {};
    if (content) updates.content = content;
    if (category) updates.category = category;
    if (tags) updates.tags = Array.isArray(tags) ? tags.join(", ") : tags;

    const memory = await storageService.updateMemory(userId, id, updates);

    if (!memory) {
      return res.status(404).json({ error: "Memory not found" });
    }

    res.json({ memory });
  } catch (error) {
    console.error("Error updating memory:", error);
    res.status(500).json({ error: "Failed to update memory" });
  }
});

// DELETE /api/memories/:id - Delete a memory
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Initialize GitHub storage service
    const storageService = await createMemoryStorageService(userId as string);

    // Delete the memory
    const success = await storageService.deleteMemory(userId as string, id);

    if (!success) {
      return res.status(404).json({ error: "Memory not found or failed to delete" });
    }

    res.json({ message: "Memory deleted successfully" });
  } catch (error) {
    console.error("Error deleting memory:", error);
    res.status(500).json({ error: "Failed to delete memory" });
  }
});

// GET /api/memories/usage-stats - Get usage statistics
router.get("/usage-stats", async (req, res) => {
  try {
    const { userId } = req.query;
    const prisma = (req as any).prisma;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Initialize GitHub storage service for memory counts
    const storageService = await createMemoryStorageService(userId as string);
    const memoriesMetadata = await storageService.listMemories(userId as string);

    // Get total memories count
    const totalMemories = memoriesMetadata.length;

    // Get memories by source
    const memoriesBySource = memoriesMetadata.reduce((acc: any, memory) => {
      acc[memory.source] = (acc[memory.source] || 0) + 1;
      return acc;
    }, {});

    // Get query logs by source (last 30 days) - this still comes from database
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const queryStatsBySource = await prisma.queryLog.groupBy({
      by: ["source"],
      where: {
        userId: userId as string,
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: { source: true },
      _avg: { responseTime: true },
    });

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await prisma.queryLog.count({
      where: {
        userId: userId as string,
        createdAt: { gte: sevenDaysAgo },
      },
    });

    // Get most used services
    const serviceUsage = queryStatsBySource
      .map((stat: any) => ({
        service: stat.source,
        usageCount: stat._count.source,
        avgResponseTime: Math.round(stat._avg.responseTime || 0),
      }))
      .sort((a: any, b: any) => b.usageCount - a.usageCount);

    res.json({
      totalMemories,
      memoriesBySource: Object.entries(memoriesBySource).map(([source, count]) => ({
        source,
        count,
      })),
      serviceUsage,
      recentActivity,
      stats: {
        totalQueries: queryStatsBySource.reduce(
          (sum: any, stat: any) => sum + stat._count.source,
          0
        ),
        averageResponseTime: Math.round(
          queryStatsBySource.reduce(
            (sum: any, stat: any) => sum + (stat._avg.responseTime || 0),
            0
          ) / queryStatsBySource.length || 0
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching usage statistics:", error);
    res.status(500).json({ error: "Failed to fetch usage statistics" });
  }
});

// POST /api/memories/find-relevant - Find relevant memories using GitHub storage
router.post("/find-relevant", async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      query,
      userId,
      maxResults = 5,
      source = "extension",
      availableCategories,
      checkForNewMemory = false,
    } = req.body;
    const prisma = (req as any).prisma;

    if (!query || !userId) {
      return res.status(400).json({ error: "query and userId are required" });
    }

    let newMemoryDetected = false;
    let newMemorySaved = null;

    // Initialize GitHub storage service
    const storageService = await createMemoryStorageService(userId);

    // Check for new memory if requested
    if (checkForNewMemory) {
      try {
        const memoryDetection = await aiService.detectNewMemoryInQuery(
          query,
          availableCategories
        );

        if (memoryDetection.hasNewMemory && memoryDetection.extractedMemory) {
          // Save the detected memory using GitHub storage
          const savedMemory = await storageService.createMemory(userId, {
            content: memoryDetection.extractedMemory,
            category: memoryDetection.category || "General",
            source: `${source}-auto`,
            tags: "",
          });

          newMemoryDetected = true;
          newMemorySaved = savedMemory;
        }
      } catch (memoryError) {
        console.error("Error detecting new memory:", memoryError);
      }
    }

    // Search for relevant memories
    const relevantMemories = await storageService.searchMemories(
      userId,
      query,
      parseInt(maxResults)
    );

    // Log the query
    await prisma.queryLog.create({
      data: {
        userId,
        query,
        source,
        resultCount: relevantMemories.length,
        responseTime: Date.now() - startTime,
      },
    });

    res.json({
      memories: relevantMemories,
      query,
      totalAvailable: relevantMemories.length,
      responseTime: Date.now() - startTime,
      newMemoryDetected,
      newMemorySaved,
    });
  } catch (error) {
    console.error("Error finding relevant memories:", error);

    // Log the failed query
    try {
      const { userId, query, source = "extension" } = req.body;
      if (userId && query) {
        const prisma = (req as any).prisma;
        await prisma.queryLog.create({
          data: {
            userId,
            query,
            source,
            resultCount: 0,
            responseTime: Date.now() - startTime,
          },
        });
      }
    } catch (logError) {
      console.error("Error logging failed query:", logError);
    }

    res.status(500).json({ error: "Failed to find relevant memories" });
  }
});

// GET /api/memories/:id/similar - Find similar memories
router.get("/:id/similar", async (req, res) => {
  const startTime = Date.now();
  try {
    const { id } = req.params;
    const { userId, limit = 5, threshold = 0.3 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Initialize GitHub storage service
    const storageService = await createMemoryStorageService(userId as string);

    // Check if memory exists
    const existingMemory = await storageService.getMemory(userId as string, id);

    if (!existingMemory) {
      return res.status(404).json({ error: "Memory not found" });
    }

    // Find similar memories using the content
    const similarMemories = await storageService.searchMemories(
      userId as string,
      existingMemory.content,
      parseInt(limit as string) + 1 // +1 to exclude the source memory
    );

    // Filter out the source memory itself
    const filteredSimilar = similarMemories.filter(memory => memory.id !== id);

    res.json({
      similarMemories: filteredSimilar,
      sourceMemory: {
        id: existingMemory.id,
        content: existingMemory.content,
        category: existingMemory.category,
      },
      responseTime: Date.now() - startTime,
    });
  } catch (error) {
    console.error("Error finding similar memories:", error);
    res.status(500).json({ error: "Failed to find similar memories" });
  }
});

// POST /api/memories/setup-github - Setup GitHub repository for new user
router.post("/setup-github", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Initialize GitHub service
    const githubService = await createGitHubService(userId);

    // Create or ensure repository exists
    const repoInfo = await githubService.createMemoryRepository(userId);

    // Update user record with repository information
    const prisma = (req as any).prisma;
    await prisma.user.update({
      where: { id: userId },
      data: {
        memoryRepoOwner: repoInfo.owner,
        memoryRepoName: repoInfo.repo,
      },
    });

    res.json({
      message: "GitHub repository setup completed",
      repository: repoInfo,
    });
  } catch (error) {
    console.error("Error setting up GitHub repository:", error);
    res.status(500).json({ error: "Failed to setup GitHub repository" });
  }
});

export default router;