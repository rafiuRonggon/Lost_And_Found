import { useState, useEffect, useRef } from "react";
import { S } from "../../constants/styles";
import { DB } from "../../constants/db";
import { useTheme } from "../../constants/ThemeContext";

function ConversationView({ currentUser, otherUserId, onSendMessage, onClose }) {
  const { colors: C } = useTheme();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const otherUser = DB.users.find(u => u.id === otherUserId);

  useEffect(() => {
    // Get all messages between these two users
    const conversation = DB.messages.filter(
      m => (m.sender_id === currentUser.id && m.receiver_id === otherUserId) ||
           (m.sender_id === otherUserId && m.receiver_id === currentUser.id)
    ).sort((a, b) => new Date(`${a.date}T${a.timestamp}`) - new Date(`${b.date}T${b.timestamp}`));

    setMessages(conversation);

    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [currentUser, otherUserId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(otherUserId, newMessage);
      setNewMessage("");
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div style={{ ...S.card, display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            👤
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{otherUser?.name}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Active now</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            color: C.textMuted
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: C.textMuted }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: msg.sender_id === currentUser.id ? "flex-end" : "flex-start",
                gap: 8
              }}
            >
              <div
                style={{
                  maxWidth: "60%",
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: msg.sender_id === currentUser.id ? C.accent : C.surface,
                  color: msg.sender_id === currentUser.id ? "#fff" : C.text,
                  fontSize: 13,
                  lineHeight: 1.5,
                  borderBottomLeftRadius: msg.sender_id === currentUser.id ? 12 : 4,
                  borderBottomRightRadius: msg.sender_id === currentUser.id ? 4 : 12
                }}
              >
                {msg.item_id && (
                  <div style={{
                    fontSize: 11,
                    opacity: 0.8,
                    marginBottom: 6,
                    fontStyle: "italic",
                    borderBottom: `1px solid ${msg.sender_id === currentUser.id ? "rgba(255,255,255,0.3)" : C.border}`,
                    paddingBottom: 6
                  }}>
                    📌 {DB.items.find(i => i.id === msg.item_id)?.title || "Item"}
                  </div>
                )}
                {msg.message_text}
                <div style={{
                  fontSize: 10,
                  opacity: 0.6,
                  marginTop: 4,
                  textAlign: "right"
                }}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", gap: 10 }}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Type a message... (Shift+Enter for new line)"
          style={{
            ...S.input,
            flex: 1,
            resize: "vertical",
            minHeight: 50,
            maxHeight: 120,
            fontFamily: "inherit"
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          style={{
            ...S.btn("primary"),
            alignSelf: "flex-end",
            minHeight: 50,
            opacity: newMessage.trim() ? 1 : 0.5,
            cursor: newMessage.trim() ? "pointer" : "not-allowed"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ConversationView;
