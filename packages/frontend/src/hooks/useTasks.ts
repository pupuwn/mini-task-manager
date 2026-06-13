import { useState, useCallback, useEffect } from "react";
import type { Task, Status } from "../types";
import * as api from "../services/api";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreate = useCallback(
    async (title: string, description?: string) => {
      setError(null);
      try {
        const newTask = await api.createTask(title, description);
        setTasks((prev) => [...prev, newTask]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create task"
        );
        throw err;
      }
    },
    []
  );

  const handleStatusUpdate = useCallback(
    async (taskId: string, newStatus: Status, actor: string, message?: string) => {
      setError(null);
      try {
        const updated = await api.updateTaskStatus(taskId, newStatus, actor, message);
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? updated : t))
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update task status"
        );
        throw err;
      }
    },
    []
  );

  const handleDelete = useCallback(async (taskId: string) => {
    setError(null);
    try {
      await api.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete task"
      );
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    handleCreate,
    handleStatusUpdate,
    handleDelete,
  };
}
