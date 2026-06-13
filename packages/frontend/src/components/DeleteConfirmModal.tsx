import type { Task, Status } from "../types";
import { useState } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirm: (taskId: string) => Promise<void>;
}

const STATUS_LABELS: Record<Status, string> = {
  to_do: "To Do",
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

const STATUS_COLORS: Record<Status, string> = {
  to_do: "bg-surface-variant text-on-surface-variant",
  pending: "bg-orange-100 text-orange-700",
  in_progress: "bg-secondary-container/50 text-secondary",
  done: "bg-emerald-100 text-emerald-700",
};

export function DeleteConfirmModal({
  isOpen,
  task,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !task) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(task.id);
      onClose();
    } catch {
      // error handled by hook
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const taskIdShort = `TASK-${task.id.split('-')[0].toUpperCase()}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[#191c1e]/40 transition-opacity duration-300"
      onClick={handleOverlayClick}
      id="delete-confirm-modal"
    >
      <div
        className="bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.1)] border border-outline-variant rounded-xl w-full max-w-[440px] overflow-hidden transform scale-100 transition-transform duration-200 animate-in fade-in zoom-in"
        role="dialog"
        aria-labelledby="delete-modal-title"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-error-container/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 0" }}>warning</span>
            </div>
            <h2 id="delete-modal-title" className="font-headline-md text-headline-md text-on-surface">Delete Task</h2>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Are you sure you want to delete <span className="font-semibold text-on-surface">"{task.title}"</span>? This action cannot be undone and will remove all associated audit logs.
            </p>

            {/* Task Preview Card */}
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-3 opacity-60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-outline text-sm">assignment</span>
                  <div>
                    <p className="font-body-sm text-body-sm font-medium text-on-surface truncate max-w-[200px]" title={task.title}>{task.title}</p>
                    <p className="text-[10px] font-label-caps text-outline uppercase tracking-tight">{taskIdShort}</p>
                  </div>
                </div>
                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase whitespace-nowrap ${STATUS_COLORS[task.status]}`}>
                  {STATUS_LABELS[task.status]}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 mt-8">
            <button
              className="flex-1 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-button text-button rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-50"
              onClick={onClose}
              disabled={isDeleting}
              id="cancel-delete"
            >
              Cancel
            </button>
            <button
              className="flex-1 px-4 py-2.5 bg-error text-on-error font-button text-button rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={handleConfirm}
              disabled={isDeleting}
              id="confirm-delete"
            >
              <span className="material-symbols-outlined text-sm">delete_forever</span>
              {isDeleting ? "Deleting..." : "Delete Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
