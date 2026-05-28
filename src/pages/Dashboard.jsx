import { useAuth } from "../hooks/useAuth";
import { useSubjects } from "../hooks/useSubjects";
import { useSchedule } from "../hooks/useSchedule";
import { useNotes } from "../hooks/useNotes";
import {
  BookOpen,
  Sparkles,
  Timer,
  StickyNote,
  TrendingUp,
  Target,
  Flame,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const mockStudyData = WEEK.map((d, i) => ({
  day: d,
  hours: [1.5, 2, 0.5, 3, 2.5, 1, 4][i],
}));

function StatCard({ icon: Icon, label, value, sub, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: color + "22", color }}
        >
          <Icon size={18} />
        </div>
      </div>
      <div>
        <p
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, desc, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl p-4 flex items-center gap-4 w-full text-left transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: color + "22", color }}
      >
        <Icon size={20} />
      </div>
      <div>
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {label}
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {desc}
        </p>
      </div>
    </button>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { subjects } = useSubjects();
  const { sessions } = useSchedule();
  const { notes } = useNotes();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split("T")[0];
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const completedToday = todaySessions.filter((s) => s.completed).length;

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 2xl:px-10 flex flex-col gap-6">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #9333ea 100%)",
        }}
      >
        <div
          className="absolute right-0 top-0 w-64 h-full opacity-10"
          style={{
            background:
              "radial-gradient(circle at 80% 50%, white, transparent)",
          }}
        />
        <div className="relative z-10">
          <p className="text-purple-200 text-sm font-medium mb-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome back, {user?.displayName?.split(" ")[0] || "Student"}! 🎓
          </h2>
          <p className="text-purple-200 text-sm">
            {todaySessions.length > 0
              ? `You have ${todaySessions.length} study session${todaySessions.length > 1 ? "s" : ""} planned today.`
              : "No sessions planned today. Generate your AI schedule to get started!"}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => navigate("/schedule")}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-purple-900 transition-all hover:scale-105"
              style={{ background: "white" }}
            >
              Generate Schedule ✨
            </button>
            <button
              onClick={() => navigate("/pomodoro")}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              Start Studying →
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Subjects"
          value={subjects.length}
          sub="Active subjects"
          color="#7c3aed"
          onClick={() => navigate("/subjects")}
        />
        <StatCard
          icon={Target}
          label="Today's Sessions"
          value={`${completedToday}/${todaySessions.length}`}
          sub="Completed today"
          color="#10b981"
          onClick={() => navigate("/calendar")}
        />
        <StatCard
          icon={StickyNote}
          label="Notes"
          value={notes.length}
          sub="Total notes"
          color="#f59e0b"
          onClick={() => navigate("/notes")}
        />
        <StatCard
          icon={Flame}
          label="Streak"
          value="🔥 0"
          sub="Days in a row"
          color="#ef4444"
          onClick={() => navigate("/analytics")}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study hours chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className="font-bold text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Study Hours This Week
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Daily study time overview
              </p>
            </div>
            <div
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}
            >
              <TrendingUp size={12} /> This week
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={mockStudyData}>
              <defs>
                <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "var(--text-primary)" }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#7c3aed"
                strokeWidth={2.5}
                fill="url(#studyGrad)"
                dot={{ fill: "#7c3aed", r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subjects list */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-bold text-sm"
              style={{ color: "var(--text-primary)" }}
            >
              My Subjects
            </h3>
            <button
              onClick={() => navigate("/subjects")}
              className="text-xs font-semibold"
              style={{ color: "#7c3aed" }}
            >
              View all →
            </button>
          </div>
          {subjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BookOpen
                size={32}
                style={{ color: "var(--text-muted)", opacity: 0.4 }}
              />
              <p
                className="text-sm mt-2"
                style={{ color: "var(--text-muted)" }}
              >
                No subjects yet
              </p>
              <button
                onClick={() => navigate("/subjects")}
                className="mt-3 px-4 py-1.5 rounded-xl text-xs font-semibold text-white"
                style={{ background: "#7c3aed" }}
              >
                Add Subject
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {subjects.slice(0, 5).map((s, i) => {
                const colors = [
                  "#7c3aed",
                  "#10b981",
                  "#f59e0b",
                  "#ef4444",
                  "#3b82f6",
                ];
                const c = colors[i % colors.length];
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "var(--bg-primary)" }}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: c }}
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
                        {s.hoursNeeded || 0}h needed
                      </p>
                    </div>
                    <div
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize"
                      style={{ background: c + "22", color: c }}
                    >
                      {s.priority || "medium"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction
          icon={Sparkles}
          label="AI Schedule"
          desc="Generate smart study plan"
          color="#7c3aed"
          onClick={() => navigate("/schedule")}
        />
        <QuickAction
          icon={Timer}
          label="Pomodoro"
          desc="Start a focus session"
          color="#10b981"
          onClick={() => navigate("/pomodoro")}
        />
        <QuickAction
          icon={StickyNote}
          label="Quick Note"
          desc="Capture your thoughts"
          color="#f59e0b"
          onClick={() => navigate("/notes")}
        />
        <QuickAction
          icon={Clock}
          label="Calendar"
          desc="View your schedule"
          color="#3b82f6"
          onClick={() => navigate("/calendar")}
        />
      </div>

      {/* Today's plan */}
      {todaySessions.length > 0 && (
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
            Today's Study Plan
          </h3>
          <div className="flex flex-col gap-2">
            {todaySessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-4 p-3 rounded-xl"
                style={{ background: "var(--bg-primary)" }}
              >
                <div
                  className="w-2 h-8 rounded-full flex-shrink-0"
                  style={{ background: s.completed ? "#10b981" : "#7c3aed" }}
                />
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: "var(--text-primary)",
                      textDecoration: s.completed ? "line-through" : "none",
                    }}
                  >
                    {s.subject}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {s.startTime} – {s.endTime} · {s.topic}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.completed ? "text-emerald-400" : "text-purple-400"}`}
                  style={{
                    background: s.completed
                      ? "rgba(16,185,129,0.1)"
                      : "rgba(124,58,237,0.1)",
                  }}
                >
                  {s.completed ? "Done" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
