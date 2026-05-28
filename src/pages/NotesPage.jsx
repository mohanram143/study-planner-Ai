import { useState } from "react";
import { useNotes } from "../hooks/useNotes";
import { Plus, Trash2, Search, StickyNote, X, Save, Check } from "lucide-react";
import toast from "react-hot-toast";

const NOTE_COLORS = [
  { bg: "rgba(124,58,237,0.12)",  border: "rgba(124,58,237,0.3)",  accent: "#7c3aed" },
  { bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)",  accent: "#10b981" },
  { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  accent: "#f59e0b" },
  { bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",   accent: "#ef4444" },
  { bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.3)",  accent: "#3b82f6" },
  { bg: "rgba(236,72,153,0.12)",  border: "rgba(236,72,153,0.3)",  accent: "#ec4899" },
];

// ── Note Editor Modal ──────────────────────────────────────────
function NoteEditor({ note, onClose, onSave }) {
  const [title,   setTitle]   = useState(note?.title   || "");
  const [content, setContent] = useState(note?.content || "");
  const [color,   setColor]   = useState(note?.color   ?? 0);
  const [status,  setStatus]  = useState("idle"); // idle | saving | saved

  const submit = async () => {
    if (!title.trim() && !content.trim()) return toast.error("Note is empty");
    if (status === "saving" || status === "saved") return;

    setStatus("saving");
    try {
      await onSave({ title, content, color });
      setStatus("saved");
      setTimeout(() => {
        onClose();
      }, 900);
    } catch {
      toast.error("Failed to save note.");
      setStatus("idle");
    }
  };

  const btnLabel =
    status === "saving" ? "Saving..."  :
    status === "saved"  ? "✓ Saved!"   : "Save Note";

  const btnBg =
    status === "saved"  ? "linear-gradient(135deg,#22c55e,#16a34a)" :
    status === "saving" ? "linear-gradient(135deg,#8b5cf6,#7c3aed)" :
                          "linear-gradient(135deg,#7c3aed,#9333ea)";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          maxHeight: "88vh",
          animation: "modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            {note?.id ? "Edit Note" : "New Note"}
          </h3>
          <div className="flex items-center gap-3">
            {/* Color dots */}
            <div className="flex gap-1.5">
              {NOTE_COLORS.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setColor(i)}
                  className="w-5 h-5 rounded-full transition-transform hover:scale-110"
                  style={{
                    background: c.accent,
                    outline: color === i ? `2.5px solid ${c.accent}` : "2px solid transparent",
                    outlineOffset: "2px",
                  }}
                />
              ))}
            </div>
            <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Editor body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full text-lg font-bold outline-none bg-transparent"
            style={{ color: "var(--text-primary)", fontFamily: "'Outfit', sans-serif" }}
          />
          <div className="w-full h-px" style={{ background: "var(--border)" }} />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your note..."
            rows={10}
            className="w-full outline-none bg-transparent resize-none text-sm leading-relaxed"
            style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {content.length} character{content.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={submit}
            disabled={status === "saving" || status === "saved"}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: btnBg }}
          >
            {status === "saving" && (
              <span
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}
              />
            )}
            {status === "saved" && <Check size={14} />}
            {status === "idle" && <Save size={14} />}
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ───────────────────────────────────────
function DeleteNoteModal({ open, onConfirm, onClose, deleting }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)" }}
      onClick={(e) => e.target === e.currentTarget && !deleting && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          animation: "modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <h3 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>Delete Note</h3>
        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
          Are you sure? This note will be permanently deleted.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", opacity: deleting ? 0.7 : 1 }}
          >
            <span className="flex items-center justify-center gap-2">
              {deleting && (
                <span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}
                />
              )}
              {deleting ? "Deleting..." : "Delete"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function NotesPage() {
  const { notes, loading, add, update, remove } = useNotes();
  const [editing,      setEditing]      = useState(null);
  const [creating,     setCreating]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [search,       setSearch]       = useState("");

  // Called by NoteEditor — must return a promise so editor tracks status
  const handleSave = async (form) => {
    if (editing?.id) {
      await update(editing.id, form);
      toast.success("Note updated!");
      setEditing(null);
    } else {
      await add(form);
      toast.success("Note saved! 📝");
      setCreating(false);
    }
  };

  const closeEditor = () => {
    setEditing(null);
    setCreating(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await remove(deleteTarget);
      toast.success("Note deleted!");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete note.");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (ts) => {
    if (!ts?.seconds) return "";
    return new Date(ts.seconds * 1000).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  const filtered = notes.filter((n) =>
    (n.title   || "").toLowerCase().includes(search.toLowerCase()) ||
    (n.content || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.93) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .line-clamp-5 {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Study Notes</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {notes.length} note{notes.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              <input
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                  fontFamily: "'Outfit', sans-serif",
                  width: "200px",
                }}
              />
            </div>
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}
            >
              <Plus size={16} /> New Note
            </button>
          </div>
        </div>

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <StickyNote size={48} style={{ color: "var(--text-muted)", opacity: 0.3 }} />
            <p className="text-base font-bold mt-4" style={{ color: "var(--text-primary)" }}>
              {search ? "No notes found" : "No notes yet"}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {search ? "Try a different keyword" : "Capture your study thoughts and insights"}
            </p>
            {!search && (
              <button
                onClick={() => setCreating(true)}
                className="mt-5 px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: "#7c3aed" }}
              >
                Create First Note
              </button>
            )}
          </div>
        )}

        {/* Notes masonry grid */}
        {filtered.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((n) => {
              const c = NOTE_COLORS[n.color ?? 0];
              return (
                <div
                  key={n.id}
                  className="break-inside-avoid rounded-2xl p-4 flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}
                  onClick={() => setEditing(n)}
                >
                  {/* Title + delete */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm leading-snug flex-1"
                      style={{ color: "var(--text-primary)" }}>
                      {n.title || "Untitled"}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // don't open editor
                        setDeleteTarget(n.id);
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Preview */}
                  {n.content && (
                    <p
                      className="text-xs leading-relaxed line-clamp-5"
                      style={{ color: "var(--text-muted)", fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {n.content}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-2"
                    style={{ borderTop: `1px solid ${c.border}` }}>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {formatDate(n.updatedAt || n.createdAt)}
                    </span>
                    <div className="w-3 h-3 rounded-full" style={{ background: c.accent }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Note editor */}
      {(creating || editing) && (
        <NoteEditor
          key={editing?.id ?? "new"}
          note={editing}
          onClose={closeEditor}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      <DeleteNoteModal
        open={!!deleteTarget}
        onConfirm={handleDeleteConfirm}
        onClose={() => !deleting && setDeleteTarget(null)}
        deleting={deleting}
      />
    </>
  );
}