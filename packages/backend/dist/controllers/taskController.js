"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const taskService_1 = require("../services/taskService");
const errors_1 = require("../errors");
// ─── Task Controller — HTTP in/out, delegates to service ────────────
exports.taskController = {
    // GET /tasks
    getAllTasks(_req, res) {
        const tasks = taskService_1.taskService.getAllTasks();
        res.json({ data: tasks });
    },
    // GET /tasks/:id
    getTaskById(req, res) {
        try {
            const task = taskService_1.taskService.getTaskById(req.params.id);
            res.json({ data: task });
        }
        catch (err) {
            handleError(res, err);
        }
    },
    // POST /tasks
    createTask(req, res) {
        const { title, description } = req.body;
        if (!title || typeof title !== "string" || title.trim().length === 0) {
            res.status(400).json({ error: "Title is required and must be a non-empty string" });
            return;
        }
        const task = taskService_1.taskService.createTask(title.trim(), description?.trim());
        res.status(201).json({ data: task });
    },
    // PUT /tasks/:id/status
    updateTaskStatus(req, res) {
        const { status, actor, message } = req.body;
        if (!status) {
            res.status(400).json({ error: "Status is required" });
            return;
        }
        if (!actor) {
            res.status(400).json({ error: "Actor is required" });
            return;
        }
        try {
            const result = taskService_1.taskService.updateTaskStatus(req.params.id, status, actor, message);
            res.json({ data: result.task, auditLog: result.auditLog ?? null });
        }
        catch (err) {
            handleError(res, err);
        }
    },
    // GET /tasks/:id/audit-logs
    getAuditLogsByTaskId(req, res) {
        try {
            const logs = taskService_1.taskService.getAuditLogsByTaskId(req.params.id);
            res.json({ data: logs });
        }
        catch (err) {
            handleError(res, err);
        }
    },
    // GET /audit-logs
    getAllAuditLogs(_req, res) {
        const logs = taskService_1.taskService.getAllAuditLogs();
        res.json({ data: logs });
    },
};
// ─── Error mapper ────────────────────────────────────────────────────
function handleError(res, err) {
    if (err instanceof errors_1.AppError) {
        res.status(err.statusCode).json({
            error: err.message,
            ...(err.details && { details: err.details }),
        });
        return;
    }
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
}
//# sourceMappingURL=taskController.js.map