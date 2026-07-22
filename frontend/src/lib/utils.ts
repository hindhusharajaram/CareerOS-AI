import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines conditional class names and merges Tailwind CSS classes cleanly without duplicates.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
