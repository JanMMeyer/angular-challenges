export type WithError<T> = T & { error: Error | null };
