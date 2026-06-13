import { Request, Response } from "express";
import { taskService } from "../services/taskService";
import { AppError } from "../errors";
import { Status } from "../types";

// Task Controller

export const taskController = {
  // GET /tasks
  getAllTasks(_req: Request, res: Response): void {
    const tasks = taskService.getAllTasks();
    res.json({ data: tasks });
  },

  // GET /tasks/:id
  getTaskById(req: Request, res: Response): void {
    try {
      const task = taskService.getTaskById(req.params.id as string);
      res.json({ data: task });
    } catch (err) {
      handleError(res, err);
    }
  },

  // POST /tasks
  createTask(req: Request, res: Response): void {
    const { title, description } = req.body as {
      title?: string;
      description?: string;
    };

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      res.status(400).json({ error: "Title is required and must be a non-empty string" });
      return;
    }

    const task = taskService.createTask(title.trim(), description?.trim());
    res.status(201).json({ data: task });
  },

  // PUT /tasks/:id/status
  updateTaskStatus(req: Request, res: Response): void {
    const { status, actor, message } = req.body as {
      status?: Status;
      actor?: string;
      message?: string;
    };

    if (!status) {
      res.status(400).json({ error: "Status is required" });
      return;
    }

    if (!actor) {
      res.status(400).json({ error: "Actor is required" });
      return;
    }

    try {
      const result = taskService.updateTaskStatus(req.params.id as string, status, actor, message);
      res.json({ data: result.task, auditLog: result.auditLog ?? null });
    } catch (err) {
      handleError(res, err);
    }
  },

  // DELETE /tasks/:id
  deleteTask(req: Request, res: Response): void {
    try {
      taskService.deleteTask(req.params.id as string);
      res.status(204).send();
    } catch (err) {
      handleError(res, err);
    }
  },

  // GET /tasks/:id/audit-logs
  getAuditLogsByTaskId(req: Request, res: Response): void {
    try {
      const logs = taskService.getAuditLogsByTaskId(req.params.id as string);
      res.json({ data: logs });
    } catch (err) {
      handleError(res, err);
    }
  },

  // GET /audit-logs
  getAllAuditLogs(_req: Request, res: Response): void {
    const logs = taskService.getAllAuditLogs();
    res.json({ data: logs });
  },
};

// Error mapper

function handleError(res: Response, err: unknown): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  console.error("Unexpected error:", err);
  res.status(500).json({ error: "Internal server error" });
}
