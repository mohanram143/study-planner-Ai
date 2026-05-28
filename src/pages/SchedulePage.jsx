import { useState } from "react";
import { useSubjects } from "../hooks/useSubjects";
import { useSchedule } from "../hooks/useSchedule";
import { useAuth } from "../hooks/useAuth";
import { generateAISchedule } from "../utils/aiScheduler";
import {
  Sparkles,
  Calendar,
  Clock,
  ChevronRight,
  RefreshCw,
  Save,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";

const PRIORITY_DOT = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
const TYPE_BADGE = {
  study: { bg: "rgba(124,58,237,0.15)", color: "#a78bfa" },
  review: { bg: "rgba(59,130,246,0.15)", color: "#60a5fa" },
  practice: { bg: "rgba(16,185,129,0.15)", color: "#34d399" },
};

export default function SchedulePage() {
  const { subjects } = useSubjects();
  const { add: addSession } = useSchedule();
  const { user } = useAuth();

  const [form, setForm] = useState({
    availableHours: 3,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const generate = async () => {
    if (subjects.length === 0)
      return toast.error("Add at least one subject first!");
    setLoading(true);
    toast.loading("AI is generating your schedule...", { id: "gen" });
    try {
      const res = await generateAISchedule({ subjects, ...form });
      setResult(res);
      toast.success("Schedule generated!", { id: "gen" });
    } catch {
      toast.error("Generation failed. Try again.", { id: "gen" });
    }
    setLoading(false);
  };

  const saveToCalendar = async () => {
    if (!result?.sessions?.length) return;
    setSaving(true);
    try {
      await Promise.all(
        result.sessions.map((s) =>
          addSession({ ...s, completed: false, userId: user?.uid }),
        ),
      );
      toast.success(
        `${result.sessions.length} sessions saved to your calendar!`,
      );
    } catch {
      toast.error("Failed to save sessions.");
    }
    setSaving(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    background: "var(--bg-primary)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    fontFamily: "'Outfit',sans-serif",
    outline: "none",
  };

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
      {/* Header */}
      <div>
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          AI Schedule Generator
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Let AI build your perfect study plan based on your subjects and
          availability
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config panel */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <h3
              className="font-bold text-sm mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              📋 Configuration
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label
                  className="text-xs font-semibold mb-1.5 block"
                  style={{ color: "var(--text-muted)" }}
                >
                  Daily Available Hours:{" "}
                  <span style={{ color: "#a78bfa" }}>
                    {form.availableHours}h
                  </span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={form.availableHours}
                  onChange={(e) =>
                    set("availableHours", Number(e.target.value))
                  }
                  className="w-full accent-purple-600"
                />
                <div
                  className="flex justify-between text-[10px] mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span>1h</span>
                  <span>12h</span>
                </div>
              </div>

              <div>
                <label
                  className="text-xs font-semibold mb-1.5 block"
                  style={{ color: "var(--text-muted)" }}
                >
                  Start Date
                </label>
                <input
                  style={inputStyle}
                  type="date"
                  value={form.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                />
              </div>

              <div>
                <label
                  className="text-xs font-semibold mb-1.5 block"
                  style={{ color: "var(--text-muted)" }}
                >
                  End Date
                </label>
                <input
                  style={inputStyle}
                  type="date"
                  value={form.endDate}
                  onChange={(e) => set("endDate", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Subjects list */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <h3
              className="font-bold text-sm mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              📚 Subjects ({subjects.length})
            </h3>
            {subjects.length === 0 ? (
              <div className="text-center py-4">
                <BookOpen
                  size={28}
                  style={{
                    color: "var(--text-muted)",
                    opacity: 0.4,
                    margin: "0 auto 8px",
                  }}
                />
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Add subjects first
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {subjects.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-2 rounded-xl"
                    style={{ background: "var(--bg-primary)" }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: PRIORITY_DOT[s.priority || "medium"],
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-semibold truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {s.name}
                      </p>
                      <p
                        className="text-[10px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {s.hoursNeeded}h • {s.priority}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={generate}
            disabled={loading || subjects.length === 0}
            className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Generate AI Schedule
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {!result && !loading && (
            <div
              className="flex flex-col items-center justify-center h-full min-h-64 rounded-2xl"
              style={{
                background: "var(--card-bg)",
                border: "2px dashed var(--border)",
              }}
            >
              <Sparkles size={48} style={{ color: "#7c3aed", opacity: 0.4 }} />
              <p
                className="text-lg font-bold mt-4"
                style={{ color: "var(--text-primary)" }}
              >
                Ready to Generate
              </p>
              <p
                className="text-sm text-center max-w-xs mt-2"
                style={{ color: "var(--text-muted)" }}
              >
                Configure your settings and click "Generate AI Schedule" to get
                your personalized study plan
              </p>
            </div>
          )}

          {result && (
            <>
              {/* Summary */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(147,51,234,0.1))",
                  border: "1px solid rgba(124,58,237,0.3)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      className="font-bold text-sm"
                      style={{ color: "#a78bfa" }}
                    >
                      ✨ Schedule Generated!
                    </h3>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {result.summary}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {result.sessions?.length} sessions · {result.totalHours}h
                      total
                    </p>
                  </div>
                  <button
                    onClick={saveToCalendar}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0"
                    style={{ background: "#7c3aed" }}
                  >
                    <Save size={14} />{" "}
                    {saving ? "Saving..." : "Save to Calendar"}
                  </button>
                </div>
              </div>

              {/* Tips */}
              {result.tips?.length > 0 && (
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={16} style={{ color: "#f59e0b" }} />
                    <h3
                      className="text-sm font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      AI Tips
                    </h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    {result.tips.map((tip, i) => (
                      <p
                        key={i}
                        className="text-xs flex gap-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <span style={{ color: "#f59e0b" }}>•</span>
                        {tip}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Sessions list */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <h3
                  className="text-sm font-bold mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  Study Sessions ({result.sessions?.length})
                </h3>
                <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
                  {result.sessions?.map((s, i) => {
                    const tb = TYPE_BADGE[s.type] || TYPE_BADGE.study;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01]"
                        style={{ background: "var(--bg-primary)" }}
                      >
                        <div
                          className="flex-shrink-0 text-center"
                          style={{ minWidth: "52px" }}
                        >
                          <p
                            className="text-[10px] font-bold"
                            style={{ color: "#a78bfa" }}
                          >
                            {new Date(s.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p
                            className="text-[10px]"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {s.startTime}
                          </p>
                        </div>
                        <div
                          className="w-px h-8 rounded-full"
                          style={{ background: "var(--border)" }}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-xs font-bold truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {s.subject}
                          </p>
                          <p
                            className="text-[11px] truncate"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {s.topic}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize"
                            style={{ background: tb.bg, color: tb.color }}
                          >
                            {s.type}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {s.duration}m
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
