import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, SkipForward, Settings, X } from "lucide-react";
import { useSubjects } from "../hooks/useSubjects";
import { POMODORO_PRESETS } from "../utils/constants";
import toast from "react-hot-toast";

const MODE = { WORK: "work", SHORT: "short", LONG: "long" };
const MODE_LABELS = {
  work: "Focus Time",
  short: "Short Break",
  long: "Long Break",
};
const MODE_COLORS = { work: "#7c3aed", short: "#10b981", long: "#3b82f6" };

export default function PomodoroPage() {
  const { subjects } = useSubjects();
  const [preset, setPreset] = useState(POMODORO_PRESETS[0]);
  const [mode, setMode] = useState(MODE.WORK);
  const [seconds, setSeconds] = useState(POMODORO_PRESETS[0].work * 60);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [totalFocused, setTotalFocused] = useState(0);
  const intervalRef = useRef(null);
  const startSecondsRef = useRef(POMODORO_PRESETS[0].work * 60);

  const getModeSeconds = (m, p) => {
    if (m === MODE.WORK) return p.work * 60;
    if (m === MODE.SHORT) return p.short * 60;
    return p.long * 60;
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            handleTimerEnd();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const handleTimerEnd = () => {
    setRunning(false);
    if (mode === MODE.WORK) {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      setSessions((s) => s + 1);
      setTotalFocused((t) => t + preset.work);
      toast.success("🎉 Focus session complete! Take a break.", {
        duration: 4000,
      });
      const nextMode = newCycles % 4 === 0 ? MODE.LONG : MODE.SHORT;
      switchMode(nextMode);
    } else {
      toast("⏰ Break over! Time to focus.", { duration: 3000 });
      switchMode(MODE.WORK);
    }
    try {
      new Audio(
        "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
      ).play();
    } catch {}
  };

  const switchMode = (m) => {
    setMode(m);
    const s = getModeSeconds(m, preset);
    setSeconds(s);
    startSecondsRef.current = s;
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    const s = getModeSeconds(mode, preset);
    setSeconds(s);
    startSecondsRef.current = s;
  };

  const applyPreset = (p) => {
    setPreset(p);
    setRunning(false);
    const s = getModeSeconds(mode, p);
    setSeconds(s);
    startSecondsRef.current = s;
    setShowSettings(false);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const progress = 1 - seconds / (startSecondsRef.current || 1);
  const color = MODE_COLORS[mode];
  const radius = 130;
  const circ = 2 * Math.PI * radius;

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
      <div>
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Pomodoro Timer
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Stay focused with timed study sessions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div
          className="lg:col-span-2 rounded-2xl p-8 flex flex-col items-center gap-6"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Mode tabs */}
          <div
            className="flex gap-2 p-1 rounded-xl"
            style={{ background: "var(--bg-primary)" }}
          >
            {Object.entries(MODE_LABELS).map(([m, label]) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: mode === m ? color : "transparent",
                  color: mode === m ? "white" : "var(--text-muted)",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Subject select */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 rounded-xl text-sm outline-none w-full max-w-xs"
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            <option value="">🎯 Select subject (optional)</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          {/* SVG Circle timer */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: 300, height: 300 }}
          >
            <svg width={300} height={300} className="-rotate-90">
              <circle
                cx={150}
                cy={150}
                r={radius}
                fill="none"
                stroke="var(--bg-primary)"
                strokeWidth={12}
              />
              <circle
                cx={150}
                cy={150}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={12}
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - progress)}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span
                className="text-6xl font-black tracking-tight"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                {mm}:{ss}
              </span>
              <span className="text-sm font-semibold mt-1" style={{ color }}>
                {MODE_LABELS[mode]}
              </span>
              {selectedSubject && (
                <span
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {selectedSubject}
                </span>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={reset}
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: "var(--bg-primary)",
                color: "var(--text-muted)",
              }}
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={() => setRunning((r) => !r)}
              className="w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                color: "white",
                boxShadow: `0 8px 24px ${color}44`,
              }}
            >
              {running ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <button
              onClick={() =>
                switchMode(mode === MODE.WORK ? MODE.SHORT : MODE.WORK)
              }
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: "var(--bg-primary)",
                color: "var(--text-muted)",
              }}
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Stats row */}
          <div className="flex gap-6 text-center">
            {[
              { label: "Sessions", value: sessions },
              { label: "Cycles", value: Math.floor(cycles / 4) },
              { label: "Focused", value: `${totalFocused}m` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p
                  className="text-xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {value}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Settings & Info */}
        <div className="flex flex-col gap-4">
          {/* Presets */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <h3
              className="text-sm font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              ⚙️ Presets
            </h3>
            <div className="flex flex-col gap-2">
              {POMODORO_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className="flex items-center justify-between p-3 rounded-xl transition-all text-left"
                  style={{
                    background:
                      preset.label === p.label
                        ? "rgba(124,58,237,0.15)"
                        : "var(--bg-primary)",
                    border: `1px solid ${preset.label === p.label ? "#7c3aed" : "var(--border)"}`,
                  }}
                >
                  <div>
                    <p
                      className="text-xs font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {p.label}
                    </p>
                    <p
                      className="text-[10px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {p.work}m work · {p.short}m break
                    </p>
                  </div>
                  {preset.label === p.label && (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: "#7c3aed" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <h3
              className="text-sm font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              💡 Pomodoro Tips
            </h3>
            <div className="flex flex-col gap-2">
              {[
                "Work in focused 25-min blocks",
                "Take short breaks between sessions",
                "Every 4 sessions = long break",
                "Eliminate distractions during focus",
                "Review progress after each cycle",
              ].map((tip, i) => (
                <p
                  key={i}
                  className="text-xs flex gap-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span style={{ color: "#7c3aed" }}>›</span> {tip}
                </p>
              ))}
            </div>
          </div>

          {/* Session log */}
          {sessions > 0 && (
            <div
              className="rounded-2xl p-4"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                className="text-sm font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Today's Log
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: sessions }).map((_, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(124,58,237,0.2)",
                      color: "#a78bfa",
                    }}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
