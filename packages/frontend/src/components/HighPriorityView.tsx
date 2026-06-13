import type { Task, Status } from "../types";
import { getNextStatus } from "../types";

interface HighPriorityViewProps {
  tasks: Task[];
  onStatusChange: (task: Task) => void;
  onViewLogs: (task: Task) => void;
  onDelete: (task: Task) => void;
  onViewChange: (view: "tasks" | "my-tasks" | "high-priority") => void;
}

const STATUS_LABELS: Record<Status, string> = {
  to_do: "To Do",
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

export function HighPriorityView({ tasks, onStatusChange, onViewLogs, onDelete, onViewChange }: HighPriorityViewProps) {
  const activeTasks = tasks.filter(t => t.status !== "done");

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="p-container-padding space-y-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">High Priority Tasks</h2>
          <p className="text-on-surface-variant text-body-md mt-1">Manage all your high priority tasks.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-on-surface-variant bg-surface border border-outline-variant px-3 py-1.5 rounded-lg shadow-sm">
          <span className="material-symbols-outlined text-[18px]">event</span>
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 border-b border-outline-variant mb-8">
        <button onClick={() => onViewChange("tasks")} className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors relative">
          All Tasks
        </button>
        <button onClick={() => onViewChange("my-tasks")} className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors relative">
          Assigned to Me
        </button>
        <button className="px-4 py-2 text-sm font-semibold text-primary relative">
          High Priority
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-section-gap">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Task Name</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activeTasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-[48px] opacity-50 mb-2">assignment_turned_in</span>
                    <p>No high priority operations actively blocking.</p>
                  </div>
                </td>
              </tr>
            ) : (
              activeTasks.map((task, index) => {
                const nextStatus = getNextStatus(task.status);
                const mockOwners = [
                  { initials: "JD", name: "John Doe", color: "bg-slate-200 text-slate-700" },
                  { initials: "SA", name: "Sarah Ames", color: "bg-amber-100 text-amber-800" },
                  { initials: "MK", name: "Mike Kane", color: "bg-primary-container text-on-primary-container" },
                ];
                const owner = mockOwners[index % mockOwners.length];

                return (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-on-surface">{task.title}</span>
                        {task.description && (
                          <span className="text-xs text-on-surface-variant line-clamp-1">{task.description}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${task.status === "to_do" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                        {task.status === "to_do" ? "Emergency" : "Critical"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${owner.color}`}>
                          {owner.initials}
                        </div>
                        <span className="text-sm text-on-surface">{owner.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{formatDate(task.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button onClick={() => onViewLogs(task)} className="p-1.5 hover:bg-slate-200 rounded text-slate-500 transition-colors" title="View Logs">
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                        <button onClick={() => onStatusChange(task)} className="p-1.5 hover:bg-slate-200 rounded text-slate-500 transition-colors" title={`Advance to ${nextStatus ? STATUS_LABELS[nextStatus] : ""}`}>
                          <span className="material-symbols-outlined text-lg">refresh</span>
                        </button>
                        <button onClick={() => onDelete(task)} className="p-1.5 hover:bg-red-50 rounded text-red-400 transition-colors" title="Delete Task">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {activeTasks.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">Showing {activeTasks.length} critical task{activeTasks.length > 1 ? "s" : ""}</span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 text-xs font-medium border border-outline-variant rounded-lg hover:bg-white transition-colors opacity-50 cursor-not-allowed">Previous</button>
              <button className="px-3 py-1.5 text-xs font-medium bg-white border border-outline-variant rounded-lg hover:bg-slate-100 transition-colors shadow-sm opacity-50 cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Critical Alerts Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline-md text-headline-md text-on-surface">Critical Alerts</h3>
          <button className="text-primary text-sm font-semibold hover:underline">View All Alerts</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Alert Card 1 */}
          <div className="bg-white border-l-4 border-l-error border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-error-container text-error rounded-lg">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <span className="text-[10px] font-bold text-error uppercase tracking-widest">Active Now</span>
            </div>
            <h4 className="font-semibold text-on-surface mb-1">API Gateway Timeout</h4>
            <p className="text-sm text-on-surface-variant mb-4">US-East-1 endpoint reporting 4% failure rate in the last 15 minutes.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">ID: ALERT-882-X</span>
              <button className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center">
                Investigate <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Alert Card 2 */}
          <div className="bg-white border-l-4 border-l-amber-500 border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <span className="material-symbols-outlined">memory</span>
              </div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Escalating</span>
            </div>
            <h4 className="font-semibold text-on-surface mb-1">Memory Usage Spike</h4>
            <p className="text-sm text-on-surface-variant mb-4">Worker node pool 'Alpha' has reached 88% memory utilization threshold.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">ID: ALERT-721-M</span>
              <button className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center">
                Scale Up <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Alert Card 3 */}
          <div className="bg-white border-l-4 border-l-error border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-error-container text-error rounded-lg">
                <span className="material-symbols-outlined">dns</span>
              </div>
              <span className="text-[10px] font-bold text-error uppercase tracking-widest">Critical</span>
            </div>
            <h4 className="font-semibold text-on-surface mb-1">Backup Failure</h4>
            <p className="text-sm text-on-surface-variant mb-4">Daily snapshot for core-db-primary failed integrity checksum check.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">ID: ALERT-904-B</span>
              <button className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center">
                Retry Now <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
