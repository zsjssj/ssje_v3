/**
 * Generate a placeholder image URL using picsum.photos service
 * @param seed - Unique identifier for the image
 * @param width - Image width
 * @param height - Image height
 * @returns URL of the placeholder image
 */
export const getPlaceholderImage = (seed: string, width: number = 400, height: number = 400): string => {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}

/**
 * Generate a placeholder avatar URL
 * @param seed - Unique identifier for the avatar
 * @param size - Avatar size (width and height)
 * @returns URL of the placeholder avatar
 */
export const getPlaceholderAvatar = (seed: string, size: number = 100): string => {
  return getPlaceholderImage(seed, size, size)
}
