import { AuditLog, Status } from "../types";
export declare const auditLogRepository: {
    findAll(): AuditLog[];
    findByTaskId(taskId: string): AuditLog[];
    create(taskId: string, taskTitle: string, actor: string, fromStatus: Status, toStatus: Status, customMessage?: string): AuditLog;
    /** Exposed only for testing — clears all data */
    _clear(): void;
};
//# sourceMappingURL=auditLogRepository.d.ts.map