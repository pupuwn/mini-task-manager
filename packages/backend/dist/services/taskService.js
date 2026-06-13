"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = void 0;
const types_1 = require("../types");
const taskRepository_1 = require("../repositories/taskRepository");
const auditLogRepository_1 = require("../repositories/auditLogRepository");
const errors_1 = require("../errors");
// ─── Task Service — All Business Logic Lives Here ───────────────────
exports.taskService = {
    getAllTasks() {
        return taskRepository_1.taskRepository.findAll();
    },
    getTaskById(id) {
        const task = taskRepository_1.taskRepository.findById(id);
        if (!task) {
            throw new errors_1.NotFoundError(`Task with id "${id}" not found`);
        }
        return task;
    },
    createTask(title, description) {
        return taskRepository_1.taskRepository.create(title, description);
    },
    /**
     * Advance a task's status.
     *
     * Business rules enforced:
     *  1. Task must exist                            → 404
     *  2. Actor must be in PREDEFINED_ACTORS          → 422
     *  3. Same status as current → return task as-is  → 200 (idempotent, no audit log)
     *  4. "done" task cannot change further            → 400
     *  5. Status can only advance one step forward     → 400
     *  6. Status update + audit log are atomic
     */
    updateTaskStatus(taskId, newStatus, actor, message) {
        // 1. Task must exist
        const task = taskRepository_1.taskRepository.findById(taskId);
        if (!task) {
            throw new errors_1.NotFoundError(`Task with id "${taskId}" not found`);
        }
        // 2. Validate actor
        if (!types_1.PREDEFINED_ACTORS.includes(actor)) {
            throw new errors_1.InvalidActorError(actor);
        }
        // 3. Idempotent — same status, no-op
        if (task.status === newStatus) {
            return { task };
        }
        // 4. "done" tasks are terminal
        if (task.status === "done") {
            throw new errors_1.InvalidTransitionError(task.status, newStatus);
        }
        // 5. Only single-step forward transitions
        const currentIndex = types_1.STATUS_SEQUENCE.indexOf(task.status);
        const newIndex = types_1.STATUS_SEQUENCE.indexOf(newStatus);
        if (newIndex === -1 || newIndex !== currentIndex + 1) {
            throw new errors_1.InvalidTransitionError(task.status, newStatus);
        }
        // 6. Atomic: update status then append audit log
        const updatedTask = taskRepository_1.taskRepository.updateStatus(taskId, newStatus);
        const auditLog = auditLogRepository_1.auditLogRepository.create(taskId, updatedTask.title, actor, task.status, newStatus, message);
        return { task: updatedTask, auditLog };
    },
    // ─── Audit Log Queries ──────────────────────────────────────────
    getAllAuditLogs() {
        return auditLogRepository_1.auditLogRepository.findAll();
    },
    getAuditLogsByTaskId(taskId) {
        // Verify the task exists first
        const task = taskRepository_1.taskRepository.findById(taskId);
        if (!task) {
            throw new errors_1.NotFoundError(`Task with id "${taskId}" not found`);
        }
        return auditLogRepository_1.auditLogRepository.findByTaskId(taskId);
    },
};
//# sourceMappingURL=taskService.js.map