import { C, STATUS_CONFIG } from "../../constants/theme";
import { S } from "../../constants/styles";
import { DB } from "../../constants/db";

function ItemCard({ item, currentUser, onEdit, onDelete, onClaim, showOwner }) {
  const poster = DB.users.find(u => u.id === item.posted_by);
  const cfg = STATUS_CONFIG[item.status];
  const isOwner = currentUser.id === item.posted_by;
  const hasClaimed = DB.claims.some(c => c.claimer_id === currentUser.id && c.item_id === item.id);
  
  return (
    <div style={{ ...S.itemCard }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 30 }}>{item.image}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{item.title}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>📍 {item.location}</div>
          </div>
        </div>
        <span style={S.badge(cfg.color, cfg.bg)}>{cfg.icon} {cfg.label}</span>
      </div>
      <p style={{ fontSize: 13, color: C.textSub, margin: "0 0 12px", lineHeight: 1.6 }}>{item.description}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={S.tag}>{item.date}</span>
          {showOwner && <span style={{ fontSize: 12, color: C.textMuted }}>by {poster?.name}</span>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isOwner && item.status !== "claimed" && <>
            <button style={S.btn("ghost")} onClick={() => onEdit(item)}>✏️ Edit</button>
            <button style={S.btn("danger")} onClick={() => onDelete(item.id)}>🗑️</button>
          </>}
          {!isOwner && item.status === "found" && !hasClaimed && (
            <button style={S.btn("success")} onClick={() => onClaim(item)}>Claim →</button>
          )}
          {hasClaimed && <span style={S.badge(C.amber, "#1A140A")}>✓ Claimed</span>}
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
