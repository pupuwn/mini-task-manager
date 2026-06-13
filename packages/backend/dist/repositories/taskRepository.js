"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRepository = void 0;
const uuid_1 = require("uuid");
// ─── In-Memory Task Repository ──────────────────────────────────────
const tasks = new Map();
exports.taskRepository = {
    findAll() {
        return Array.from(tasks.values());
    },
    findById(id) {
        return tasks.get(id);
    },
    create(title, description) {
        const now = new Date().toISOString();
        const task = {
            id: (0, uuid_1.v4)(),
            title,
            description,
            status: "to_do",
            createdAt: now,
            updatedAt: now,
        };
        tasks.set(task.id, task);
        return task;
    },
    updateStatus(id, status) {
        const task = tasks.get(id);
        if (!task)
            return undefined;
        const updated = {
            ...task,
            status,
            updatedAt: new Date().toISOString(),
        };
        tasks.set(id, updated);
        return updated;
    },
    /** Exposed only for testing — clears all data */
    _clear() {
        tasks.clear();
    },
};
//# sourceMappingURL=taskRepository.js.map