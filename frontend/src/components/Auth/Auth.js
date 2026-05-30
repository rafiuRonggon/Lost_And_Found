import { useState } from "react";
import { FONT } from "../../constants/theme";
import { S } from "../../constants/styles";
import { DB, uid } from "../../constants/db";
import { useTheme } from "../../constants/ThemeContext";

function Auth({ onLogin }) {
  const { colors: C } = useTheme();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", uni_id: "", email: "", password: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    setError("");
    if (mode === "login") {
      const user = DB.users.find(u => u.email === form.email && u.password === form.password);
      if (!user) { setError("Invalid email or password."); return; }
      onLogin(user);
    } else {
      if (!form.name || !form.uni_id || !form.email || !form.password) { setError("All fields required."); return; }
      if (DB.users.find(u => u.email === form.email)) { setError("Email already registered."); return; }
      const user = { id: uid(), name: form.name, uni_id: form.uni_id, email: form.email, password: form.password, join_date: new Date().toISOString().split("T")[0], is_admin: false };
      DB.users.push(user);
      onLogin(user);
    }
  };

  return (
    <div style={S.authWrap}>
      <style>{FONT}</style>
      <div style={S.authCard}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>Lost & Found</div>
          <div style={{ fontSize: 12, color: C.textMuted, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>University Portal</div>
        </div>
        <div style={{ display: "flex", background: C.surface, borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {["login", "signup"].map(m => <button key={m} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 13, background: mode === m ? C.accent : "transparent", color: mode === m ? "#fff" : C.textMuted, transition: "all 0.15s", textTransform: "capitalize" }} onClick={() => { setMode(m); setError(""); }}>{m}</button>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && <>
            <div><label style={S.label}>Full Name</label><input style={S.input} placeholder="Your full name" value={form.name} onChange={set("name")} /></div>
            <div><label style={S.label}>University ID</label><input style={S.input} placeholder="e.g. STU-2024" value={form.uni_id} onChange={set("uni_id")} /></div>
          </>}
          <div><label style={S.label}>Email</label><input style={S.input} type="email" placeholder="you@uni.edu" value={form.email} onChange={set("email")} /></div>
          <div><label style={S.label}>Password</label><input style={S.input} type="password" placeholder="••••••••" value={form.password} onChange={set("password")} /></div>
          {error && <div style={{ fontSize: 12, color: C.red, background: C.theme === "dark" ? "#1A0A0A" : "#FEE2E2", border: `1px solid ${C.red}30`, borderRadius: 8, padding: "8px 12px" }}>⚠️ {error}</div>}
          <button style={{ ...S.btn(), width: "100%", padding: "12px 0", fontSize: 14, marginTop: 4 }} onClick={handleSubmit}>{mode === "login" ? "Sign In" : "Create Account"}</button>
        </div>
        {mode === "login" && <div style={{ marginTop: 20, padding: "14px", background: C.surface, borderRadius: 10, fontSize: 12, color: C.textMuted }}>
          <div style={{ fontWeight: 600, marginBottom: 6, color: C.textSub }}>Demo accounts:</div>
          <div>admin@uni.edu / admin123 (Admin)</div>
          <div>sarah@uni.edu / pass123</div>
          <div>rahul@uni.edu / pass123</div>
        </div>}
      </div>
    </div>
  );
}

export default Auth;
