export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function readingTime(words: number): number {
  return Math.max(1, Math.round(words / 200));
}
