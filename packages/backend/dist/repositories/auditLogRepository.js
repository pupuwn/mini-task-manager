"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogRepository = void 0;
const uuid_1 = require("uuid");
// ─── In-Memory Audit Log Repository (Append-Only) ───────────────────
const logs = [];
exports.auditLogRepository = {
    findAll() {
        return [...logs];
    },
    findByTaskId(taskId) {
        return logs.filter((log) => log.taskId === taskId);
    },
    create(taskId, taskTitle, actor, fromStatus, toStatus, customMessage) {
        const log = {
            id: (0, uuid_1.v4)(),
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
    _clear() {
        logs.length = 0;
    },
};
//# sourceMappingURL=auditLogRepository.js.map