import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { useAuth } from "./hooks/useAuth";
import DashboardLayout from "./components/layout/DashboardLayout";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import SubjectsPage from "./pages/SubjectsPage";
import SchedulePage from "./pages/SchedulePage";
import CalendarPage from "./pages/CalendarPage";
import PomodoroPage from "./pages/PomodoroPage";
import NotesPage from "./pages/NotesPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-primary)" }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-3"
            style={{ animation: "spin 0.8s linear infinite" }}
          />
          <p
            className="text-sm"
            style={{
              color: "var(--text-muted)",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  return user ? children : <Navigate to="/" replace />;
}

function WithLayout({ children }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--card-bg)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              fontSize: "13px",
              fontFamily: "'Outfit', sans-serif",
            },
            success: { iconTheme: { primary: "#10b981", secondary: "white" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "white" } },
          }}
        />
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <WithLayout>
                <Dashboard />
              </WithLayout>
            }
          />
          <Route
            path="/subjects"
            element={
              <WithLayout>
                <SubjectsPage />
              </WithLayout>
            }
          />
          <Route
            path="/schedule"
            element={
              <WithLayout>
                <SchedulePage />
              </WithLayout>
            }
          />
          <Route
            path="/calendar"
            element={
              <WithLayout>
                <CalendarPage />
              </WithLayout>
            }
          />
          <Route
            path="/pomodoro"
            element={
              <WithLayout>
                <PomodoroPage />
              </WithLayout>
            }
          />
          <Route
            path="/notes"
            element={
              <WithLayout>
                <NotesPage />
              </WithLayout>
            }
          />
          <Route
            path="/analytics"
            element={
              <WithLayout>
                <AnalyticsPage />
              </WithLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
