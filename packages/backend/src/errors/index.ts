// Custom Errors

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class InvalidTransitionError extends AppError {
  constructor(currentStatus: string, attemptedStatus: string) {
    super(
      `Invalid status transition from "${currentStatus}" to "${attemptedStatus}"`,
      400,
      { currentStatus, attemptedStatus }
    );
  }
}

export class InvalidActorError extends AppError {
  constructor(actor: string) {
    super(`Invalid actor: "${actor}" is not a predefined actor`, 422, {
      actor,
    });
  }
}
