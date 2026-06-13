import { useState } from "react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => void;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit(title.trim(), description.trim());
    setTitle("");
    setDescription("");
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-opacity duration-300" 
      onClick={handleOverlayClick} 
      id="create-modal"
    >
      <div 
        className="bg-surface-container-lowest w-full max-w-[520px] rounded-lg border border-outline-variant shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden animate-in fade-in zoom-in duration-200"
        role="dialog" 
        aria-labelledby="create-modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-lowest">
          <h2 id="create-modal-title" className="font-headline-md text-headline-md text-on-surface">Create New Task</h2>
          <button 
            className="text-on-surface-variant hover:text-on-surface transition-colors p-1 rounded-md hover:bg-surface-container-low" 
            onClick={onClose}
            aria-label="Close" 
            id="close-create-modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <label htmlFor="task-title" className="font-label-caps text-label-caps text-on-surface-variant flex items-center">
                Task Title <span className="text-error ml-1">*</span>
              </label>
              <input 
                id="task-title"
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:ring-offset-1 outline-none transition-all placeholder:text-outline/50" 
                placeholder="e.g., Update system documentation" 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="task-desc" className="font-label-caps text-label-caps text-on-surface-variant">Description</label>
              <textarea 
                id="task-desc"
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:ring-offset-1 outline-none transition-all placeholder:text-outline/50 resize-none" 
                placeholder="Provide more details about this task..." 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant">Priority</label>
                <div className="relative group">
                  <select className="w-full appearance-none px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:ring-offset-1 outline-none transition-all pr-10">
                    <option>Low</option>
                    <option defaultValue="Medium">Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[18px]">expand_more</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant">Due Date</label>
                <div className="relative">
                  <input className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:ring-offset-1 outline-none transition-all" type="date" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant">Assignee</label>
              <div className="relative">
                <select className="w-full appearance-none px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:ring-offset-1 outline-none transition-all pr-10" defaultValue="">
                  <option disabled value="">Select a team member</option>
                  <option>Alex Rivera (AR)</option>
                  <option>Jordan Smith (JS)</option>
                  <option>Casey Chen (CC)</option>
                  <option>Morgan Taylor (MT)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[18px]">person_add</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end px-6 py-4 bg-surface-container-low/50 border-t border-outline-variant space-x-3">
            <button 
              type="button"
              className="px-4 py-2 font-button text-button text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-md" 
              onClick={onClose}
              id="cancel-create-btn"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 font-button text-button bg-primary text-on-primary hover:bg-primary/90 active:scale-[0.98] transition-all rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!title.trim()}
              id="submit-create-btn"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
