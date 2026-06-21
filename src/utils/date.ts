/**
 * Format a Date object as YYYY-MM-DD.
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a Date object as HH:MM (24-hour).
 */
export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format a duration in minutes as "Xh Ym".
 * Examples: 90 -> "1h 30m", 45 -> "0h 45m", 120 -> "2h 0m"
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Returns a Date object representing N days ago from now, at midnight local time.
 */
export function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Returns an array of YYYY-MM-DD strings for each day in the range
 * from startDate to endDate (inclusive).
 */
export function getDateRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Convert a Date object to a nanoseconds string for the Google Fit API.
 */
export function toNanos(date: Date): string {
  return (date.getTime() * 1_000_000).toString();
}

/**
 * Convert a nanoseconds string from the Google Fit API back to a Date object.
 */
export function fromNanos(nanos: string): Date {
  const millis = Math.floor(Number(nanos) / 1_000_000);
  return new Date(millis);
}
