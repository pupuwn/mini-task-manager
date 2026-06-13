export type ViewType = "dashboard" | "tasks" | "my-tasks" | "high-priority" | "audit-log" | "profile";

export type Status = "to_do" | "pending" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

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

export const PREDEFINED_ACTORS = [
  "john.doe",
  "jane.smith",
  "alice.dev",
  "bob.pm",
  "charlie.qa",
] as const;

export const STATUS_SEQUENCE: Status[] = [
  "to_do",
  "pending",
  "in_progress",
  "done",
];

export const getNextStatus = (current: Status): Status | null => {
  const index = STATUS_SEQUENCE.indexOf(current);
  if (index === -1 || index === STATUS_SEQUENCE.length - 1) return null;
  return STATUS_SEQUENCE[index + 1];
};
