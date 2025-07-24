const OpenAI = require("openai");
const { PrismaClient } = require("@prisma/client");

const openai = new OpenAI({
  apiKey: process.env.NAHCROF_API_KEY,
  baseURL: "https://ai.nahcrof.com/v2",
});

const prisma = new PrismaClient();

async function debugEmbeddings() {
  console.log("=== DEBUG: Testing Embedding Generation ===");
  
  try {
    // Test 1: Generate embedding for sample text
    const testText = "Has already worked for 2 years as a developer.";
    console.log(`\n1. Testing embedding generation for: "${testText}"`);
    
    const response = await openai.embeddings.create({
      model: "multilingual-e5-large-instruct",
      input: testText,
    });
    
    console.log("Raw API Response Keys:", Object.keys(response));
    console.log("Response data structure:", {
      dataLength: response.data?.length,
      firstItemKeys: response.data?.[0] ? Object.keys(response.data[0]) : 'N/A',
      embeddingLength: response.data?.[0]?.embedding?.length,
      embeddingType: typeof response.data?.[0]?.embedding,
      firstFewValues: response.data?.[0]?.embedding?.slice(0, 5),
      lastFewValues: response.data?.[0]?.embedding?.slice(-5)
    });
    
    const embedding = response.data[0].embedding;
    
    // Test 2: Check if embedding values are valid
    console.log("\n2. Embedding validation:");
    console.log("- Length:", embedding.length);
    console.log("- All zeros?", embedding.every(v => v === 0));
    console.log("- All NaN?", embedding.every(v => isNaN(v)));
    console.log("- Contains infinities?", embedding.some(v => !isFinite(v)));
    console.log("- Sample values:", embedding.slice(0, 10));
    
    // Test 3: Calculate magnitude
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    console.log("- Magnitude:", magnitude);
    
    // Test 4: Check existing embeddings in database
    console.log("\n3. Database check:");
    const embeddingCount = await prisma.memoryEmbedding.count();
    console.log("- Total embeddings in DB:", embeddingCount);
    
    if (embeddingCount > 0) {
      const sampleEmbedding = await prisma.memoryEmbedding.findFirst({
        select: {
          id: true,
          dimensions: true,
          embedding: true,
          model: true,
          memory: {
            select: {
              content: true
            }
          }
        }
      });
      
      console.log("- Sample DB embedding:");
      console.log("  - ID:", sampleEmbedding.id);
      console.log("  - Dimensions:", sampleEmbedding.dimensions);
      console.log("  - Model:", sampleEmbedding.model);
      console.log("  - Memory content:", sampleEmbedding.memory?.content);
      console.log("  - Embedding length:", sampleEmbedding.embedding?.length);
      console.log("  - All zeros?", sampleEmbedding.embedding?.every(v => v === 0));
      console.log("  - First 5 values:", sampleEmbedding.embedding?.slice(0, 5));
      console.log("  - Magnitude:", Math.sqrt(sampleEmbedding.embedding?.reduce((sum, val) => sum + val * val, 0) || 0));
    }
    
    // Test 5: Test cosine similarity with itself (should be 1.0)
    console.log("\n4. Cosine similarity test:");
    function cosineSimilarity(vectorA, vectorB) {
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
    
    const selfSimilarity = cosineSimilarity(embedding, embedding);
    console.log("- Self similarity (should be 1.0):", selfSimilarity);
    
    // Test 6: Test with different text
    const testText2 = "Experienced software engineer with development background.";
    console.log(`\n5. Testing with different text: "${testText2}"`);
    
    const response2 = await openai.embeddings.create({
      model: "multilingual-e5-large-instruct", 
      input: testText2,
    });
    
    const embedding2 = response2.data[0].embedding;
    const crossSimilarity = cosineSimilarity(embedding, embedding2);
    console.log("- Cross similarity (should be > 0):", crossSimilarity);
    
  } catch (error) {
    console.error("ERROR during debugging:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      status: error.status,
      response: error.response?.data
    });
  } finally {
    await prisma.$disconnect();
  }
}

debugEmbeddings();