import type { Task, Status } from "../types";

interface MyTasksViewProps {
  tasks: Task[];
  onStatusChange: (task: Task) => void;
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
  pending: "bg-orange-100 text-orange-700",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-emerald-100 text-emerald-700",
};

const STATUS_ICONS: Record<Status, string> = {
  to_do: "list_alt",
  pending: "security",
  in_progress: "code",
  done: "database"
};

const STATUS_ICON_COLORS: Record<Status, string> = {
  to_do: "bg-slate-100 text-slate-600",
  pending: "bg-orange-100 text-orange-600",
  in_progress: "bg-blue-100 text-blue-600",
  done: "bg-emerald-100 text-emerald-600"
};

export function MyTasksView({ tasks, onStatusChange, onViewChange }: MyTasksViewProps) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const todoCount = tasks.filter((t) => t.status === "to_do").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const totalCount = tasks.length || 1;

  return (
    <div className="p-container-padding space-y-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">My Work Overview</h2>
          <p className="font-body-md text-on-surface-variant">Manage your personal task queue and performance.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-on-surface-variant hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined">refresh</span>
          </button>
          <button className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg text-on-surface-variant hover:bg-slate-50 transition-colors font-button text-button">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filters
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex border-b border-outline-variant/30 mb-2 overflow-x-auto">
        <button onClick={() => onViewChange("tasks")} className="px-4 py-2 text-body-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors border-b-2 border-transparent whitespace-nowrap">All Tasks</button>
        <button className="px-4 py-2 text-body-sm font-bold text-primary border-b-2 border-primary whitespace-nowrap">Assigned to Me</button>
        <button onClick={() => onViewChange("high-priority")} className="px-4 py-2 text-body-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors border-b-2 border-transparent whitespace-nowrap">High Priority</button>
      </div>

      {/* Task Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Task Title</th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-on-surface-variant">
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-[48px] opacity-50 mb-2">check_box</span>
                    <p>No tasks assigned to you.</p>
                  </div>
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors group" id={`mytask-${task.id}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${STATUS_ICON_COLORS[task.status]}`}>
                        <span className="material-symbols-outlined text-[20px]">{STATUS_ICONS[task.status]}</span>
                      </div>
                      <span className="font-body-md font-medium">{task.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[task.status]}`}>
                      {STATUS_LABELS[task.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-body-sm text-on-surface-variant">{formatDate(task.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onStatusChange(task)} className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-500" title="Change Status">
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                      </button>
                      <button className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-500">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-8">
        {/* Personal Velocity */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Personal Velocity</h3>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +12%
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{doneCount}</span>
            <span className="text-on-surface-variant text-body-sm mb-1">tasks / week</span>
          </div>
          <div className="mt-6 h-24 w-full flex items-end justify-between gap-1">
            <div className="bg-primary/20 hover:bg-primary/40 transition-colors w-full rounded-t-sm" style={{ height: '40%' }}></div>
            <div className="bg-primary/20 hover:bg-primary/40 transition-colors w-full rounded-t-sm" style={{ height: '60%' }}></div>
            <div className="bg-primary/20 hover:bg-primary/40 transition-colors w-full rounded-t-sm" style={{ height: '45%' }}></div>
            <div className="bg-primary/20 hover:bg-primary/40 transition-colors w-full rounded-t-sm" style={{ height: '80%' }}></div>
            <div className="bg-primary/20 hover:bg-primary/40 transition-colors w-full rounded-t-sm" style={{ height: '55%' }}></div>
            <div className="bg-primary w-full rounded-t-sm" style={{ height: '90%' }}></div>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-4">Task Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-body-sm mb-1.5">
                <span className="font-medium">To Do</span>
                <span className="text-on-surface-variant">{todoCount}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-300 rounded-full" style={{ width: `${(todoCount / totalCount) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-body-sm mb-1.5">
                <span className="font-medium">In Progress</span>
                <span className="text-on-surface-variant">{inProgressCount}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(inProgressCount / totalCount) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-body-sm mb-1.5">
                <span className="font-medium">Done</span>
                <span className="text-on-surface-variant">{doneCount}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(doneCount / totalCount) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
              <div className="flex flex-col items-center justify-center min-w-[40px] h-10 border border-slate-100 rounded bg-slate-50 group-hover:bg-white">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">Oct</span>
                <span className="text-sm font-bold text-error">28</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body-sm font-medium truncate">Client Kickoff Deck</p>
                <p className="text-[10px] text-on-surface-variant">Marketing Dept.</p>
              </div>
              <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
              <div className="flex flex-col items-center justify-center min-w-[40px] h-10 border border-slate-100 rounded bg-slate-50 group-hover:bg-white">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">Oct</span>
                <span className="text-sm font-bold text-on-surface">30</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body-sm font-medium truncate">User Testing Session</p>
                <p className="text-[10px] text-on-surface-variant">UX Research</p>
              </div>
              <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
