export type FirestoreTimestamp =
  | string
  | number
  | null
  | undefined
  | { _seconds: number; _nanoseconds: number }
  | { seconds: number; nanoseconds: number };

export function parseFirestoreDate(value: FirestoreTimestamp): Date | null {
  if (value === null || value === undefined) return null;

  if (typeof value === 'string') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'number') {
    return new Date(value);
  }

  if ('_seconds' in value && typeof value._seconds === 'number') {
    return new Date(value._seconds * 1000);
  }

  if ('seconds' in value && typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000);
  }

  return null;
}

export function safeFormatDistance(
  value: FirestoreTimestamp,
  formatFn: (date: Date) => string,
  fallback = ''
): string {
  const date = parseFirestoreDate(value);
  if (!date) return fallback;
  try {
    return formatFn(date);
  } catch {
    return fallback;
  }
}