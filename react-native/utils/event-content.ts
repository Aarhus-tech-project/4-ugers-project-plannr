import { Event } from "../interfaces/event"

/**
 * Formats a single event's cards for display:
 * 1. First image (most likes)
 * 2. Details card
 * 3. First prompt (most likes)
 * 4. Second image
 * 5. Second prompt
 * ...alternating, all sorted by likes
 * @param event Event object
 * @returns Array formatted for display
 */
export function getSortedEventCards(event: Event) {
  const sortedImages = [...(event.images ?? [])].sort((a, b) => b.likes - a.likes)
  const sortedPrompts = [...(event.prompts ?? [])].sort((a, b) => b.likes - a.likes)

  const result = []

  // 1. First image (if any)
  if (sortedImages.length > 0) {
    result.push({ type: "image", image: sortedImages[0], event })
  }

  // 2. Details card
  result.push({ type: "details", event })

  // Alternate prompts and images, starting from index 0 (since first image is already used)
  let imgIdx = 1
  let prIdx = 0
  while (imgIdx < sortedImages.length || prIdx < sortedPrompts.length) {
    if (prIdx < sortedPrompts.length) {
      result.push({ type: "prompt", prompt: sortedPrompts[prIdx], event })
      prIdx++
    }
    if (imgIdx < sortedImages.length) {
      result.push({ type: "image", image: sortedImages[imgIdx], event })
      imgIdx++
    }
  }

  return result
}
