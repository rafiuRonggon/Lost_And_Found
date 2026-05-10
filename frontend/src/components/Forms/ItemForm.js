import { useState } from "react";
import { C } from "../../constants/theme";
import { S } from "../../constants/styles";

function ItemForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({ title: "", description: "", location: "", status: "lost", image: "📦", ...initial });
  const emojis = ["📦", "🎒", "🪪", "⌚", "📱", "💻", "🔑", "👜", "📚", "☂️", "🧮", "👓", "🎧", "💳"];
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={S.label}>Icon</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {emojis.map(e => <button key={e} onClick={() => setForm(f => ({ ...f, image: e }))} style={{ fontSize: 20, background: form.image === e ? `${C.accent}30` : "#0D1421", border: `1px solid ${form.image === e ? C.accent : C.border}`, borderRadius: 8, padding: "4px 8px", cursor: "pointer" }}>{e}</button>)}
        </div>
      </div>
      {[["title", "Item Title"], ["location", "Location Found/Lost"]].map(([k, lbl]) => (
        <div key={k}>
          <label style={S.label}>{lbl}</label>
          <input style={S.input} value={form[k]} onChange={set(k)} placeholder={lbl} />
        </div>
      ))}
      <div>
        <label style={S.label}>Description</label>
        <textarea style={{ ...S.input, height: 80, resize: "vertical" }} value={form.description} onChange={set("description")} placeholder="Detailed description..." />
      </div>
      <div>
        <label style={S.label}>Status</label>
        <select style={{ ...S.input }} value={form.status} onChange={set("status")}>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
        <button style={S.btn("ghost")} onClick={onCancel}>Cancel</button>
        <button style={S.btn()} onClick={() => { if (form.title && form.location) onSave(form); }}>Save Item</button>
      </div>
    </div>
  );
}

export default ItemForm;
