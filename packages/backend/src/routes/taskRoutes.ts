import { Router } from "express";
import { taskController } from "../controllers/taskController";

// Routes

const router = Router();

router.get("/tasks", taskController.getAllTasks);
router.get("/tasks/:id", taskController.getTaskById);
router.post("/tasks", taskController.createTask);
router.put("/tasks/:id/status", taskController.updateTaskStatus);
router.delete("/tasks/:id", taskController.deleteTask);
router.get("/tasks/:id/audit-logs", taskController.getAuditLogsByTaskId);
router.get("/audit-logs", taskController.getAllAuditLogs);

export default router;
