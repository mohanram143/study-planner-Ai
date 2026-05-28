import { useState } from "react";
import { useSubjects } from "../hooks/useSubjects";
import { Plus, Pencil, Trash2, BookOpen, X, Check, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { SUBJECT_COLORS } from "../utils/aiScheduler";
import { PRIORITY_COLORS } from "../utils/constants";

const EMPTY = { name: "", description: "", priority: "medium", hoursNeeded: 5, deadline: "", color: 0 };

// ── Modal Wrapper ──────────────────────────────────────────────
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          animation: "modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Subject Form ───────────────────────────────────────────────
function SubjectForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [status, setStatus] = useState("idle"); // idle | saving | saved

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    background: "var(--bg-primary)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    outline: "none",
    fontFamily: "'Outfit', sans-serif",
    transition: "border-color 0.2s",
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Subject name is required");
    if (status === "saving" || status === "saved") return;

    setStatus("saving");
    try {
      await onSave(form);
      // onSave resolves → show saved
      setStatus("saved");
      setTimeout(() => {
        onClose();
      }, 900);
    } catch {
      toast.error("Failed to save. Try again.");
      setStatus("idle");
    }
  };

  const btnLabel =
    status === "saving" ? "Saving..." :
    status === "saved"  ? "✓ Saved!"  :
    initial?.id         ? "Save Changes" : "Add Subject";

  const btnBg =
    status === "saved"   ? "linear-gradient(135deg,#22c55e,#16a34a)" :
    status === "saving"  ? "linear-gradient(135deg,#8b5cf6,#7c3aed)" :
                           "linear-gradient(135deg,#7c3aed,#9333ea)";

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {/* Title row */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
          {initial?.id ? "Edit Subject" : "Add Subject"}
        </h2>
        <button type="button" onClick={onClose} style={{ color: "var(--text-muted)" }}>
          <X size={18} />
        </button>
      </div>

      <input
        style={inputStyle}
        placeholder="Subject name *"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        onFocus={(e) => (e.target.style.borderColor = "rgba(167,139,250,0.6)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />

      <input
        style={inputStyle}
        placeholder="Description (optional)"
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        onFocus={(e) => (e.target.style.borderColor = "rgba(167,139,250,0.6)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-muted)" }}>Priority</label>
          <select style={inputStyle} value={form.priority} onChange={(e) => set("priority", e.target.value)}>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-muted)" }}>Hours Needed</label>
          <input
            style={inputStyle}
            type="number"
            min={1}
            max={500}
            value={form.hoursNeeded}
            onChange={(e) => set("hoursNeeded", Number(e.target.value))}
            onFocus={(e) => (e.target.style.borderColor = "rgba(167,139,250,0.6)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-muted)" }}>Deadline (optional)</label>
        <input
          style={inputStyle}
          type="date"
          value={form.deadline}
          onChange={(e) => set("deadline", e.target.value)}
        />
      </div>

      {/* Color picker */}
      <div>
        <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--text-muted)" }}>Subject Color</label>
        <div className="flex gap-2 flex-wrap">
          {SUBJECT_COLORS.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => set("color", i)}
              className="w-7 h-7 rounded-full transition-transform hover:scale-110"
              style={{
                background: c.dot,
                outline: form.color === i ? `3px solid ${c.dot}` : "2px solid transparent",
                outlineOffset: "2px",
              }}
            />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={status === "saving" || status === "saved"}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: btnBg, opacity: status === "saving" ? 0.85 : 1 }}
        >
          <span className="flex items-center justify-center gap-2">
            {status === "saving" && (
              <span
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}
              />
            )}
            {status === "saved" && <Check size={15} />}
            {btnLabel}
          </span>
        </button>
      </div>
    </form>
  );
}

// ── Delete Confirm Modal ───────────────────────────────────────
function DeleteModal({ subject, onConfirm, onClose, deleting }) {
  if (!subject) return null;
  return (
    <Modal open={!!subject} onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(239,68,68,0.15)" }}>
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <h2 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>Delete Subject</h2>
        </div>

        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Are you sure you want to delete{" "}
          <span className="font-bold" style={{ color: "var(--text-primary)" }}>"{subject.name}"</span>?
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
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
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", opacity: deleting ? 0.7 : 1 }}
          >
            <span className="flex items-center justify-center gap-2">
              {deleting && (
                <span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}
                />
              )}
              {deleting ? "Deleting..." : "Yes, Delete"}
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function SubjectsPage() {
  const { subjects, add, update, remove } = useSubjects();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  // Called by SubjectForm — must return a promise so form can handle status
  const handleSave = async (form) => {
    if (editing?.id) {
      await update(editing.id, form);
      toast.success("Subject updated!");
    } else {
      await add(form);
      toast.success("Subject added!");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted!`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.93) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>My Subjects</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {subjects.length} subject{subjects.length !== 1 ? "s" : ""} tracked
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <input
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-xl text-sm outline-none"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                fontFamily: "'Outfit', sans-serif",
              }}
            />
            <button
              onClick={() => { setEditing(null); setShowModal(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}
            >
              <Plus size={16} /> Add Subject
            </button>
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <BookOpen size={48} style={{ color: "var(--text-muted)", opacity: 0.3 }} />
            <p className="text-base font-bold mt-4" style={{ color: "var(--text-primary)" }}>
              {search ? "No subjects found" : "No subjects yet"}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {search ? "Try a different search" : "Add your first subject to get started"}
            </p>
            {!search && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-5 px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: "#7c3aed" }}
              >
                Add First Subject
              </button>
            )}
          </div>
        )}

        {/* Subject grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => {
              const c = SUBJECT_COLORS[s.color ?? 0];
              const pc = PRIORITY_COLORS[s.priority || "medium"];
              return (
                <div
                  key={s.id}
                  className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:scale-[1.02]"
                  style={{ background: "var(--card-bg)", border: `1px solid ${c.border}44` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: c.bg }}>
                      <BookOpen size={18} style={{ color: c.text }} />
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setEditing(s); setShowModal(true); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-purple-500/10"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/10 text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{s.name}</h3>
                    {s.description && (
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--text-muted)" }}>{s.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold capitalize"
                      style={{ background: pc.bg, color: pc.text }}>
                      {s.priority || "medium"}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                      style={{ background: "var(--bg-primary)", color: "var(--text-muted)" }}>
                      {s.hoursNeeded}h needed
                    </span>
                    {s.deadline && (
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        📅 {new Date(s.deadline + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Progress</span>
                      <span className="text-[10px] font-bold" style={{ color: c.text }}>0%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: "var(--bg-primary)" }}>
                      <div className="h-full rounded-full" style={{ width: "0%", background: c.dot }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal open={showModal} onClose={closeModal}>
        <SubjectForm
          key={editing?.id ?? "new"}
          initial={editing}
          onSave={handleSave}
          onClose={closeModal}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <DeleteModal
        subject={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onClose={() => !deleting && setDeleteTarget(null)}
        deleting={deleting}
      />
    </>
  );
}