"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
// ─── Routes — no logic, just wiring ─────────────────────────────────
const router = (0, express_1.Router)();
router.get("/tasks", taskController_1.taskController.getAllTasks);
router.get("/tasks/:id", taskController_1.taskController.getTaskById);
router.post("/tasks", taskController_1.taskController.createTask);
router.put("/tasks/:id/status", taskController_1.taskController.updateTaskStatus);
router.get("/tasks/:id/audit-logs", taskController_1.taskController.getAuditLogsByTaskId);
router.get("/audit-logs", taskController_1.taskController.getAllAuditLogs);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map