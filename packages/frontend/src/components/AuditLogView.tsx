import { useState, useEffect } from "react";
import type { Task, AuditLog, Status } from "../types";
import { getAuditLogs } from "../services/api";
import { FileText, ArrowRight } from "lucide-react";

const STATUS_LABELS: Record<Status, string> = {
  to_do: "To Do",
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

interface AuditLogViewProps {
  tasks: Task[];
}

export function AuditLogView({ tasks }: AuditLogViewProps) {
  const [logs, setLogs] = useState<(AuditLog & { taskName?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchAllLogs = async () => {
      if (tasks.length === 0) {
        setLogs([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // In a real app, there would be a global /audit-logs endpoint.
        // Here we'll fetch logs for all tasks to simulate it.
        const allLogsPromises = tasks.map(async (t) => {
          const taskLogs = await getAuditLogs(t.id);
          return taskLogs.map(l => ({ ...l, taskName: t.title }));
        });
        
        const allLogsArrays = await Promise.all(allLogsPromises);
        let combinedLogs = allLogsArrays.flat();
        
        combinedLogs.sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());
        
        if (!cancelled) setLogs(combinedLogs);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to fetch logs"
          );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchAllLogs();
    return () => {
      cancelled = true;
    };
  }, [tasks]);

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

  return (
    <>
      <div className="page-header">
        <h1 className="page-header__title">Audit Log</h1>
      </div>

      <div className="page-body">
        <div style={{ maxWidth: 800 }}>
          {isLoading && (
            <div className="audit-log__loading">
              <div className="spinner spinner--lg" />
              <span>Loading system logs…</span>
            </div>
          )}

          {error && <div className="audit-log__error">{error}</div>}

          {!isLoading && !error && logs.length === 0 && (
            <div className="audit-log__empty">
              <FileText size={48} strokeWidth={1} />
              <h2>No audit logs found</h2>
              <p>Logs will appear here when task statuses change.</p>
            </div>
          )}

          {!isLoading && !error && logs.length > 0 && (
            <ul className="audit-log__list">
              {logs.map((log, index) => (
                <li 
                  key={log.id} 
                  className={`audit-log__item ${index % 2 === 0 ? 'audit-log__item--alt' : ''}`}
                  id={`log-${log.id}`}
                >
                  <div className="audit-log__timeline">
                    <div className="audit-log__timeline-dot" />
                    {index < logs.length - 1 && <div className="audit-log__timeline-line" />}
                  </div>
                  
                  <div className="audit-log__content">
                    <div className="audit-log__meta">
                      <div className="audit-log__actor">
                        <div className="audit-log__actor-avatar">
                          {getInitials(log.actor)}
                        </div>
                        {log.actor}
                        <span style={{ fontWeight: 400, color: "var(--color-outline)" }}>
                          updated <strong style={{ color: "var(--color-on-surface)" }}>{log.taskName || log.taskTitle}</strong>
                        </span>
                      </div>
                      <span className="audit-log__time">
                        {formatDate(log.changedAt)}
                      </span>
                    </div>
                    
                    <div className="audit-log__change" style={{ marginTop: 12 }}>
                      <span className={`status-badge status-badge--${log.fromStatus}`}>
                        {STATUS_LABELS[log.fromStatus]}
                      </span>
                      <ArrowRight size={16} />
                      <span className={`status-badge status-badge--${log.toStatus}`}>
                        {STATUS_LABELS[log.toStatus]}
                      </span>
                    </div>
                    
                    {log.message && (
                      <p className="audit-log__message">{log.message}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
