import type { Task, Status } from "../types";
import { ChevronRight, FileText, Trash2, CalendarDays } from "lucide-react";
import { getNextStatus } from "../types";

const STATUS_LABELS: Record<Status, string> = {
  to_do: "To Do",
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

interface TaskCardProps {
  task: Task;
  onStatusChange: (task: Task) => void;
  onDelete: (task: Task) => void;
  onViewLogs: (task: Task) => void;
}

export function TaskCard({
  task,
  onStatusChange,
  onDelete,
  onViewLogs,
}: TaskCardProps) {
  const isDone = task.status === "done";
  const nextStatus = getNextStatus(task.status);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={`task-card ${isDone ? "task-card--done" : ""}`} id={`task-${task.id}`}>
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <span className={`status-badge status-badge--${task.status}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      <div className="task-card__dates">
        <span className="task-card__date" title={`Created: ${new Date(task.createdAt).toLocaleString()}`}>
          <CalendarDays size={14} />
          Updated {formatDate(task.updatedAt)}
        </span>
      </div>

      <div className="task-card__actions">
        <button
          className="btn btn--secondary btn--sm"
          style={{ flex: 1 }}
          onClick={() => onStatusChange(task)}
          disabled={isDone}
          title={isDone ? "Task completed" : `Advance to ${nextStatus ? STATUS_LABELS[nextStatus] : ""}`}
          id={`advance-${task.id}`}
        >
          {isDone ? "Completed" : "Advance"} {(!isDone && nextStatus) && <ChevronRight size={14} />}
        </button>
        
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => onViewLogs(task)}
          title="View audit logs"
          id={`logs-${task.id}`}
        >
          <FileText size={14} />
        </button>

        <button
          className="btn btn--ghost btn--sm"
          style={{ color: "var(--color-error)" }}
          onClick={() => onDelete(task)}
          title="Delete task"
          id={`delete-${task.id}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
