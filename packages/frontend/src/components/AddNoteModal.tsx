import { useState } from "react";
import { X, MessageSquarePlus } from "lucide-react";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

export function AddNoteModal({
  isOpen,
  onClose,
  onSubmit,
}: AddNoteModalProps) {
  const [note, setNote] = useState("");
  const MAX_CHARS = 500;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    
    onSubmit(note.trim());
    setNote("");
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} id="add-note-modal" style={{ zIndex: 300 }}>
      <div className="modal" role="dialog" aria-labelledby="add-note-title">
        <div className="modal__header">
          <h2 id="add-note-title" className="modal__title">
            <MessageSquarePlus size={20} />
            Add Note
          </h2>
          <button className="modal__close" onClick={onClose} aria-label="Close" id="close-note-modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__body">
          <div className="form-group">
            <label htmlFor="note-content" className="form-label">
              Note Details <span className="form-required">*</span>
            </label>
            <div className="add-note__textarea-wrapper">
              <textarea
                id="note-content"
                className="add-note__textarea"
                value={note}
                onChange={(e) => setNote(e.target.value.substring(0, MAX_CHARS))}
                placeholder="Enter details about this status change..."
                autoFocus
                required
              />
              <div className="add-note__counter">
                {note.length} / {MAX_CHARS}
              </div>
            </div>
          </div>

          <div className="modal__footer">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
              id="cancel-note"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={!note.trim()}
              id="submit-note"
            >
              Add Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
