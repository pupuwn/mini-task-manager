import { v4 as uuidv4 } from "uuid";
import { Task, Status } from "../types";

// In-Memory Task Repository

const tasks = new Map<string, Task>();

export const taskRepository = {
  findAll(): Task[] {
    return Array.from(tasks.values());
  },

  findById(id: string): Task | undefined {
    return tasks.get(id);
  },

  create(title: string, description?: string): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: "to_do",
      createdAt: now,
      updatedAt: now,
    };
    tasks.set(task.id, task);
    return task;
  },

  updateStatus(id: string, status: Status): Task | undefined {
    const task = tasks.get(id);
    if (!task) return undefined;

    const updated: Task = {
      ...task,
      status,
      updatedAt: new Date().toISOString(),
    };
    tasks.set(id, updated);
    return updated;
  },

  delete(id: string): boolean {
    return tasks.delete(id);
  },

  /** Exposed only for testing — clears all data */
  _clear(): void {
    tasks.clear();
  },
};
