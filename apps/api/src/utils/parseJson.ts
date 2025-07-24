// Utility for robust JSON parsing from AI responses

/**
 * Robustly parse JSON from AI responses that might include markdown formatting
 * or other wrapper text around the JSON
 */
export function parseAiJsonResponse(responseContent: string): any {
  if (!responseContent || typeof responseContent !== 'string') {
    throw new Error('Invalid response content');
  }

  // Clean and normalize the response
  let cleanContent = responseContent.trim();
  
  // Remove common markdown code block wrapping
  if (cleanContent.startsWith('```json')) {
    cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleanContent.startsWith('```')) {
    cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  
  // Remove any leading/trailing whitespace again
  cleanContent = cleanContent.trim();
  
  // Try to find JSON object boundaries if there's extra text
  const jsonStart = cleanContent.indexOf('{');
  const jsonEnd = cleanContent.lastIndexOf('}');
  
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleanContent = cleanContent.substring(jsonStart, jsonEnd + 1);
  }

  // Handle common AI response patterns
  cleanContent = cleanContent
    // Remove any "Here's the JSON:" or similar prefixes
    .replace(/^.*?(?:here(?:'s|s| is)?\s+(?:the\s+)?json|json\s+(?:response|output|result))[:\s]*/i, '')
    // Remove any trailing explanatory text after the JSON
    .split('\n\n')[0] // Take only the first paragraph if there are multiple
    .trim();

  // Final cleanup - ensure we have a JSON object
  if (!cleanContent.startsWith('{') || !cleanContent.endsWith('}')) {
    // Try to extract JSON from a larger text block
    const match = cleanContent.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
    if (match) {
      cleanContent = match[0];
    } else {
      throw new Error('No valid JSON object found in response');
    }
  }

  try {
    return JSON.parse(cleanContent);
  } catch (parseError) {
    // Log the cleaning attempts for debugging
    console.error('JSON Parse Error:', parseError);
    console.error('Original response:', responseContent);
    console.error('Cleaned content:', cleanContent);
    
    // One more attempt with more aggressive cleaning
    try {
      // Remove all non-JSON characters before first { and after last }
      const veryCleanContent = cleanContent
        .replace(/[^\x20-\x7E]/g, '') // Remove non-printable chars
        .replace(/\\/g, '\\\\') // Escape backslashes
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Remove control chars
      
      return JSON.parse(veryCleanContent);
    } catch (secondError) {
      throw new Error(`Failed to parse JSON after cleaning attempts: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }
  }
}

/**
 * Safe JSON parsing with fallback values
 */
export function safeParseAiJson<T>(
  responseContent: string, 
  fallbackValue: T,
  requiredFields?: (keyof T)[]
): T {
  try {
    const parsed = parseAiJsonResponse(responseContent);
    
    // Validate required fields if specified
    if (requiredFields && requiredFields.length > 0) {
      const missingFields = requiredFields.filter(field => !(field in parsed));
      if (missingFields.length > 0) {
        console.warn(`Missing required fields in AI response: ${missingFields.join(', ')}`);
        return fallbackValue;
      }
    }
    
    return parsed as T;
  } catch (error) {
    console.error('Safe JSON parse failed:', error);
    return fallbackValue;
  }
}

/**
 * Parse categorization response with validation
 */
export function parseCategorizeResponse(
  responseContent: string,
  availableCategories: string[]
): { category: string; confidence: number; reasoning: string } {
  const fallback = {
    category: 'General',
    confidence: 0.5,
    reasoning: 'Failed to parse AI response'
  };

  try {
    const parsed = safeParseAiJson(responseContent, fallback, ['category']);
    
    // Validate category is in available list
    if (parsed.category && availableCategories.includes(parsed.category)) {
      return {
        category: parsed.category,
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
        reasoning: parsed.reasoning || 'No reasoning provided'
      };
    } else {
      console.warn(`Invalid category '${parsed.category}' not in available categories`);
      return fallback;
    }
  } catch (error) {
    console.error('Error parsing categorization response:', error);
    return fallback;
  }
}