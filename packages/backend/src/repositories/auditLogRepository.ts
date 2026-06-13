import { v4 as uuidv4 } from "uuid";
import { AuditLog, Status } from "../types";

// In-Memory Audit Log Repository (Append-Only)

const logs: AuditLog[] = [];

export const auditLogRepository = {
  findAll(): AuditLog[] {
    return [...logs];
  },

  findByTaskId(taskId: string): AuditLog[] {
    return logs.filter((log) => log.taskId === taskId);
  },

  create(
    taskId: string,
    taskTitle: string,
    actor: string,
    fromStatus: Status,
    toStatus: Status,
    customMessage?: string
  ): AuditLog {
    const log: AuditLog = {
      id: uuidv4(),
      taskId,
      taskTitle,
      actor,
      fromStatus,
      toStatus,
      changedAt: new Date().toISOString(),
      message: customMessage || `${actor} changed status from "${fromStatus}" to "${toStatus}"`,
    };
    logs.push(log);
    return log;
  },

  /** Exposed only for testing — clears all data */
  _clear(): void {
    logs.length = 0;
  },
};
