import { useState } from "react";
import { PREDEFINED_ACTORS } from "./types";
import type { Task, ViewType } from "./types";
import { useTasks } from "./hooks/useTasks";
import { AlertCircle } from "lucide-react";

import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/DashboardView";
import { TaskListView } from "./components/TaskListView";
import { MyTasksView } from "./components/MyTasksView";
import { HighPriorityView } from "./components/HighPriorityView";
import { AuditLogView } from "./components/AuditLogView";
import { UserProfileView } from "./components/UserProfileView";

import { CreateTaskModal } from "./components/CreateTaskModal";
import { StatusChangeModal } from "./components/StatusChangeModal";
import { AuditLogModal } from "./components/AuditLogModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";

function App() {
  const { tasks, isLoading, error, handleCreate, handleStatusUpdate, handleDelete } = useTasks();

  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [actor, setActor] = useState<string>(PREDEFINED_ACTORS[0]);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusChangeTask, setStatusChangeTask] = useState<Task | null>(null);
  const [auditLogTask, setAuditLogTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <DashboardView 
            tasks={tasks} 
            onCreateTask={() => setShowCreateModal(true)} 
          />
        );
      case "tasks":
        return (
          <TaskListView
            tasks={tasks}
            onStatusChange={setStatusChangeTask}
            onDelete={setDeleteTask}
            onViewLogs={setAuditLogTask}
            onViewChange={setCurrentView}
          />
        );
      case "my-tasks":
        return (
          <MyTasksView
            tasks={tasks}
            onStatusChange={setStatusChangeTask}
            onViewChange={setCurrentView}
          />
        );
      case "high-priority":
        return (
          <HighPriorityView
            tasks={tasks}
            onStatusChange={setStatusChangeTask}
            onViewLogs={setAuditLogTask}
            onDelete={setDeleteTask}
            onViewChange={setCurrentView}
          />
        );
      case "audit-log":
        return <AuditLogView tasks={tasks} />;
      case "profile":
        return <UserProfileView actor={actor} tasks={tasks} onViewChange={setCurrentView} />;
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        actor={actor}
        onActorChange={setActor}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar">
        {/* TopNavBar */}
        <header className="flex justify-between items-center w-full px-container-padding h-16 bg-surface-container-lowest border-b border-outline-variant shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
              <input className="w-full bg-surface-container-low border-none rounded-lg py-2 pl-10 pr-4 text-body-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Search tasks, logs, or regions..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-button text-button hover:opacity-90 active:opacity-80 transition-all">
              New Task
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold text-sm shrink-0">JD</div>
          </div>
        </header>

        {error && (
          <div style={{ padding: "24px 32px 0" }}>
            <div className="error-banner" id="error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {isLoading && tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="spinner spinner--lg" />
            <p className="mt-4 text-on-surface-variant">Loading tasks…</p>
          </div>
        ) : (
          renderView()
        )}
        
        {/* Spacer for mobile scroll */}
        <div className="h-16 md:hidden"></div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-around px-4 z-20">
        <button onClick={() => setCurrentView("dashboard")} className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold">Board</span>
        </button>
        <button onClick={() => setCurrentView("tasks")} className={`flex flex-col items-center gap-1 ${currentView === 'tasks' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">list_alt</span>
          <span className="text-[10px] font-bold">Tasks</span>
        </button>
        <button onClick={() => setCurrentView("audit-log")} className={`flex flex-col items-center gap-1 ${currentView === 'audit-log' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">groups</span>
          <span className="text-[10px] font-bold">Team</span>
        </button>
        <button onClick={() => setCurrentView("profile")} className={`flex flex-col items-center gap-1 ${currentView === 'profile' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>

      {/* Modals */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
      />

      <StatusChangeModal
        isOpen={!!statusChangeTask}
        task={statusChangeTask}
        actor={actor}
        onClose={() => setStatusChangeTask(null)}
        onConfirm={(taskId, newStatus, message) => handleStatusUpdate(taskId, newStatus, actor, message)}
      />

      <AuditLogModal
        isOpen={!!auditLogTask}
        task={auditLogTask}
        onClose={() => setAuditLogTask(null)}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTask}
        task={deleteTask}
        onClose={() => setDeleteTask(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default App;
