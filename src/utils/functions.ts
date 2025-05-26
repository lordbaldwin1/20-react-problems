import { oxford3000 } from "./oxford3000";

export function generateRandomWords(wordCount: number = 25): string {
  const result: string[] = [];
  
  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * oxford3000.length);
    result.push(oxford3000[randomIndex]);
  }
  
  return result.join(" ");
}