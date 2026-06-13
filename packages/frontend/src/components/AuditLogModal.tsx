import { useEffect, useState } from "react";
import type { Task, AuditLog, Status } from "../types";
import { getAuditLogs } from "../services/api";

const STATUS_LABELS: Record<Status, string> = {
  to_do: "To Do",
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

interface AuditLogModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
}

export function AuditLogModal({ isOpen, task, onClose }: AuditLogModalProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (isOpen && task) {
      const fetchLogs = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getAuditLogs(task.id);
          if (!cancelled) setLogs(data);
        } catch (err) {
          if (!cancelled)
            setError(
              err instanceof Error ? err.message : "Failed to fetch logs"
            );
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      };
      fetchLogs();
    }

    return () => {
      cancelled = true;
    };
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "to_do": return "bg-red-100 text-red-700";
      case "pending": return "bg-amber-100 text-amber-700";
      case "in_progress": return "bg-primary-fixed text-primary";
      case "done": return "bg-emerald-100 text-emerald-700";
      default: return "bg-surface-container-high text-on-surface";
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-opacity duration-300" 
      onClick={handleOverlayClick} 
      id="audit-log-modal"
    >
      <div 
        className="bg-surface-container-lowest w-full max-w-[520px] max-h-[85vh] flex flex-col rounded-lg border border-outline-variant shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden animate-in fade-in zoom-in duration-200"
        role="dialog" 
        aria-labelledby="audit-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-lowest shrink-0">
          <h2 id="audit-modal-title" className="font-headline-md text-headline-md text-on-surface">Task History</h2>
          <button 
            className="text-on-surface-variant hover:text-on-surface transition-colors p-1 rounded-md hover:bg-surface-container-low" 
            onClick={onClose}
            aria-label="Close" 
            id="close-audit-modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* Task Title (Disabled) */}
          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant">Target Task</label>
            <input 
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-md font-body-sm text-body-sm text-on-surface-variant cursor-not-allowed outline-none" 
              type="text"
              value={task.title}
              disabled
            />
          </div>

          <div className="pt-2">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4">Activity Log</h3>

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-[32px] mb-2 opacity-50">refresh</span>
                <span className="text-body-sm">Loading history...</span>
              </div>
            )}

            {error && <div className="p-4 bg-error-container text-error rounded-md text-body-sm">{error}</div>}

            {!isLoading && !error && logs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant text-center border border-dashed border-outline-variant rounded-lg bg-surface/50">
                <span className="material-symbols-outlined text-[32px] mb-2 opacity-30">history</span>
                <p className="text-body-sm font-medium text-on-surface">No history available</p>
                <p className="text-xs mt-1">Changes will appear here once the task is updated.</p>
              </div>
            )}

            {!isLoading && !error && logs.length > 0 && (
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant before:to-transparent">
                {logs.map((log) => (
                  <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-6 last:pb-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-surface-container-lowest bg-primary-fixed-dim text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xs font-bold">
                      {getInitials(log.actor)}
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-button text-button text-on-surface">{log.actor}</span>
                        <span className="text-[10px] font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">{formatDate(log.changedAt)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 my-3 bg-surface-container-lowest py-2 rounded-md border border-outline-variant/30 px-2 justify-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(log.fromStatus)}`}>
                          {STATUS_LABELS[log.fromStatus]}
                        </span>
                        <span className="material-symbols-outlined text-[16px] text-outline">arrow_forward</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(log.toStatus)}`}>
                          {STATUS_LABELS[log.toStatus]}
                        </span>
                      </div>
                      
                      {log.message && (
                        <div className="mt-2 text-body-sm text-on-surface-variant bg-surface-container-low p-3 rounded-md italic border-l-2 border-l-primary">
                          "{log.message}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-surface-container-low/50 border-t border-outline-variant space-x-3 shrink-0">
          <button 
            type="button"
            className="px-4 py-2 font-button text-button bg-primary text-on-primary hover:bg-primary/90 active:scale-[0.98] transition-all rounded-md shadow-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
