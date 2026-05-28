import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Calendar,
  Timer,
  StickyNote,
  BarChart3,
  Settings,
  LogOut,
  Brain,
  Sun,
  Moon,
} from "lucide-react";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/subjects", icon: BookOpen, label: "Subjects" },
  { to: "/schedule", icon: Sparkles, label: "AI Schedule" },
  { to: "/calendar", icon: Calendar, label: "Calendar" },
  { to: "/pomodoro", icon: Timer, label: "Pomodoro" },
  { to: "/notes", icon: StickyNote, label: "Notes" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { logout, user } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside
      className="sidebar-shell flex flex-col h-full transition-all duration-300"
      style={{
        width: collapsed ? "72px" : "230px",
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--border)",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}
        >
          <Brain size={20} color="white" />
        </div>
        {!collapsed && (
          <div>
            <p
              className="font-bold text-sm leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              StudyAI
            </p>
            <p
              className="text-[10px] tracking-widest mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              PLANNER
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
               ${isActive ? "nav-active" : "nav-inactive"}`
            }
            title={collapsed ? label : ""}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                    style={{ background: "#7c3aed" }}
                  />
                )}
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div
        className="px-2 py-3 flex flex-col gap-1"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200 nav-inactive"
          title={collapsed ? "Toggle theme" : ""}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && (
            <span className="text-sm font-medium">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>

        {/* User */}
        {!collapsed && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl mt-1"
            style={{ background: "var(--card-bg)" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#9333ea)",
                color: "white",
              }}
            >
              {(user?.displayName || user?.email || "U")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-semibold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {user?.displayName || "Student"}
              </p>
              <p
                className="text-[10px] truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {user?.email}
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200 text-red-400 hover:bg-red-500/10"
          title={collapsed ? "Sign out" : ""}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
