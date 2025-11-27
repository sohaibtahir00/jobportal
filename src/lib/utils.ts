import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format salary range
 */
export function formatSalaryRange(
  min: number,
  max: number,
  currency = "USD"
): string {
  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Get the backend URL for assets/images
 * In production, images are served from the backend
 */
export function getBackendUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || '';
}

/**
 * Resolve image URL - converts relative paths to absolute backend URLs
 * @param url - The image URL (can be relative like /uploads/... or absolute)
 * @returns The resolved absolute URL
 */
export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // If already an absolute URL (http:// or https://), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a relative URL starting with /uploads or /api/uploads, prepend backend URL
  if (url.startsWith('/uploads') || url.startsWith('/api/uploads')) {
    const backendUrl = getBackendUrl();
    if (backendUrl) {
      // Convert /uploads/... to /api/uploads/... for the backend API route
      const apiPath = url.startsWith('/api/uploads') ? url : `/api${url}`;
      return `${backendUrl}${apiPath}`;
    }
  }

  // Return original URL if no transformation needed
  return url;
}
