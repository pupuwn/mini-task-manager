import { Task, AuditLog, Status } from "../types";
export declare const taskService: {
    getAllTasks(): Task[];
    getTaskById(id: string): Task;
    createTask(title: string, description?: string): Task;
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
    updateTaskStatus(taskId: string, newStatus: Status, actor: string, message?: string): {
        task: Task;
        auditLog?: AuditLog;
    };
    getAllAuditLogs(): AuditLog[];
    getAuditLogsByTaskId(taskId: string): AuditLog[];
};
//# sourceMappingURL=taskService.d.ts.map