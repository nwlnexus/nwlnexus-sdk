export class DeprecationError extends Error {
  constructor(message: string) {
    super(`Deprecation:\n${message}`);
  }
}

export class FatalError extends Error {
  constructor(
    message?: string,
    // eslint-disable-next-line no-unused-vars
    readonly code?: number
  ) {
    super(message);
  }
}
