import { S } from "../../constants/styles";

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000CC", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...S.card, width: 480, maxHeight: "85vh", overflowY: "auto", borderRadius: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 17, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} style={{ ...S.btn("ghost"), padding: "4px 10px" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
