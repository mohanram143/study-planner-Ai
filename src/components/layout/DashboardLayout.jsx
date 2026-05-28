import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        <main className="flex-1 overflow-y-auto p-6" style={{ background: "var(--bg-primary)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}