import { useState } from "react";
import { C } from "../../constants/theme";
import { S } from "../../constants/styles";
import { DB, uid } from "../../constants/db";
import Modal from "../UI/Modal";
import ItemCard from "../UI/ItemCard";
import ItemForm from "../Forms/ItemForm";

function ItemsPage({ user, filter }) {
  const [items, setItems] = useState([...DB.items]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [claimTarget, setClaimTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const refresh = () => setItems([...DB.items]);

  const filtered = items.filter(i => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) || i.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    const matchFilter = filter === "mine" ? i.posted_by === user.id : true;
    return matchSearch && matchStatus && matchFilter;
  });

  const handleSave = (form) => {
    if (editing) {
      const idx = DB.items.findIndex(i => i.id === editing.id);
      DB.items[idx] = { ...editing, ...form };
    } else {
      DB.items.unshift({ ...form, id: uid(), posted_by: user.id, date: new Date().toISOString().split("T")[0] });
    }
    refresh(); setShowForm(false); setEditing(null);
  };

  const handleDelete = (id) => {
    const idx = DB.items.findIndex(i => i.id === id);
    DB.items.splice(idx, 1);
    refresh();
  };

  const handleClaim = (item) => {
    const claim = { claim_id: uid(), claimer_id: user.id, item_id: item.id, date: new Date().toISOString().split("T")[0], status: "pending" };
    DB.claims.push(claim);
    const idx = DB.items.findIndex(i => i.id === item.id);
    DB.items[idx].status = "claimed";
    DB.notifications.push({ id: uid(), user_id: user.id, message: `You claimed "${item.title}". The founder will contact you.`, date: claim.date, read: false });
    DB.notifications.push({ id: uid(), user_id: item.posted_by, message: `Someone claimed your found item "${item.title}". Please coordinate pickup!`, date: claim.date, read: false });
    setClaimTarget(null); refresh();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={S.pageTitle}>{filter === "mine" ? "My Items" : "All Items"}</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>{filtered.length} items found</div>
        </div>
        <button style={S.btn()} onClick={() => { setEditing(null); setShowForm(true); }}>+ Report Item</button>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input style={{ ...S.input, flex: 1 }} placeholder="Search items or locations..." value={search} onChange={e => setSearch(e.target.value)} />
        {["all", "lost", "found", "claimed"].map(s => (
          <button key={s} style={{ ...S.btn(statusFilter === s ? "primary" : "ghost"), textTransform: "capitalize" }} onClick={() => setStatusFilter(s)}>{s}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", color: C.textMuted, padding: 40 }}>No items found.</div>}
        {filtered.map(item => <ItemCard key={item.id} item={item} currentUser={user} onEdit={i => { setEditing(i); setShowForm(true); }} onDelete={handleDelete} onClaim={setClaimTarget} showOwner={filter !== "mine"} />)}
      </div>
      {showForm && <Modal title={editing ? "Edit Item" : "Report Item"} onClose={() => { setShowForm(false); setEditing(null); }}>
        <ItemForm initial={editing || {}} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      </Modal>}
      {claimTarget && <Modal title="Confirm Claim" onClose={() => setClaimTarget(null)}>
        <div style={{ fontSize: 14, color: C.textSub, marginBottom: 20 }}>
          Are you sure you want to claim <strong style={{ color: C.text }}>{claimTarget.title}</strong>? The founder will be notified to coordinate handover.
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button style={S.btn("ghost")} onClick={() => setClaimTarget(null)}>Cancel</button>
          <button style={S.btn("success")} onClick={() => handleClaim(claimTarget)}>Yes, Claim It</button>
        </div>
      </Modal>}
    </div>
  );
}

export default ItemsPage;
