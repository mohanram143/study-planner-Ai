import { useState, useEffect } from "react";
import { useSchedule } from "../hooks/useSchedule";
import { useSubjects } from "../hooks/useSubjects";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Target,
  Flame,
  Clock,
  BookOpen,
  CheckCircle,
} from "lucide-react";

const COLORS = [
  "#7c3aed",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div
      className="rounded-2xl p-5 w-full max-w-screen-2xl mx-auto px-4 md:px-6 2xl:px-10 flex flex-col gap-6"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 2xl:px-10 flex flex-col gap-6">
        <span
          className="text-xs font-semibold"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: color + "22", color }}
        >
          <Icon size={16} />
        </div>
      </div>
      <p
        className="text-2xl font-black"
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
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs shadow-xl"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
      }}
    >
      <p className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const { sessions } = useSchedule();
  const { subjects } = useSubjects();
  const [range, setRange] = useState("week");

  // Build weekly study data from sessions
  const today = new Date();
  const days = range === "week" ? 7 : 30;
  const dateLabels = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    return d.toISOString().split("T")[0];
  });

  const dailyData = dateLabels.map((date) => {
    const daySessions = sessions.filter((s) => s.date === date);
    const completed = daySessions.filter((s) => s.completed).length;
    const total = daySessions.length;
    const minutes = daySessions
      .filter((s) => s.completed)
      .reduce((acc, s) => acc + (s.duration || 0), 0);
    return {
      date: new Date(date + "T00:00:00").toLocaleDateString(
        "en-US",
        range === "week"
          ? { weekday: "short" }
          : { month: "short", day: "numeric" },
      ),
      sessions: completed,
      planned: total,
      minutes: Math.round(minutes),
      hours: +(minutes / 60).toFixed(1),
    };
  });

  // Subject distribution
  const subjectData = subjects
    .map((sub, i) => {
      const subSessions = sessions.filter(
        (s) => s.subject === sub.name && s.completed,
      );
      const minutes = subSessions.reduce(
        (acc, s) => acc + (s.duration || 0),
        0,
      );
      return {
        name: sub.name,
        value: minutes || 0,
        color: COLORS[i % COLORS.length],
      };
    })
    .filter((s) => s.value > 0);

  // Completion rate data
  const completionData = dateLabels.slice(-7).map((date) => {
    const daySessions = sessions.filter((s) => s.date === date);
    const rate =
      daySessions.length > 0
        ? Math.round(
            (daySessions.filter((s) => s.completed).length /
              daySessions.length) *
              100,
          )
        : 0;
    return {
      date: new Date(date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
      }),
      rate,
    };
  });

  // Summary stats
  const totalCompleted = sessions.filter((s) => s.completed).length;
  const totalPlanned = sessions.length;
  const completionRate =
    totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;
  const totalMinutes = sessions
    .filter((s) => s.completed)
    .reduce((a, s) => a + (s.duration || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Streak calc
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    const hasCompleted = sessions.some((s) => s.date === ds && s.completed);
    if (hasCompleted) streak++;
    else if (i > 0) break;
  }

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Analytics
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Track your study progress and consistency
          </p>
        </div>
        <div
          className="flex gap-2 p-1 rounded-xl"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          {["week", "month"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
              style={{
                background: range === r ? "#7c3aed" : "transparent",
                color: range === r ? "white" : "var(--text-muted)",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Total Hours"
          value={`${totalHours}h`}
          sub="Study time logged"
          color="#7c3aed"
        />
        <StatCard
          icon={CheckCircle}
          label="Completion Rate"
          value={`${completionRate}%`}
          sub={`${totalCompleted} of ${totalPlanned} sessions`}
          color="#10b981"
        />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={`🔥 ${streak}`}
          sub="Days in a row"
          color="#ef4444"
        />
        <StatCard
          icon={BookOpen}
          label="Subjects"
          value={subjects.length}
          sub="Active subjects"
          color="#f59e0b"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study hours area chart */}
        <div
          className="rounded-2xl p-5"
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
                Study Hours
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Hours studied per day
              </p>
            </div>
            <TrendingUp size={16} style={{ color: "#7c3aed" }} />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="hours"
                name="Hours"
                stroke="#7c3aed"
                strokeWidth={2.5}
                fill="url(#hoursGrad)"
                dot={{ fill: "#7c3aed", r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Completion rate bar */}
        <div
          className="rounded-2xl p-5"
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
                Daily Completion
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Sessions completed (%) per day
              </p>
            </div>
            <Target size={16} style={{ color: "#10b981" }} />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={completionData} barSize={24}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" name="Completion %" radius={[6, 6, 0, 0]}>
                {completionData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.rate >= 80
                        ? "#10b981"
                        : entry.rate >= 50
                          ? "#f59e0b"
                          : "#ef4444"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject pie */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <h3
            className="font-bold text-sm mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Time by Subject
          </h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            Minutes per subject
          </p>
          {subjectData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No data yet
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Complete sessions to see breakdown
              </p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {subjectData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 mt-2">
                {subjectData.slice(0, 4).map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: s.color }}
                      />
                      <span
                        className="text-[11px] truncate max-w-[100px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {s.name}
                      </span>
                    </div>
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {s.value}m
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sessions bar */}
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
                Sessions Overview
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Planned vs completed sessions
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData} barSize={12} barGap={4}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "11px", color: "var(--text-muted)" }}
              />
              <Bar
                dataKey="planned"
                name="Planned"
                fill="rgba(124,58,237,0.25)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="sessions"
                name="Completed"
                fill="#7c3aed"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Streak calendar */}
      <div
        className="rounded-2xl p-5"
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
              Activity Heatmap
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Last 30 days of study activity
            </p>
          </div>
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <span>Less</span>
            {[
              "rgba(124,58,237,0.1)",
              "rgba(124,58,237,0.3)",
              "rgba(124,58,237,0.6)",
              "#7c3aed",
            ].map((c, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 rounded-sm"
                style={{ background: c }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {dateLabels.map((date) => {
            const daySessions = sessions.filter(
              (s) => s.date === date && s.completed,
            );
            const count = daySessions.length;
            const intensity =
              count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3;
            const bgMap = [
              "rgba(124,58,237,0.08)",
              "rgba(124,58,237,0.3)",
              "rgba(124,58,237,0.6)",
              "#7c3aed",
            ];
            const isToday = date === today.toISOString().split("T")[0];
            return (
              <div
                key={date}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-bold cursor-default transition-all hover:scale-110 relative group"
                style={{
                  background: bgMap[intensity],
                  border: isToday ? "2px solid #7c3aed" : "none",
                  color: intensity >= 2 ? "white" : "var(--text-muted)",
                }}
                title={`${date}: ${count} session${count !== 1 ? "s" : ""}`}
              >
                {new Date(date + "T00:00:00").getDate()}
                {count > 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-slate-900 text-white text-[9px] px-2 py-1 rounded-lg whitespace-nowrap z-10">
                    {count} session{count !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
