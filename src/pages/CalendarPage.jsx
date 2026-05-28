import { useState } from "react";
import { useSchedule } from "../hooks/useSchedule";
import { ChevronLeft, ChevronRight, Check, Circle } from "lucide-react";
import { DAYS, MONTHS } from "../utils/constants";
import toast from "react-hot-toast";

export default function CalendarPage() {
  const { sessions, update } = useSchedule();
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState(
    new Date().toISOString().split("T")[0],
  );

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () =>
    setCurrent((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const next = () =>
    setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const dayStr = (d) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const sessionsOnDay = (d) => sessions.filter((s) => s.date === dayStr(d));
  const selectedSessions = sessions.filter((s) => s.date === selected);

  const toggleComplete = async (s) => {
    try {
      await update(s.id, { completed: !s.completed });
      toast.success(
        s.completed ? "Marked as pending" : "Session completed! 🎉",
      );
    } catch {
      toast.error("Failed to update.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 w-full">
      <div>
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Calendar Planner
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          View and manage your study sessions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <h3
              className="font-bold text-base"
              style={{ color: "var(--text-primary)" }}
            >
              {MONTHS[month]} {year}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-purple-500/10"
                style={{ color: "var(--text-muted)" }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => {
                  setCurrent(new Date());
                  setSelected(today);
                }}
                className="px-3 py-1 rounded-lg text-xs font-semibold"
                style={{
                  background: "rgba(124,58,237,0.15)",
                  color: "#a78bfa",
                }}
              >
                Today
              </button>
              <button
                onClick={next}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-purple-500/10"
                style={{ color: "var(--text-muted)" }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-bold py-1"
                style={{ color: "var(--text-muted)" }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const ds = dayStr(d);
              const daySessions = sessionsOnDay(d);
              const isToday = ds === today;
              const isSelected = ds === selected;
              const hasCompleted = daySessions.some((s) => s.completed);
              const hasPending = daySessions.some((s) => !s.completed);

              return (
                <button
                  key={d}
                  onClick={() => setSelected(ds)}
                  className="aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm font-semibold transition-all duration-200 hover:scale-105 relative"
                  style={{
                    background: isSelected
                      ? "#7c3aed"
                      : isToday
                        ? "rgba(124,58,237,0.15)"
                        : "var(--bg-primary)",
                    color: isSelected
                      ? "white"
                      : isToday
                        ? "#a78bfa"
                        : "var(--text-primary)",
                    border:
                      isToday && !isSelected
                        ? "1.5px solid #7c3aed"
                        : "1.5px solid transparent",
                  }}
                >
                  {d}
                  {daySessions.length > 0 && (
                    <div className="flex gap-0.5">
                      {hasCompleted && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      )}
                      {hasPending && (
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: isSelected ? "white" : "#a78bfa",
                          }}
                        />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day detail */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-3"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <div>
            <h3
              className="font-bold text-sm"
              style={{ color: "var(--text-primary)" }}
            >
              {new Date(selected + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {selectedSessions.length} session
              {selectedSessions.length !== 1 ? "s" : ""} ·{" "}
              {selectedSessions.filter((s) => s.completed).length} completed
            </p>
          </div>

          {selectedSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-8 text-center">
              <div className="text-3xl mb-2">📅</div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                No sessions
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Use AI Schedule to plan your day
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 overflow-y-auto max-h-80">
              {selectedSessions.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl flex gap-3 items-start transition-all"
                  style={{
                    background: "var(--bg-primary)",
                    opacity: s.completed ? 0.7 : 1,
                  }}
                >
                  <button
                    onClick={() => toggleComplete(s)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {s.completed ? (
                      <Check size={16} className="text-emerald-400" />
                    ) : (
                      <Circle
                        size={16}
                        style={{ color: "var(--text-muted)" }}
                      />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-bold truncate"
                      style={{
                        color: "var(--text-primary)",
                        textDecoration: s.completed ? "line-through" : "none",
                      }}
                    >
                      {s.subject}
                    </p>
                    <p
                      className="text-[10px] truncate"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {s.topic}
                    </p>
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {s.startTime} – {s.endTime}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                      s.priority === "high"
                        ? "text-red-400 bg-red-500/10"
                        : s.priority === "low"
                          ? "text-emerald-400 bg-emerald-500/10"
                          : "text-yellow-400 bg-yellow-500/10"
                    }`}
                  >
                    {s.priority}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Progress */}
          {selectedSessions.length > 0 && (
            <div
              className="mt-auto pt-3"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: "var(--text-muted)" }}>Day progress</span>
                <span className="font-bold" style={{ color: "#a78bfa" }}>
                  {Math.round(
                    (selectedSessions.filter((s) => s.completed).length /
                      selectedSessions.length) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full"
                style={{ background: "var(--bg-primary)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(selectedSessions.filter((s) => s.completed).length / selectedSessions.length) * 100}%`,
                    background: "linear-gradient(90deg,#7c3aed,#10b981)",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
