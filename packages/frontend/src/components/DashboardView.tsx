import type { Task, Status } from "../types";

interface DashboardViewProps {
  tasks: Task[];
  onCreateTask: () => void;
}

const STATUS_LABELS: Record<Status, string> = {
  to_do: "To Do",
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

export function DashboardView({ tasks, onCreateTask }: DashboardViewProps) {
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending" || t.status === "to_do").length;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="p-container-padding space-y-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Workload Overview</h2>
          <p className="text-on-surface-variant text-body-sm mt-1">Manage and track high-priority system operations.</p>
        </div>
        <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-[12px] font-bold">
          {inProgressTasks} Active
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-2" id="stat-total">
          <div className="text-[12px] font-bold tracking-wider uppercase text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">list_alt</span>
            Total Tasks
          </div>
          <div className="text-[30px] font-semibold text-on-surface tracking-tight">{totalTasks}</div>
          <div className="text-sm text-outline">{pendingTasks} pending</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-2" id="stat-in-progress">
          <div className="text-[12px] font-bold tracking-wider uppercase text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            In Progress
          </div>
          <div className="text-[30px] font-semibold text-on-surface tracking-tight">{inProgressTasks}</div>
          <div className="text-sm text-outline">Active now</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-2" id="stat-completed">
          <div className="text-[12px] font-bold tracking-wider uppercase text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Completed
          </div>
          <div className="text-[30px] font-semibold text-on-surface tracking-tight">{completedTasks}</div>
          <div className="text-sm text-outline">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% done
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div>
        <h3 className="font-headline-md text-body-lg font-bold mb-4 flex items-center gap-2 border-b border-outline-variant pb-2">
          <span className="material-symbols-outlined text-primary">history</span>
          Recent Activity
        </h3>

        {recentTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm text-center" id="dashboard-empty">
            <span className="material-symbols-outlined text-[48px] text-outline opacity-50 mb-4">list_alt</span>
            <h2 className="text-lg font-bold text-on-surface">No tasks yet</h2>
            <p className="text-on-surface-variant mb-6">Create your first task to get started.</p>
            <button className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium transition-all hover:opacity-90 active:scale-95" onClick={onCreateTask} id="empty-create-btn">
              Create Task
            </button>
          </div>
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-outline-variant/30">
              {recentTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-surface-container-low/30 transition-colors flex items-center justify-between" id={`recent-${task.id}`}>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-semibold bg-primary-fixed text-on-primary-fixed-variant`}>
                      {STATUS_LABELS[task.status]}
                    </span>
                    <span className="font-medium text-on-surface">{task.title}</span>
                  </div>
                  <span className="text-sm text-on-surface-variant">{formatDate(task.updatedAt)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Floating Action Button (Mobile) */}
      <button 
        onClick={onCreateTask}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-[60]"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
}
