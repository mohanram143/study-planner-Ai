import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, Bell, Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/subjects": "My Subjects",
  "/schedule": "AI Schedule Generator",
  "/calendar": "Calendar Planner",
  "/pomodoro": "Pomodoro Timer",
  "/notes": "Study Notes",
  "/analytics": "Analytics",
};

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const title = PAGE_TITLES[location.pathname] || "StudyAI";
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header
      className="topbar-shell flex items-center gap-4 px-6 py-3"
      style={{
        background: "var(--topbar-bg)",
        borderBottom: "1px solid var(--border)",
        height: "60px",
        flexShrink: 0,
      }}
    >
      {/* Menu toggle */}
      <button
        onClick={onMenuClick}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-purple-500/10"
        style={{ color: "var(--text-muted)" }}
      >
        <Menu size={18} />
      </button>

      {/* Title + greeting */}
      <div className="flex-1 min-w-0">
        <h1
          className="text-base font-bold leading-none truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h1>
        <p
          className="text-xs mt-0.5 truncate hidden sm:block"
          style={{ color: "var(--text-muted)" }}
        >
          {greeting()}, {user?.displayName?.split(" ")[0] || "Student"} 👋
        </p>
      </div>

      {/* Search */}
      <div className="relative hidden md:flex items-center">
        <Search
          size={14}
          className="absolute left-3"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="pl-9 pr-4 py-2 text-sm rounded-xl outline-none transition-all"
          style={{
            width: "200px",
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            fontFamily: "'Outfit', sans-serif",
          }}
        />
      </div>

      {/* Bell */}
      <button
        className="w-8 h-8 rounded-lg flex items-center justify-center relative transition-all hover:bg-purple-500/10"
        style={{ color: "var(--text-muted)" }}
      >
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500" />
      </button>

      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 cursor-pointer"
        style={{
          background: "linear-gradient(135deg,#7c3aed,#9333ea)",
          color: "white",
        }}
      >
        {(user?.displayName || user?.email || "U")[0].toUpperCase()}
      </div>
    </header>
  );
}
