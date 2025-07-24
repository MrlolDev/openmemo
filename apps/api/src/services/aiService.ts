import OpenAI from "openai";
import { vectorService } from "./vectorService";
import {
  parseAiJsonResponse,
  safeParseAiJson,
  parseCategorizeResponse,
} from "../utils/parseJson";

// Initialize OpenAI client with nahcrof.com base URL
const openai = new OpenAI({
  apiKey: process.env.NAHCROF_API_KEY,
  baseURL: "https://ai.nahcrof.com/v2",
});

interface Memory {
  id: string;
  content: string;
  category: string;
  source: string;
  tags: string[];
  createdAt: string;
}

// AI Service using Moonshot AI Kimi K2 Instruct model with structured JSON outputs

export class AIService {
  async findRelevantMemories(
    query: string,
    memories: Memory[],
    maxResults: number = 5,
    userId?: string
  ): Promise<Memory[]> {
    if (!memories.length || !query.trim()) {
      return [];
    }

    try {
      // First, try vector-based semantic search for better performance and accuracy
      // If userId is provided, use it for more accurate search
      if (userId) {
        const vectorResults = await vectorService.searchMemories(
          query,
          userId,
          maxResults,
          0.1
        );

        if (vectorResults.length > 0) {
          // Convert vector results back to Memory objects maintaining similarity order
          const relevantMemories = vectorResults
            .map((result) => memories.find((m) => m.id === result.id))
            .filter(Boolean) as Memory[];

          console.log(
            `Vector search found ${relevantMemories.length} relevant memories`
          );
          return relevantMemories.slice(0, maxResults);
        }
      } else {
        // Fallback: try vector search without userId (less accurate but still useful)
        const vectorResults = await vectorService.searchMemories(
          query,
          "",
          maxResults,
          0.1
        );

        if (vectorResults.length > 0) {
          // Convert vector results back to Memory objects
          const relevantMemories = vectorResults
            .map((result) => memories.find((m) => m.id === result.id))
            .filter(Boolean) as Memory[];

          if (relevantMemories.length > 0) {
            console.log(
              `Vector search found ${relevantMemories.length} relevant memories`
            );
            return relevantMemories.slice(0, maxResults);
          }
        }
      }

      // Fallback to AI-based analysis for smaller datasets or when vector search fails
      console.log("Falling back to AI-based memory analysis");

      const memoriesText = memories
        .map(
          (memory, index) =>
            `[${index}] ${memory.content} (Category: ${memory.category})`
        )
        .join("\n\n");

      const prompt = `Given the user's query: "${query}"

Here are their saved memories:
${memoriesText}

Analyze which memories are most relevant to the query. Consider:
1. Direct content matches
2. Contextual relevance
3. Semantic similarity
4. Conceptual connections

Respond with a JSON object in this exact format:
{
  "indices": [array of numbers representing the indices of the ${maxResults} most relevant memories],
  "reasoning": "brief explanation of why these memories are relevant"
}

If no memories are relevant, return an empty array for indices.`;

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "kimi-k2-turbo",
        temperature: 0.1,
        max_tokens: 200,
        response_format: { type: "json_object" },
      });

      const responseContent = completion.choices[0]?.message?.content;

      if (!responseContent) {
        return [];
      }

      // Parse the JSON response using robust parser
      const parsedResponse = parseAiJsonResponse(responseContent);
      const indices = parsedResponse.indices || [];

      // Validate indices are within bounds
      const validIndices = indices.filter(
        (i: number) => Number.isInteger(i) && i >= 0 && i < memories.length
      );

      // Return the corresponding memories
      return validIndices.map((i: number) => memories[i]).slice(0, maxResults);
    } catch (error) {
      console.error("Error finding relevant memories with AI:", error);

      // Final fallback to simple text search
      const searchTerms = query
        .toLowerCase()
        .split(" ")
        .filter((term) => term.length > 2);
      return memories
        .filter((memory) => {
          const content = memory.content.toLowerCase();
          return searchTerms.some((term) => content.includes(term));
        })
        .slice(0, maxResults);
    }
  }

  async generateMemoryTags(content: string): Promise<string[]> {
    try {
      const prompt = `Analyze this text and generate 3-5 relevant tags that would help categorize and search for this memory later:

"${content}"

Generate tags that are:
- Single words or short phrases
- Descriptive and specific
- Useful for searching
- Not too generic

Respond with a JSON object in this exact format:
{
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Example tags: technology, programming, project idea, web development`;

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "kimi-k2-turbo",
        temperature: 0.3,
        max_tokens: 100,
        response_format: { type: "json_object" },
      });

      const responseContent = completion.choices[0]?.message?.content;

      if (!responseContent) {
        return [];
      }

      // Parse the JSON response using robust parser
      const parsedResponse = parseAiJsonResponse(responseContent);
      const tags = parsedResponse.tags || [];

      return tags
        .map((tag: string) => tag.trim().toLowerCase())
        .filter((tag: string) => tag.length > 0 && tag.length <= 30)
        .slice(0, 5);
    } catch (error) {
      console.error("Error generating memory tags with AI:", error);
      return [];
    }
  }

  async categorizeMemory(
    content: string,
    availableCategories?: string[]
  ): Promise<string> {
    try {
      // Use fixed categories or fall back to default categories
      const categories = availableCategories || [
        "Personal Info",
        "Work & Career",
        "Food & Recipes",
        "Entertainment",
        "Travel & Places",
        "Health & Fitness",
        "Learning & Education",
        "Hobbies & Interests",
        "Relationships",
        "Finance & Money",
        "Technology",
        "Home & Lifestyle",
        "Goals & Planning",
        "General",
      ];

      const categoriesList = categories.map((cat) => `- ${cat}`).join("\n");

      const prompt = `You are an expert at categorizing personal memories. Your task is to analyze the memory content and select the MOST APPROPRIATE category from the provided list.

CRITICAL INSTRUCTIONS:
1. You MUST respond with valid JSON in the exact format specified
2. The "category" field MUST be one of the exact category names from the list below
3. Do NOT create new categories or modify existing ones
4. Be specific and avoid defaulting to "General" unless truly necessary
5. Focus on the PRIMARY purpose/topic of the memory

Available categories:
${categoriesList}

Memory to categorize: "${content}"

Categorization Guidelines:

**Personal Info**: Basic personal details, identity information, personal preferences, physical characteristics, personal history, family background, personal documents, contact information, demographics.
Examples: "My name is John Smith", "I'm 28 years old", "I live in New York", "My favorite color is blue", "I was born in California", "I have two siblings"

**Work & Career**: Job-related information, career goals, work experiences, professional skills, workplace events, business contacts, work projects, salary information, professional development, job interviews, work schedule.
Examples: "I work as a software engineer at Google", "My boss is Sarah", "I have a meeting with the client tomorrow", "I got promoted to senior developer", "I'm learning React for my job"

**Relationships**: Information about family, friends, romantic partners, social connections, relationship status, social events, interpersonal dynamics.
Examples: "My wife loves gardening", "Had dinner with my best friend Mike", "My daughter started school today"

**Learning & Education**: Academic information, courses, skills being learned, educational goals, study materials, school experiences, certifications.
Examples: "I'm taking a Python course", "Learned about machine learning today", "Need to study for my exam"

**Health & Fitness**: Medical information, fitness goals, exercise routines, health conditions, diet information, mental health, wellness activities.
Examples: "I have diabetes", "Started running 3 miles daily", "My doctor prescribed new medication"

**Goals & Planning**: Future plans, aspirations, goals, project ideas, upcoming events, reminders, scheduling.
Examples: "I want to start a business next year", "Planning to visit Japan in summer", "Goal to read 50 books this year"

**Technology**: Tech-related information, programming, software, hardware, digital tools, technical knowledge.
Examples: "I use VS Code for development", "Learned about Docker containers", "My laptop has 16GB RAM"

**Finance & Money**: Financial information, expenses, investments, income, budgeting, financial goals.
Examples: "Invested $1000 in stocks", "My rent is $2000/month", "Saving for a house down payment"

**Food & Recipes**: Cooking, recipes, restaurant visits, food preferences, dietary restrictions.
Examples: "Made spaghetti carbonara today", "I'm allergic to peanuts", "Love the pizza at Mario's"

**Travel & Places**: Travel experiences, places visited, travel plans, location information, geographical preferences.
Examples: "Visited Paris last month", "The view from my hotel was amazing", "Planning a trip to Thailand"

**Entertainment**: Movies, music, books, games, shows, cultural activities, hobbies for fun.
Examples: "Watched The Avengers last night", "Love listening to jazz music", "Started reading Dune"

**Home & Lifestyle**: Home-related information, household items, daily routines, living situation, home improvement.
Examples: "Need to fix the kitchen sink", "Bought new curtains for the bedroom", "My morning routine includes meditation"

**Hobbies & Interests**: Personal interests, recreational activities, collections, creative pursuits, sports participation.
Examples: "I collect vintage guitars", "Started learning photography", "Play tennis every weekend"

**General**: Information that doesn't clearly fit into other categories, general observations, miscellaneous notes.
Examples: "The weather was nice today", "Random thought about life", "Interesting fact I learned"

IMPORTANT DECISION PROCESS:
1. Read the memory content carefully
2. Identify the PRIMARY topic or purpose
3. Match it to the MOST SPECIFIC category available
4. Only use "General" if NO other category fits
5. Provide HIGH confidence (0.8-1.0) for clear matches
6. Provide LOWER confidence (0.5-0.7) for uncertain matches

You MUST respond with valid JSON in this EXACT format (no markdown, no extra text):
{
  "category": "exact category name from the list above",
  "confidence": 0.95,
  "reasoning": "brief explanation of why this category was chosen"
}`;

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "kimi-k2-turbo",
        temperature: 0.0, // Use 0 for maximum consistency
        max_tokens: 150, // Reduce tokens for more focused responses
        response_format: { type: "json_object" },
      });

      const responseContent = completion.choices[0]?.message?.content;

      if (!responseContent) {
        return "General";
      }

      // Parse the JSON response using robust categorization parser
      const result = parseCategorizeResponse(responseContent, categories);

      return result.category;
    } catch (error) {
      console.error("Error categorizing memory with AI:", error);
      return "General";
    }
  }

  async detectNewMemoryInQuery(
    query: string,
    existingMemories: Memory[] = [],
    availableCategories?: string[]
  ): Promise<{
    hasNewMemory: boolean;
    extractedMemory?: string;
    category?: string;
    confidence?: number;
    reasoning?: string;
  }> {
    try {
      const categories = availableCategories || [
        "Personal Info",
        "Work & Career",
        "Food & Recipes",
        "Entertainment",
        "Travel & Places",
        "Health & Fitness",
        "Learning & Education",
        "Hobbies & Interests",
        "Relationships",
        "Finance & Money",
        "Technology",
        "Home & Lifestyle",
        "Goals & Planning",
        "General",
      ];

      const categoriesList = categories.map((cat) => `- ${cat}`).join("\n");

      // Prepare existing memories context (limit to recent ones to avoid token overflow)
      const recentMemories = existingMemories.slice(0, 20);
      const existingMemoriesContext =
        recentMemories.length > 0
          ? `\n\nExisting memories to check against (avoid duplicates):\n${recentMemories.map((m, i) => `${i + 1}. ${m.content} (${m.category})`).join("\n")}`
          : "";

      const prompt = `You are an expert at detecting new personal memory information. Analyze the user query to determine if it contains NEW personal information that should be saved as a memory.

User Query: "${query}"

Look for NEW information that represents:
- Personal facts, preferences, or experiences
- Goals, plans, or aspirations
- Important life events or milestones
- Skills, knowledge, or learning
- Relationships or social connections
- Health, habits, or lifestyle information
- Work or career-related information
- Any other personally significant information

Available categories:
${categoriesList}${existingMemoriesContext}

Guidelines:
1. **Detect NEW Information Only**: Only extract information that is new, specific, and worth remembering
2. **Avoid Duplicates**: Don't extract information that's already covered in existing memories
3. **Ignore Questions**: If the query is just asking for information, set hasNewMemory to false
4. **Focus on Facts**: Extract concrete facts, events, preferences, or plans - not vague statements
5. **Be Specific**: Extract the specific new information, not the entire query

Examples of NEW memory information:
- "I just started working at Microsoft as a software engineer" (Work & Career)
- "My favorite restaurant is now Joe's Pizza on 5th Street" (Food & Recipes)
- "I moved to San Francisco last week" (Personal Info)
- "I'm planning to learn Spanish this year" (Learning & Education)
- "My new project involves building a mobile app" (Work & Career)

Examples of NOT new memory information:
- "What restaurants do I like?" (just a question)
- "Tell me about my work" (asking for existing info)
- "I think it's nice today" (too vague/temporary)

Respond with a JSON object in this exact format:
{
  "hasNewMemory": true/false,
  "extractedMemory": "specific new information to save (if hasNewMemory is true)",
  "category": "exact category name from the list (if hasNewMemory is true)",
  "confidence": 0.95,
  "reasoning": "explanation of why this is/isn't new memory information"
}`;

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "kimi-k2-turbo",
        temperature: 0.1,
        max_tokens: 300,
        response_format: { type: "json_object" },
      });

      const responseContent = completion.choices[0]?.message?.content;

      if (!responseContent) {
        return { hasNewMemory: false };
      }

      // Parse the JSON response using robust parser
      const parsedResponse = parseAiJsonResponse(responseContent);

      // Validate the response
      const hasNewMemory = parsedResponse.hasNewMemory === true;
      const extractedMemory = hasNewMemory
        ? (parsedResponse.extractedMemory || "").trim()
        : "";
      const category =
        hasNewMemory && categories.includes(parsedResponse.category)
          ? parsedResponse.category
          : "General";

      if (hasNewMemory) {
        console.log(
          `Detected new memory: '${extractedMemory}' in category '${category}' with confidence ${parsedResponse.confidence}`
        );
      }

      return {
        hasNewMemory,
        extractedMemory,
        category,
        confidence: parsedResponse.confidence || 0,
        reasoning: parsedResponse.reasoning || "",
      };
    } catch (error) {
      console.error("Error detecting new memory in query:", error);
      return { hasNewMemory: false };
    }
  }

  /**
   * Find memories similar to a given memory using vector similarity
   */
  async findSimilarMemories(
    memoryId: string,
    userId: string,
    maxResults: number = 5,
    similarityThreshold: number = 0.3
  ): Promise<Memory[]> {
    try {
      // Use vector service to find similar memories
      const vectorResults = await vectorService.findSimilarMemories(
        memoryId,
        userId,
        maxResults,
        similarityThreshold
      );

      // Convert vector results to Memory format
      const similarMemories: Memory[] = vectorResults.map(result => ({
        id: result.id,
        content: result.content,
        category: result.category,
        source: 'similar-search',
        tags: result.tags.split(',').filter(tag => tag.trim()),
        createdAt: result.createdAt
      }));

      console.log(`Found ${similarMemories.length} similar memories for ${memoryId}`);
      return similarMemories;

    } catch (error) {
      console.error('Error finding similar memories:', error);
      return [];
    }
  }
}

export const aiService = new AIService();
