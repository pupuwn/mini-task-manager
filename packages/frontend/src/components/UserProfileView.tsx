import type { Task } from "../types";

interface UserProfileViewProps {
  actor: string;
  tasks: Task[];
  onViewChange: (view: "tasks" | "my-tasks" | "high-priority" | "dashboard") => void;
}

export function UserProfileView({ actor, tasks, onViewChange }: UserProfileViewProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress" || t.status === "pending").length;

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const getDisplayName = (name: string) => {
    return name.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="p-8 max-w-[1280px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <nav className="flex items-center text-xs text-on-surface-variant mb-2 space-x-1">
            <span className="hover:text-primary cursor-pointer" onClick={() => onViewChange("dashboard")}>Dashboard</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-medium">User Profile</span>
          </nav>
          <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">User Profile</h2>
          <p className="text-on-surface-variant text-body-sm mt-1">Manage your account and view your performance.</p>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
          
          <button className="absolute top-4 right-4 p-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all rounded-full flex items-center justify-center" title="Edit Profile">
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>

          <div className="pt-10 pb-6 px-6 flex flex-col items-center border-b border-outline-variant/50">
            <div className="w-24 h-24 rounded-full bg-primary-fixed-dim border-4 border-surface flex items-center justify-center text-primary font-bold text-headline-xl shadow-sm mb-4">
              {getInitials(actor)}
            </div>
            
            <h3 className="font-headline-md text-headline-md text-on-surface text-center tracking-tight">
              {getDisplayName(actor)}
            </h3>
            <p className="text-[12px] text-on-surface-variant uppercase tracking-widest font-semibold mt-1">
              Admin Access
            </p>
            <p className="text-body-sm text-on-surface-variant mt-1 bg-surface-container-low px-3 py-1 rounded-full">
              @{actor}
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-outline-variant/50 bg-surface-container-low/30">
            <div className="p-4 flex flex-col items-center text-center group hover:bg-surface-container-low transition-colors cursor-default">
              <span className="text-headline-md font-bold text-on-surface group-hover:-translate-y-0.5 transition-transform">{totalTasks}</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">Assigned</span>
            </div>
            <div className="p-4 flex flex-col items-center text-center group hover:bg-surface-container-low transition-colors cursor-default">
              <span className="text-headline-md font-bold text-primary group-hover:-translate-y-0.5 transition-transform">{inProgressTasks}</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">Active</span>
            </div>
            <div className="p-4 flex flex-col items-center text-center group hover:bg-surface-container-low transition-colors cursor-default">
              <span className="text-headline-md font-bold text-emerald-600 group-hover:-translate-y-0.5 transition-transform">{completedTasks}</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">Completed</span>
            </div>
          </div>
          
          <div className="p-6 bg-surface-container-lowest border-t border-outline-variant/50">
            <div className="flex items-center gap-3 text-on-surface-variant p-3 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors border border-transparent hover:border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-[18px]">key</span>
              </div>
              <div className="flex-1">
                <p className="text-body-sm font-semibold text-on-surface">Security Settings</p>
                <p className="text-xs">Update your password or 2FA</p>
              </div>
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </div>
            
            <div className="flex items-center gap-3 text-on-surface-variant p-3 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors border border-transparent hover:border-outline-variant/30 mt-2">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-[18px]">notifications_active</span>
              </div>
              <div className="flex-1">
                <p className="text-body-sm font-semibold text-on-surface">Notifications</p>
                <p className="text-xs">Manage alert preferences</p>
              </div>
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
