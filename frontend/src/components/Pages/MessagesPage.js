import { useState, useEffect } from "react";
import { S } from "../../constants/styles";
import { DB, uid } from "../../constants/db";
import { useTheme } from "../../constants/ThemeContext";
import ConversationView from "./ConversationView";

function MessagesPage({ user }) {
  const { colors: C } = useTheme();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Get all unique conversations for this user
    const userMessages = DB.messages.filter(m => m.sender_id === user.id || m.receiver_id === user.id);
    const conversationMap = new Map();

    userMessages.forEach(msg => {
      const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, []);
      }
      conversationMap.get(otherUserId).push(msg);
    });

    const convList = Array.from(conversationMap.entries()).map(([otherUserId, msgs]) => {
      const otherUser = DB.users.find(u => u.id === otherUserId);
      const lastMsg = msgs.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      const unreadCount = msgs.filter(m => m.receiver_id === user.id && !m.read).length;

      return {
        otherUserId,
        otherUser,
        lastMessage: lastMsg.message_text,
        lastMessageTime: lastMsg.timestamp || "now",
        lastMessageDate: lastMsg.date,
        unreadCount,
        messageCount: msgs.length
      };
    }).sort((a, b) => new Date(`${b.lastMessageDate}T${b.lastMessageTime}`) - new Date(`${a.lastMessageDate}T${a.lastMessageTime}`));

    setConversations(convList);
  }, [user]);

  const handleSendMessage = (otherUserId, messageText, itemId) => {
    const newMessage = {
      id: uid(),
      sender_id: user.id,
      receiver_id: otherUserId,
      item_id: itemId || null,
      message_text: messageText,
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      read: false
    };
    DB.messages.push(newMessage);
    setConversations([...conversations]);
  };

  const markConversationAsRead = (otherUserId) => {
    DB.messages
      .filter(m => (m.sender_id === otherUserId && m.receiver_id === user.id) || (m.sender_id === user.id && m.receiver_id === otherUserId))
      .forEach(m => {
        if (m.receiver_id === user.id) m.read = true;
      });
    setConversations([...conversations]);
  };

  return (
    <div style={{ display: "flex", gap: 20, minHeight: "calc(100vh - 120px)" }}>
      {/* Conversations List */}
      <div style={{ width: 300, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 16, borderBottom: `1px solid ${C.border}`, fontWeight: 700, fontSize: 14 }}>💬 Conversations</div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {conversations.length === 0 ? (
            <div style={{ padding: 16, textAlign: "center", color: C.textMuted, fontSize: 12 }}>No conversations yet</div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.otherUserId}
                onClick={() => {
                  setSelectedConversation(conv.otherUserId);
                  markConversationAsRead(conv.otherUserId);
                }}
                style={{
                  padding: 12,
                  borderBottom: `1px solid ${C.border}`,
                  cursor: "pointer",
                  background: selectedConversation === conv.otherUserId ? `${C.accent}20` : "transparent",
                  transition: "background 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontWeight: conv.unreadCount > 0 ? 700 : 500, fontSize: 13, color: C.text }}>
                    {conv.otherUser?.name}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span style={{ background: C.red, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "2px 6px" }}>
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: C.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {conv.lastMessage}
                </div>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>{conv.lastMessageDate} {conv.lastMessageTime}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Conversation View */}
      <div style={{ flex: 1 }}>
        {selectedConversation ? (
          <ConversationView
            currentUser={user}
            otherUserId={selectedConversation}
            onSendMessage={handleSendMessage}
            onClose={() => setSelectedConversation(null)}
          />
        ) : (
          <div style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: C.textMuted }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
              <div>Select a conversation to start messaging</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagesPage;
