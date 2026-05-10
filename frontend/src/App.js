import { useState, useEffect, useCallback } from "react";
import { FONT, C } from "./constants/theme";
import { S } from "./constants/styles";
import { DB, uid } from "./constants/db";
import { NAV } from "./constants/config";
import Auth from "./components/Auth/Auth";
import Dashboard from "./components/Pages/Dashboard";
import ItemsPage from "./components/Pages/ItemsPage";
import HistoryPage from "./components/Pages/HistoryPage";
import NotificationsPage from "./components/Pages/NotificationsPage";
import AdminPage from "./components/Pages/AdminPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [unread, setUnread] = useState(0);

  const refreshUnread = useCallback(() => {
    if (user) setUnread(DB.notifications.filter(n => n.user_id === user.id && !n.read).length);
  }, [user]);

  useEffect(() => { refreshUnread(); }, [user, refreshUnread]);

  if (!user) return <Auth onLogin={(u) => { setUser(u); refreshUnread(); }} />;

  const navItems = NAV.filter(n => !n.adminOnly || user.is_admin);

  return (
    <div style={S.app}>
      <style>{FONT}</style>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoText}>🔍 Lost & Found</div>
          <div style={S.logoSub}>University Portal</div>
        </div>
        <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
          {navItems.map(n => (
            <div key={n.id} style={S.navItem(page === n.id)} onClick={() => { setPage(n.id); if (n.id === "notifications") setTimeout(refreshUnread, 300); }}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              <span>{n.label}</span>
              {n.id === "notifications" && unread > 0 && <span style={{ marginLeft: "auto", background: C.red, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "1px 7px" }}>{unread}</span>}
            </div>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${C.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.accentGlow }}>
              {user.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{user.uni_id}</div>
            </div>
          </div>
          <button style={{ ...S.btn("ghost"), width: "100%", fontSize: 12 }} onClick={() => setUser(null)}>Sign Out</button>
        </div>
      </div>
      {/* Main */}
      <div style={S.main}>
        {page === "dashboard" && <Dashboard user={user} />}
        {page === "items" && <ItemsPage key="all" user={user} filter="all" />}
        {page === "mine" && <ItemsPage key="mine" user={user} filter="mine" />}
        {page === "history" && <HistoryPage user={user} />}
        {page === "notifications" && <NotificationsPage user={user} onRead={refreshUnread} />}
        {page === "admin" && <AdminPage user={user} />}
      </div>
    </div>
  );
}