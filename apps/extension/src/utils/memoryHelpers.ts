// Helper functions for memory handling

/**
 * Get tags array from memory tags (handles both string and array formats)
 */
export function getMemoryTagsArray(tags: string | string[]): string[] {
  if (Array.isArray(tags)) {
    return tags.filter(tag => tag.trim().length > 0);
  }
  if (typeof tags === 'string' && tags.trim()) {
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }
  return [];
}

/**
 * Convert tags to comma-separated string format
 */
export function formatTagsForApi(tags: string | string[]): string {
  const tagsArray = getMemoryTagsArray(tags);
  return tagsArray.join(', ');
}

/**
 * Check if memory has tags
 */
export function hasMemoryTags(tags: string | string[]): boolean {
  return getMemoryTagsArray(tags).length > 0;
}