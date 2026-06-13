import type { Task, Status } from "../types";

interface TaskListViewProps {
  tasks: Task[];
  onStatusChange: (task: Task) => void;
  onDelete: (task: Task) => void;
  onViewLogs: (task: Task) => void;
  onViewChange: (view: "tasks" | "my-tasks" | "high-priority") => void;
}

const STATUS_LABELS: Record<Status, string> = {
  to_do: "To Do",
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

const STATUS_COLORS: Record<Status, string> = {
  to_do: "bg-surface-variant text-on-surface-variant",
  pending: "bg-secondary-fixed text-on-secondary-fixed-variant",
  in_progress: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  done: "bg-primary-fixed text-on-primary-fixed-variant",
};

export function TaskListView({
  tasks,
  onStatusChange,
  onDelete,
  onViewLogs,
  onViewChange,
}: TaskListViewProps) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const activeCount = tasks.filter(t => t.status !== "done").length;

  return (
    <div className="p-container-padding space-y-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Workload Overview</h2>
          <p className="text-on-surface-variant text-body-sm mt-1">Manage and track high-priority system operations.</p>
        </div>
        <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-[12px] font-bold">{activeCount} Active</span>
      </div>

      {/* Tabs/Filters */}
      <div className="flex items-center gap-1 border-b border-outline-variant pb-px overflow-x-auto">
        <button onClick={() => onViewChange("tasks")} className="px-4 py-2 font-button text-button text-primary border-b-2 border-primary active:opacity-80 duration-150 whitespace-nowrap">All Tasks</button>
        <button onClick={() => onViewChange("my-tasks")} className="px-4 py-2 font-button text-button text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-t-lg whitespace-nowrap">Assigned to Me</button>
        <button onClick={() => onViewChange("high-priority")} className="px-4 py-2 font-button text-button text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-t-lg whitespace-nowrap">High Priority</button>
      </div>

      {/* Task List Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low/50">
              <th className="p-4 w-12"><input className="rounded border-outline-variant text-primary focus:ring-primary transition-all" type="checkbox" /></th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Task Description</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Status</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Created Date</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-[48px] opacity-50 mb-2">list_alt</span>
                    <p>No tasks found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const isDone = task.status === "done";
                return (
                  <tr key={task.id} className="hover:bg-surface-container-low/30 transition-colors group" id={`task-row-${task.id}`}>
                    <td className="p-4"><input className="rounded border-outline-variant text-primary focus:ring-primary transition-all" type="checkbox" /></td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-body-md text-on-surface font-semibold">{task.title}</span>
                        {task.description && (
                          <span className="text-body-sm text-on-surface-variant opacity-70">
                            {task.description.length > 60 ? task.description.substring(0, 60) + "…" : task.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-semibold ${STATUS_COLORS[task.status]}`}>
                        {STATUS_LABELS[task.status]}
                      </span>
                    </td>
                    <td className="p-4 text-body-sm text-on-surface-variant">{formatDate(task.createdAt)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onViewLogs(task)} className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary-fixed rounded transition-all" title="View Log" id={`logs-${task.id}`}>
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                        <button onClick={() => onStatusChange(task)} disabled={isDone} className={`p-1.5 rounded transition-all ${isDone ? 'text-outline opacity-50' : 'text-on-surface-variant hover:text-primary hover:bg-primary-fixed'}`} title="Change Status" id={`advance-${task.id}`}>
                          <span className="material-symbols-outlined">refresh</span>
                        </button>
                        <button onClick={() => onDelete(task)} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container rounded transition-all" title="Delete" id={`delete-${task.id}`}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Activity Log */}
        <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-md text-body-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">ac_unit</span>
              Activity Log
            </h3>
            <button className="text-[10px] uppercase font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-outline-variant">
            <div className="relative pl-8">
              <div className="absolute left-0 top-1 w-[22px] h-[22px] bg-surface-container-lowest border-2 border-primary rounded-full z-10"></div>
              <p className="text-body-sm font-semibold">System Backup Completed</p>
              <p className="text-[12px] text-on-surface-variant">Automated routine • 45m ago</p>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-0 top-1 w-[22px] h-[22px] bg-surface-container-lowest border-2 border-error rounded-full z-10"></div>
              <p className="text-body-sm font-semibold">Node #47 Failure Alert</p>
              <p className="text-[12px] text-on-surface-variant">Auto-scaling group triggered • 2h ago</p>
            </div>
          </div>
        </div>

        {/* Instance Health Card */}
        <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <h3 className="font-headline-md text-body-lg font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">monitoring</span>
            Instance Health
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-body-sm">
                <span className="font-medium">CPU Utilization</span>
                <span className="font-bold text-primary">64%</span>
              </div>
              <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000" style={{ width: '64%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-body-sm">
                <span className="font-medium">Memory Usage</span>
                <span className="font-bold text-tertiary">82%</span>
              </div>
              <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                <div className="h-full bg-tertiary transition-all duration-1000" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Regions Grid */}
        <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <h3 className="font-headline-md text-body-lg font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">public</span>
            Active Regions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">US-EAST-1</span>
              <span className="text-body-sm font-semibold">Active</span>
              <div className="mt-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-[10px] text-on-surface-variant">Healthy</span>
              </div>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">EU-WEST-2</span>
              <span className="text-body-sm font-semibold">Scaling</span>
              <div className="mt-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                <span className="text-[10px] text-on-surface-variant">Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
