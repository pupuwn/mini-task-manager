"use strict";
// ─── Custom Application Errors ───────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidActorError = exports.InvalidTransitionError = exports.NotFoundError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = this.constructor.name;
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class InvalidTransitionError extends AppError {
    constructor(currentStatus, attemptedStatus) {
        super(`Invalid status transition from "${currentStatus}" to "${attemptedStatus}"`, 400, { currentStatus, attemptedStatus });
    }
}
exports.InvalidTransitionError = InvalidTransitionError;
class InvalidActorError extends AppError {
    constructor(actor) {
        super(`Invalid actor: "${actor}" is not a predefined actor`, 422, {
            actor,
        });
    }
}
exports.InvalidActorError = InvalidActorError;
//# sourceMappingURL=index.js.map