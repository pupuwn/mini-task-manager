// Status & Sequence
export type Status = "to_do" | "pending" | "in_progress" | "done";

export const STATUS_SEQUENCE: readonly Status[] = [
  "to_do",
  "pending",
  "in_progress",
  "done",
] as const;

// Actors
export const PREDEFINED_ACTORS = [
  "john.doe",
  "jane.smith",
  "alice.dev",
  "bob.pm",
  "charlie.qa",
] as const;

export type Actor = (typeof PREDEFINED_ACTORS)[number];

// Task
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

// Audit Log
export interface AuditLog {
  id: string;
  taskId: string;
  taskTitle: string;
  actor: string;
  fromStatus: Status;
  toStatus: Status;
  changedAt: string;
  message: string;
}
