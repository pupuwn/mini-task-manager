import { Task, AuditLog, Status, STATUS_SEQUENCE, PREDEFINED_ACTORS } from "../types";
import { taskRepository } from "../repositories/taskRepository";
import { auditLogRepository } from "../repositories/auditLogRepository";
import {
  NotFoundError,
  InvalidTransitionError,
  InvalidActorError,
} from "../errors";

// Task Service

export const taskService = {
  getAllTasks(): Task[] {
    return taskRepository.findAll();
  },

  getTaskById(id: string): Task {
    const task = taskRepository.findById(id);
    if (!task) {
      throw new NotFoundError(`Task with id "${id}" not found`);
    }
    return task;
  },

  createTask(title: string, description?: string): Task {
    return taskRepository.create(title, description);
  },

  /**
   * Advance a task's status.
   *
   * Task must exist                            → 404
   * Actor must be in PREDEFINED_ACTORS          → 422
   * Same status as current → return task as-is  → 200 (idempotent, no audit log)
   * "done" task cannot change further            → 400
   * Status can only advance one step forward     → 400
   * Status update + audit log are atomic
   */
  updateTaskStatus(
    taskId: string,
    newStatus: Status,
    actor: string,
    message?: string
  ): { task: Task; auditLog?: AuditLog } {
    // Task must exist
    const task = taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task with id "${taskId}" not found`);
    }

    // Validate actor
    if (!(PREDEFINED_ACTORS as readonly string[]).includes(actor)) {
      throw new InvalidActorError(actor);
    }

    // Idempotent — same status, no-op
    if (task.status === newStatus) {
      return { task };
    }

    // "done" tasks are terminal
    if (task.status === "done") {
      throw new InvalidTransitionError(task.status, newStatus);
    }

    // Only single-step forward transitions
    const currentIndex = STATUS_SEQUENCE.indexOf(task.status);
    const newIndex = STATUS_SEQUENCE.indexOf(newStatus);

    if (newIndex === -1 || newIndex !== currentIndex + 1) {
      throw new InvalidTransitionError(task.status, newStatus);
    }

    // Atomic: update status then append audit log
    const updatedTask = taskRepository.updateStatus(taskId, newStatus)!;
    const auditLog = auditLogRepository.create(
      taskId,
      updatedTask.title,
      actor,
      task.status,
      newStatus,
      message
    );

    return { task: updatedTask, auditLog };
  },

  deleteTask(taskId: string): void {
    const task = taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task with id "${taskId}" not found`);
    }
    taskRepository.delete(taskId);
  },

  // Audit Log Queries

  getAllAuditLogs(): AuditLog[] {
    return auditLogRepository.findAll();
  },

  getAuditLogsByTaskId(taskId: string): AuditLog[] {
    // Verify the task exists first
    const task = taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task with id "${taskId}" not found`);
    }
    return auditLogRepository.findByTaskId(taskId);
  },
};
