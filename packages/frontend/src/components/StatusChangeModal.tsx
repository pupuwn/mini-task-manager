import { useState, useEffect } from "react";
import type { Task, Status } from "../types";
import { getNextStatus } from "../types";

const STATUS_LABELS: Record<Status, string> = {
  to_do: "To Do",
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

interface StatusChangeModalProps {
  isOpen: boolean;
  task: Task | null;
  actor: string;
  onClose: () => void;
  onConfirm: (
    taskId: string,
    newStatus: Status,
    message?: string
  ) => Promise<void>;
}

export function StatusChangeModal({
  isOpen,
  task,
  actor,
  onClose,
  onConfirm,
}: StatusChangeModalProps) {
  const [isChanging, setIsChanging] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [message, setMessage] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && task) {
      setSelectedStatus(getNextStatus(task.status) || task.status);
      setMessage("");
    }
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const nextStatus = getNextStatus(task.status);
  const isDone = task.status === "done";

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;
    
    setIsChanging(true);
    try {
      await onConfirm(task.id, selectedStatus, message.trim() || undefined);
      onClose();
    } catch {
      // error handled by hook
    } finally {
      setIsChanging(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-opacity duration-300" 
      onClick={handleOverlayClick} 
      id="status-change-modal"
    >
      <div 
        className="bg-surface-container-lowest w-full max-w-[520px] rounded-lg border border-outline-variant shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden animate-in fade-in zoom-in duration-200"
        role="dialog" 
        aria-labelledby="status-modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-lowest">
          <h2 id="status-modal-title" className="font-headline-md text-headline-md text-on-surface">Update Status</h2>
          <button 
            className="text-on-surface-variant hover:text-on-surface transition-colors p-1 rounded-md hover:bg-surface-container-low" 
            onClick={onClose}
            aria-label="Close" 
            id="close-status-modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleConfirm}>
          <div className="p-6 space-y-5">
            {/* Task Title (Disabled) */}
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant">Task Title</label>
              <input 
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-md font-body-sm text-body-sm text-on-surface-variant cursor-not-allowed outline-none" 
                type="text"
                value={task.title}
                disabled
              />
            </div>

            {/* New Status (Select) */}
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant">New Status</label>
              <div className="relative group">
                <select 
                  className="w-full appearance-none px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:ring-offset-1 outline-none transition-all pr-10"
                  value={selectedStatus || ""}
                  onChange={(e) => setSelectedStatus(e.target.value as Status)}
                  disabled={isDone}
                >
                  <option value={task.status}>{STATUS_LABELS[task.status]} (Current)</option>
                  {nextStatus && (
                    <option value={nextStatus}>{STATUS_LABELS[nextStatus]}</option>
                  )}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[18px]">expand_more</span>
              </div>
            </div>

            {/* Status Note / Description */}
            <div className="space-y-2">
              <label htmlFor="status-message" className="font-label-caps text-label-caps text-on-surface-variant flex items-center justify-between">
                <span>Status Note <span className="font-normal opacity-70">(Optional)</span></span>
                <span className="text-[10px] opacity-70">{message.length}/500</span>
              </label>
              <textarea 
                id="status-message"
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:ring-offset-1 outline-none transition-all placeholder:text-outline/50 resize-none" 
                placeholder="Provide more details about this status change..." 
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value.substring(0, 500))}
                disabled={isDone}
              />
            </div>

            {/* Actor Display */}
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant">Updating As</label>
              <div className="relative">
                <input 
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-md font-body-sm text-body-sm text-on-surface-variant cursor-not-allowed outline-none" 
                  type="text"
                  value={actor}
                  disabled
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[18px]">person</span>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end px-6 py-4 bg-surface-container-low/50 border-t border-outline-variant space-x-3">
            <button 
              type="button"
              className="px-4 py-2 font-button text-button text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-md disabled:opacity-50" 
              onClick={onClose}
              disabled={isChanging}
              id="cancel-status"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 font-button text-button bg-primary text-on-primary hover:bg-primary/90 active:scale-[0.98] transition-all rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isChanging || isDone || task.status === selectedStatus}
              id="confirm-status"
            >
              {isChanging ? "Updating..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
