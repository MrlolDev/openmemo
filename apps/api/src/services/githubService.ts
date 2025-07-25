import { Octokit } from '@octokit/rest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GitHubService {
  private octokit: Octokit;
  private static readonly MEMORIES_FILE = 'memories.json';
  private static operationLocks = new Map<string, Promise<any>>();
  
  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    });
  }

  /**
   * Execute an operation with a lock to prevent concurrent modifications
   */
  private async withLock<T>(userId: string, operation: () => Promise<T>): Promise<T> {
    const lockKey = `${userId}:memories`;
    
    // Wait for any existing operation to complete
    while (GitHubService.operationLocks.has(lockKey)) {
      await GitHubService.operationLocks.get(lockKey);
    }
    
    // Create a new lock
    const operationPromise = operation();
    GitHubService.operationLocks.set(lockKey, operationPromise);
    
    try {
      const result = await operationPromise;
      return result;
    } finally {
      // Remove the lock
      GitHubService.operationLocks.delete(lockKey);
    }
  }

  /**
   * Create a private repository for storing user memories
   */
  async createMemoryRepository(userId: string): Promise<{ owner: string; repo: string }> {
    try {
      // Get user info to determine repository name
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { githubId: true, name: true, email: true }
      });

      if (!user?.githubId) {
        throw new Error('User not found or GitHub ID missing');
      }

      // Get GitHub user info
      const { data: githubUser } = await this.octokit.rest.users.getByUsername({
        username: user.githubId
      });

      const repoName = 'openmemo-memories';
      const owner = githubUser.login;

      // Check if repository already exists
      try {
        await this.octokit.rest.repos.get({
          owner,
          repo: repoName
        });
        // Repository exists, return the info
        return { owner, repo: repoName };
      } catch (error: any) {
        if (error.status !== 404) {
          throw error;
        }
        // Repository doesn't exist, create it
      }

      // Create the private repository
      const { data: repository } = await this.octokit.rest.repos.createForAuthenticatedUser({
        name: repoName,
        description: 'Private repository for OpenMemo AI conversation memories',
        private: true,
        auto_init: true,
        gitignore_template: 'Node'
      });

      // Create initial README
      const readmeContent = `# OpenMemo Memories

This is your private repository for storing AI conversation memories from OpenMemo.

## Structure

- Each memory is stored as a JSON file in the \`memories/\` directory
- File names are UUIDs corresponding to memory IDs
- Each file contains the full memory content, embedding, and metadata

## Security

This repository is private and only accessible to you. OpenMemo uses your GitHub token to read/write memory files on your behalf.

## Backup

Since this is a Git repository, you have full version history of all your memories. You can clone this repository locally for additional backup.

Created by [OpenMemo](https://openmemo.app) on ${new Date().toISOString()}
`;

      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path: 'README.md',
        message: 'Initial OpenMemo setup',
        content: Buffer.from(readmeContent).toString('base64')
      });

      // Create initial memories.json file
      const initialMemoriesData = {
        version: "1.0",
        createdAt: new Date().toISOString(),
        memories: {},
        metadata: {
          totalMemories: 0,
          lastUpdated: new Date().toISOString(),
          description: "OpenMemo AI conversation memories storage"
        }
      };

      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path: GitHubService.MEMORIES_FILE,
        message: 'Initialize memories storage',
        content: Buffer.from(JSON.stringify(initialMemoriesData, null, 2)).toString('base64')
      });

      return { owner, repo: repoName };
    } catch (error) {
      console.error('Error creating memory repository:', error);
      throw new Error('Failed to create memory repository');
    }
  }

  /**
   * Save a memory to the single memories.json file
   */
  async saveMemory(userId: string, memory: any): Promise<void> {
    return this.withLock(userId, async () => {
      try {
        const { owner, repo } = await this.getOrCreateRepository(userId);
        
        // Get current memories file
        const memoriesData = await this.getMemoriesFile(owner, repo);
        
        // Check if this is an update or new memory
        const isUpdate = memoriesData.memories[memory.id] !== undefined;
        
        // Add or update the memory
        memoriesData.memories[memory.id] = memory;
        memoriesData.metadata.totalMemories = Object.keys(memoriesData.memories).length;
        memoriesData.metadata.lastUpdated = new Date().toISOString();

        // Save back to GitHub
        await this.updateMemoriesFile(owner, repo, memoriesData, 
          isUpdate ? `Update memory ${memory.id}` : `Add memory ${memory.id}`);

      } catch (error) {
        console.error('Error saving memory to GitHub:', error);
        throw new Error('Failed to save memory to GitHub');
      }
    });
  }

  /**
   * Retrieve a memory from the memories.json file
   */
  async getMemory(userId: string, memoryId: string): Promise<any> {
    try {
      const { owner, repo } = await this.getOrCreateRepository(userId);
      const memoriesData = await this.getMemoriesFile(owner, repo);
      
      const memory = memoriesData.memories[memoryId];
      if (!memory) {
        throw new Error('Memory not found');
      }
      
      return memory;
    } catch (error) {
      console.error('Error retrieving memory from GitHub:', error);
      throw new Error('Failed to retrieve memory from GitHub');
    }
  }

  /**
   * Delete a memory from the memories.json file
   */
  async deleteMemory(userId: string, memoryId: string): Promise<void> {
    return this.withLock(userId, async () => {
      try {
        const { owner, repo } = await this.getOrCreateRepository(userId);
        const memoriesData = await this.getMemoriesFile(owner, repo);
        
        if (!memoriesData.memories[memoryId]) {
          throw new Error('Memory not found');
        }
        
        // Remove the memory
        delete memoriesData.memories[memoryId];
        memoriesData.metadata.totalMemories = Object.keys(memoriesData.memories).length;
        memoriesData.metadata.lastUpdated = new Date().toISOString();

        // Save back to GitHub
        await this.updateMemoriesFile(owner, repo, memoriesData, `Delete memory ${memoryId}`);

      } catch (error) {
        console.error('Error deleting memory from GitHub:', error);
        throw new Error('Failed to delete memory from GitHub');
      }
    });
  }

  /**
   * List all memory IDs from the memories.json file
   */
  async listMemories(userId: string): Promise<string[]> {
    try {
      const { owner, repo } = await this.getOrCreateRepository(userId);
      const memoriesData = await this.getMemoriesFile(owner, repo);
      
      return Object.keys(memoriesData.memories);
    } catch (error) {
      console.error('Error listing memories from GitHub:', error);
      return [];
    }
  }

  /**
   * Get all memories from the memories.json file
   */
  async getAllMemories(userId: string): Promise<any[]> {
    try {
      const { owner, repo } = await this.getOrCreateRepository(userId);
      const memoriesData = await this.getMemoriesFile(owner, repo);
      
      return Object.values(memoriesData.memories);
    } catch (error) {
      console.error('Error getting all memories from GitHub:', error);
      return [];
    }
  }

  /**
   * Get the memories.json file content
   */
  private async getMemoriesFile(owner: string, repo: string): Promise<any> {
    try {
      const { data: file } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path: GitHubService.MEMORIES_FILE
      });

      if ('content' in file && file.content) {
        const content = Buffer.from(file.content, 'base64').toString('utf-8');
        return JSON.parse(content);
      }

      throw new Error('Memories file not found');
    } catch (error: any) {
      if (error.status === 404) {
        // File doesn't exist, return empty structure
        return {
          version: "1.0",
          createdAt: new Date().toISOString(),
          memories: {},
          metadata: {
            totalMemories: 0,
            lastUpdated: new Date().toISOString(),
            description: "OpenMemo AI conversation memories storage"
          }
        };
      }
      throw error;
    }
  }

  /**
   * Update the memories.json file
   */
  private async updateMemoriesFile(owner: string, repo: string, memoriesData: any, commitMessage: string): Promise<void> {
    try {
      // Get current file SHA for update
      let sha: string | undefined;
      try {
        const { data: existingFile } = await this.octokit.rest.repos.getContent({
          owner,
          repo,
          path: GitHubService.MEMORIES_FILE
        });
        
        if ('sha' in existingFile) {
          sha = existingFile.sha;
        }
      } catch (error: any) {
        if (error.status !== 404) {
          throw error;
        }
        // File doesn't exist, sha remains undefined
      }

      // Update the file
      const content = JSON.stringify(memoriesData, null, 2);
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: GitHubService.MEMORIES_FILE,
        message: commitMessage,
        content: Buffer.from(content).toString('base64'),
        sha
      });
    } catch (error) {
      console.error('Error updating memories file:', error);
      throw new Error('Failed to update memories file');
    }
  }

  /**
   * Get or create repository for user
   */
  private async getOrCreateRepository(userId: string): Promise<{ owner: string; repo: string }> {
    // Check if we have cached repository info in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { githubId: true, memoryRepoOwner: true, memoryRepoName: true }
    });

    if (!user?.githubId) {
      throw new Error('User not found or GitHub ID missing');
    }

    // If we have cached repo info, use it
    if (user.memoryRepoOwner && user.memoryRepoName) {
      return { owner: user.memoryRepoOwner, repo: user.memoryRepoName };
    }

    // Otherwise create the repository
    return await this.createMemoryRepository(userId);
  }
}

/**
 * Create a GitHub service instance for a user
 */
export async function createGitHubService(userId: string): Promise<GitHubService> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { githubToken: true }
  });

  if (!user?.githubToken) {
    throw new Error('User GitHub access token not found. Please re-authenticate with GitHub.');
  }

  return new GitHubService(user.githubToken);
}