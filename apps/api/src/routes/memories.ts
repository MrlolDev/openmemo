import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { aiService } from '../services/aiService';
import { vectorService } from '../services/vectorService';

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
    return res.status(400).json({ error: 'userId is required' });
  }
  
  // Validate against authenticated user - must match
  if (userIdFromToken && userId !== userIdFromToken) {
    return res.status(403).json({ error: 'Unauthorized: Cannot access other users data' });
  }
  
  next();
};

// Apply security middleware to all routes
router.use(validateUserAccess);

interface RequestWithPrisma extends Request {
  prisma: PrismaClient;
}

// GET /api/memories - Load memories based on user query with automatic new memory extraction
router.get('/', async (req, res) => {
  const startTime = Date.now();
  try {
    const { userId, query, limit = 10, extractNewMemories = 'false' } = req.query;
    const prisma = (req as any).prisma;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    let newMemoryDetected = false;
    let newMemorySaved = null;

    // Extract new memories from query if requested
    if (query && extractNewMemories === 'true') {
      try {
        // Get existing memories to check against duplicates
        const existingMemories = await prisma.memory.findMany({
          where: { userId: userId as string },
          orderBy: { createdAt: 'desc' },
          take: 50 // Limit to recent memories to avoid token overflow
        });
        
        const memoryDetection = await aiService.detectNewMemoryInQuery(
          query as string, 
          existingMemories.map((m: any) => ({
            id: m.id,
            content: m.content,
            category: m.category,
            source: m.source,
            tags: m.tags ? m.tags.split(',').filter((t: string) => t.trim()) : [],
            createdAt: m.createdAt.toISOString()
          })),
          ['General', 'Personal Info', 'Work & Career', 'Technology', 'Learning & Education']
        );
        
        if (memoryDetection.hasNewMemory && memoryDetection.extractedMemory) {
          // Save the detected memory
          const savedMemory = await prisma.memory.create({
            data: {
              content: memoryDetection.extractedMemory,
              category: memoryDetection.category || 'General',
              userId: userId as string,
              source: 'query-extraction',
              tags: ''
            }
          });
          
          // Add to vector store
          await vectorService.addMemory({
            id: savedMemory.id,
            content: savedMemory.content,
            category: savedMemory.category,
            tags: savedMemory.tags,
            createdAt: savedMemory.createdAt.toISOString(),
          });
          
          newMemoryDetected = true;
          newMemorySaved = savedMemory;
        }
      } catch (memoryError) {
        console.error('Error extracting new memory:', memoryError);
      }
    }

    // If no query provided, return all memories
    if (!query) {
      const memories = await prisma.memory.findMany({
        where: { userId: userId as string },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
      });

      return res.json({
        memories,
        searchType: 'all',
        newMemoryDetected,
        newMemorySaved,
        responseTime: Date.now() - startTime
      });
    }

    // Try vector search first
    try {
      const vectorResults = await vectorService.searchMemories(
        query as string,
        userId as string,
        parseInt(limit as string),
        0.1
      );

      if (vectorResults.length > 0) {
        // Get full memory objects from database
        const memoryIds = vectorResults.map(r => r.id);
        const memories = await prisma.memory.findMany({
          where: { 
            userId: userId as string,
            id: { in: memoryIds }
          },
          orderBy: { createdAt: 'desc' },
        });

        // Sort by vector similarity
        const sortedMemories = memoryIds
          .map(id => memories.find((m: any) => m.id === id))
          .filter(Boolean);

        // Log the query
        await prisma.queryLog.create({
          data: {
            userId: userId as string,
            query: query as string,
            source: 'extension',
            resultCount: sortedMemories.length,
            responseTime: Date.now() - startTime,
          }
        });

        return res.json({
          memories: sortedMemories,
          searchType: 'vector-semantic',
          newMemoryDetected,
          newMemorySaved,
          responseTime: Date.now() - startTime
        });
      }
    } catch (vectorError) {
      console.warn('Vector search failed, falling back to AI search:', vectorError);
    }

    // Fallback to AI-powered search
    const allMemories = await prisma.memory.findMany({
      where: { userId: userId as string },
      orderBy: { createdAt: 'desc' },
    });

    if (allMemories.length === 0) {
      return res.json({
        memories: [],
        searchType: 'no-memories',
        newMemoryDetected,
        newMemorySaved,
        responseTime: Date.now() - startTime
      });
    }

    const relevantMemories = await aiService.findRelevantMemories(
      query as string,
      allMemories,
      parseInt(limit as string)
    );

    // Log the query
    await prisma.queryLog.create({
      data: {
        userId: userId as string,
        query: query as string,
        source: 'extension',
        resultCount: relevantMemories.length,
        responseTime: Date.now() - startTime,
      }
    });

    res.json({
      memories: relevantMemories,
      searchType: 'ai-powered',
      newMemoryDetected,
      newMemorySaved,
      responseTime: Date.now() - startTime
    });
  } catch (error) {
    console.error('Error loading memories:', error);
    res.status(500).json({ error: 'Failed to load memories' });
  }
});

// POST /api/memories - Create memory(ies) with automatic categorization
router.post('/', async (req, res) => {
  try {
    const { memories, content, category, source = 'manual', tags = [], userId } = req.body;
    const prisma = (req as any).prisma;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Handle bulk memory creation
    if (memories && Array.isArray(memories)) {
      if (memories.length === 0) {
        return res.status(400).json({ error: 'memories array cannot be empty' });
      }

      const createdMemories = [];
      let processed = 0;
      let skipped = 0;
      const batchSize = 10; // Increased batch size for faster processing

      console.log(`Processing ${memories.length} memories in batches of ${batchSize}`);

      // First, batch AI operations to reduce API calls
      const aiOperationsPromises = memories.map(async (memoryContent, index) => {
        if (!memoryContent || typeof memoryContent !== 'string') {
          return { index, category: 'General', tags: '', valid: false };
        }

        try {
          // Run categorization and tag generation in parallel with shorter timeout
          const [categorizedCategory, generatedTags] = await Promise.all([
            Promise.race([
              aiService.categorizeMemory(memoryContent),
              new Promise<string>((_, reject) => 
                setTimeout(() => reject(new Error('Categorization timeout')), 5000)
              )
            ]).catch(() => 'General'),
            Promise.race([
              aiService.generateMemoryTags(memoryContent),
              new Promise<string>((_, reject) => 
                setTimeout(() => reject(new Error('Tags timeout')), 5000)
              )
            ]).catch(() => '')
          ]);

          return {
            index,
            category: categorizedCategory || 'General',
            tags: Array.isArray(generatedTags) ? generatedTags.join(', ') : (generatedTags || ''),
            valid: true
          };
        } catch (error) {
          console.warn(`AI processing failed for memory ${index}:`, error);
          return { index, category: 'General', tags: '', valid: true };
        }
      });

      // Wait for all AI operations to complete
      const aiResults = await Promise.all(aiOperationsPromises);
      console.log('AI categorization completed, creating database entries...');

      // Now create memories in database batches
      for (let i = 0; i < memories.length; i += batchSize) {
        const batch = memories.slice(i, i + batchSize);
        const batchAiResults = aiResults.slice(i, i + batchSize);

        const batchPromises = batch.map(async (memoryContent, batchIndex) => {
          const globalIndex = i + batchIndex;
          const aiResult = batchAiResults[batchIndex];

          if (!aiResult.valid) {
            return { success: false, reason: 'invalid_content' };
          }

          try {
            const memory = await prisma.memory.create({
              data: {
                content: memoryContent,
                category: aiResult.category,
                source,
                tags: aiResult.tags,
                userId,
              },
            });

            // Add to vector store asynchronously (don't wait)
            setImmediate(() => {
              vectorService.addMemory({
                id: memory.id,
                content: memory.content,
                category: memory.category,
                tags: memory.tags,
                createdAt: memory.createdAt.toISOString(),
              }).catch(error => {
                console.warn('Vector store update failed for memory:', memory.id, error);
              });
            });

            return { success: true, memory };
          } catch (error) {
            console.error('Error creating memory in database:', error);
            return { success: false, reason: 'database_error', error: error instanceof Error ? error.message : String(error) };
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

      console.log(`Bulk creation completed: ${processed} processed, ${skipped} skipped`);

      return res.status(201).json({ 
        memories: createdMemories, 
        processed, 
        skipped,
        total: memories.length 
      });
    }

    // Handle single memory creation
    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }

    // Always auto-categorize and generate tags for all memories
    const finalCategory = await aiService.categorizeMemory(content);
    const finalTags = await aiService.generateMemoryTags(content);

    const memory = await prisma.memory.create({
      data: {
        content,
        category: finalCategory || 'General',
        source,
        tags: Array.isArray(finalTags) ? finalTags.join(', ') : (finalTags || ''),
        userId,
      },
    });

    // Add to vector store for semantic search
    await vectorService.addMemory({
      id: memory.id,
      content: memory.content,
      category: memory.category,
      tags: memory.tags,
      createdAt: memory.createdAt.toISOString(),
    });

    res.status(201).json({ memory });
  } catch (error) {
    console.error('Error creating memory:', error);
    res.status(500).json({ error: 'Failed to create memory' });
  }
});

// PUT /api/memories/:id - Update a memory
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, category, tags, userId } = req.body;
    const prisma = (req as any).prisma;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Check if memory exists and belongs to user
    const existingMemory = await prisma.memory.findFirst({
      where: { id, userId }
    });

    if (!existingMemory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    const memory = await prisma.memory.update({
      where: { id },
      data: {
        ...(content && { content }),
        ...(category && { category }),
        ...(tags && { tags: Array.isArray(tags) ? tags.join(', ') : tags }),
      },
    });

    // Update vector store
    await vectorService.addMemory({
      id: memory.id,
      content: memory.content,
      category: memory.category,
      tags: memory.tags,
      createdAt: memory.createdAt.toISOString(),
    });

    res.json({ memory });
  } catch (error) {
    console.error('Error updating memory:', error);
    res.status(500).json({ error: 'Failed to update memory' });
  }
});

// DELETE /api/memories/:id - Delete a memory
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const prisma = (req as any).prisma;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Check if memory exists and belongs to user
    const existingMemory = await prisma.memory.findFirst({
      where: { id, userId: userId as string }
    });

    if (!existingMemory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    await prisma.memory.delete({ where: { id } });

    // Remove from vector store
    vectorService.removeMemory(id);

    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    console.error('Error deleting memory:', error);
    res.status(500).json({ error: 'Failed to delete memory' });
  }
});



// GET /api/memories/usage-stats - Get usage statistics for a user
router.get('/usage-stats', async (req, res) => {
  try {
    const { userId } = req.query;
    const prisma = (req as any).prisma;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get total memories count
    const totalMemories = await prisma.memory.count({
      where: { userId: userId as string }
    });

    // Get memories by source
    const memoriesBySource = await prisma.memory.groupBy({
      by: ['source'],
      where: { userId: userId as string },
      _count: { source: true }
    });

    // Get query logs by source (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const queryStatsBySource = await prisma.queryLog.groupBy({
      by: ['source'],
      where: { 
        userId: userId as string,
        createdAt: { gte: thirtyDaysAgo }
      },
      _count: { source: true },
      _avg: { responseTime: true }
    });

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await prisma.queryLog.count({
      where: {
        userId: userId as string,
        createdAt: { gte: sevenDaysAgo }
      }
    });

    // Get most used services
    const serviceUsage = queryStatsBySource.map((stat: any) => ({
      service: stat.source,
      usageCount: stat._count.source,
      avgResponseTime: Math.round(stat._avg.responseTime || 0)
    })).sort((a: any, b: any) => b.usageCount - a.usageCount);

    res.json({
      totalMemories,
      memoriesBySource: memoriesBySource.map((m: any) => ({
        source: m.source,
        count: m._count.source
      })),
      serviceUsage,
      recentActivity,
      stats: {
        totalQueries: queryStatsBySource.reduce((sum: any, stat: any) => sum + stat._count.source, 0),
        averageResponseTime: Math.round(
          queryStatsBySource.reduce((sum: any, stat: any) => sum + (stat._avg.responseTime || 0), 0) / 
          queryStatsBySource.length || 0
        )
      }
    });

  } catch (error) {
    console.error('Error fetching usage statistics:', error);
    res.status(500).json({ error: 'Failed to fetch usage statistics' });
  }
});


// POST /api/memories/find-relevant - Find relevant memories using AI
router.post('/find-relevant', async (req, res) => {
  const startTime = Date.now();
  try {
    const { query, userId, maxResults = 5, source = 'extension', availableCategories, checkForNewMemory = false } = req.body;
    const prisma = (req as any).prisma;

    if (!query || !userId) {
      return res.status(400).json({ error: 'query and userId are required' });
    }

    let newMemoryDetected = false;
    let newMemorySaved = null;

    // Check for new memory if requested
    if (checkForNewMemory) {
      try {
        const memoryDetection = await aiService.detectNewMemoryInQuery(query, availableCategories);
        
        if (memoryDetection.hasNewMemory && memoryDetection.extractedMemory) {
          // Save the detected memory
          const savedMemory = await prisma.memory.create({
            data: {
              content: memoryDetection.extractedMemory,
              category: memoryDetection.category || 'General',
              userId,
              source: `${source}-auto`,
              tags: ''
            }
          });
          
          newMemoryDetected = true;
          newMemorySaved = savedMemory;
        }
      } catch (memoryError) {
        console.error('Error detecting new memory:', memoryError);
        // Continue with memory search even if detection fails
      }
    }

    // Get all user memories
    const allMemories = await prisma.memory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (allMemories.length === 0) {
      // Log the query even if no memories found
      await prisma.queryLog.create({
        data: {
          userId,
          query,
          source,
          resultCount: 0,
          responseTime: Date.now() - startTime,
        }
      });

      return res.json({ 
        memories: [], 
        newMemoryDetected, 
        newMemorySaved 
      });
    }

    // Use AI to find relevant memories
    const relevantMemories = await aiService.findRelevantMemories(
      query, 
      allMemories, 
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
      }
    });

    res.json({ 
      memories: relevantMemories,
      query,
      totalAvailable: allMemories.length,
      responseTime: Date.now() - startTime,
      newMemoryDetected,
      newMemorySaved
    });
  } catch (error) {
    console.error('Error finding relevant memories:', error);
    
    // Log the failed query
    try {
      const { userId, query, source = 'extension' } = req.body;
      if (userId && query) {
        const prisma = (req as any).prisma;
        await prisma.queryLog.create({
          data: {
            userId,
            query,
            source,
            resultCount: 0,
            responseTime: Date.now() - startTime,
          }
        });
      }
    } catch (logError) {
      console.error('Error logging failed query:', logError);
    }

    res.status(500).json({ error: 'Failed to find relevant memories' });
  }
});









export default router;