import { useState } from "react";
import type { ViewType } from "../types";
import { PREDEFINED_ACTORS } from "../types";

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  actor: string;
  onActorChange: (actor: string) => void;
}

export function Sidebar({ currentView, onViewChange, actor, onActorChange }: SidebarProps) {
  const [teamLogOpen, setTeamLogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-surface-container-lowest border-r border-outline-variant p-component-internal-md space-y-2 shrink-0">
      <div className="px-4 py-6 mb-4">
        <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">Task Admin</h1>
        <p className="text-on-surface-variant font-label-caps text-label-caps opacity-70">Management Console</p>
      </div>

      <nav className="flex-1 space-y-1">
        <button
          onClick={() => onViewChange("dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-2 transition-all active:scale-95 duration-100 rounded-lg ${currentView === 'dashboard' ? 'bg-secondary-container text-primary font-semibold' : 'text-on-surface-variant font-medium hover:bg-surface-container-low'}`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-caps text-label-caps">Dashboard</span>
        </button>

        <button
          onClick={() => onViewChange("tasks")}
          className={`w-full flex items-center gap-3 px-4 py-2 transition-all active:scale-95 duration-100 rounded-lg ${currentView === 'tasks' ? 'bg-secondary-container text-primary font-semibold' : 'text-on-surface-variant font-medium hover:bg-surface-container-low'}`}
        >
          <span className="material-symbols-outlined">list_alt</span>
          <span className="font-label-caps text-label-caps">All Tasks</span>
        </button>

        <div className="space-y-1">
          <button
            onClick={() => setTeamLogOpen(!teamLogOpen)}
            className="w-full flex items-center justify-between px-4 py-2 text-on-surface-variant font-medium hover:bg-surface-container-low transition-all rounded-lg group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined">groups</span>
              <span className="font-label-caps text-label-caps">Team Log</span>
            </div>
            <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${teamLogOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          {teamLogOpen && (
            <div className="pl-10 space-y-1">
              <button
                onClick={() => onViewChange("audit-log")}
                className={`w-full text-left block py-1.5 text-body-sm transition-colors ${currentView === 'audit-log' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'}`}
              >
                Recent Activity
              </button>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full flex items-center justify-between px-4 py-2 text-on-surface-variant font-medium hover:bg-surface-container-low transition-all rounded-lg group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-caps text-label-caps">Settings</span>
            </div>
            <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${settingsOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          {settingsOpen && (
            <div className="pl-10 space-y-1">
              <button
                onClick={() => onViewChange("profile")}
                className={`w-full text-left block py-1.5 text-body-sm transition-colors ${currentView === 'profile' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'}`}
              >
                General (Profile)
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-outline-variant mt-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold text-xs">
            {getInitials(actor)}
          </div>
          <div className="overflow-hidden">
            <p className="text-body-sm font-semibold truncate">{actor}</p>
            <p className="text-[10px] text-on-surface-variant truncate uppercase tracking-widest">Admin Access</p>
          </div>
        </div>
        <select
          className="w-full text-[12px] bg-surface-container-low border border-outline-variant rounded p-1 text-on-surface"
          value={actor}
          onChange={(e) => onActorChange(e.target.value)}
        >
          {PREDEFINED_ACTORS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
    </aside>
  );
}
