export type WithError<T> = T & { error: Error | null };

export class UpdateError extends Error {
  constructor(Error: Error) {
    super(Error.message);
    this.name = 'UpdateError';
  }
}

export class DeleteError extends Error {
  constructor(Error: Error) {
    super(Error.message);
    this.name = 'DeleteError';
  }
}
