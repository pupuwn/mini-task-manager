import axios from "axios";
import type { Task, AuditLog, Status } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
});

export const getTasks = async (): Promise<Task[]> => {
  const { data } = await api.get<{ data: Task[] }>("/tasks");
  return data.data;
};

export const createTask = async (
  title: string,
  description?: string
): Promise<Task> => {
  const { data } = await api.post<{ data: Task }>("/tasks", { title, description });
  return data.data;
};

export const updateTaskStatus = async (
  taskId: string,
  newStatus: Status,
  actor: string,
  message?: string
): Promise<Task> => {
  const { data } = await api.put<{ data: Task }>(`/tasks/${taskId}/status`, {
    status: newStatus,
    actor,
    message,
  });
  return data.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};

export const getAuditLogs = async (taskId: string): Promise<AuditLog[]> => {
  const { data } = await api.get<{ data: AuditLog[] }>(`/tasks/${taskId}/audit-logs`);
  return data.data;
};
