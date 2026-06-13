export declare class AppError extends Error {
    readonly statusCode: number;
    readonly details?: Record<string, unknown> | undefined;
    constructor(message: string, statusCode: number, details?: Record<string, unknown> | undefined);
}
export declare class NotFoundError extends AppError {
    constructor(message: string);
}
export declare class InvalidTransitionError extends AppError {
    constructor(currentStatus: string, attemptedStatus: string);
}
export declare class InvalidActorError extends AppError {
    constructor(actor: string);
}
//# sourceMappingURL=index.d.ts.map