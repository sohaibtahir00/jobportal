import {
  format,
  formatDistanceToNow,
  isAfter,
  isBefore,
  parseISO,
  addDays,
} from "date-fns";

/**
 * Date utility functions using date-fns
 */

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string, formatStr = "MMM dd, yyyy"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Check if a job posting is still active
 */
export function isJobActive(expiresAt: Date | string): boolean {
  const expiryDate = typeof expiresAt === "string" ? parseISO(expiresAt) : expiresAt;
  return isAfter(expiryDate, new Date());
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return isBefore(dateObj, new Date());
}

/**
 * Get date N days from now
 */
export function getDaysFromNow(days: number): Date {
  return addDays(new Date(), days);
}

/**
 * Format date range
 */
export function formatDateRange(
  startDate: Date | string,
  endDate?: Date | string | null
): string {
  const start = formatDate(startDate, "MMM yyyy");

  if (!endDate) {
    return `${start} - Present`;
  }

  const end = formatDate(endDate, "MMM yyyy");
  return `${start} - ${end}`;
}
