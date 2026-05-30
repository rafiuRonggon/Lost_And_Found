import { useState } from "react";
import { S } from "../../constants/styles";
import { DB, uid } from "../../constants/db";
import { useTheme } from "../../constants/ThemeContext";

function Comments({ itemId, currentUser }) {
  const { colors: C } = useTheme();
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  // Get all comments for this item
  const itemComments = DB.comments.filter(c => c.item_id === itemId);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const now = new Date();
      DB.comments.push({
        id: uid(),
        item_id: itemId,
        user_id: currentUser.id,
        comment_text: newComment,
        date: now.toISOString().split("T")[0],
        timestamp: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      });
      setNewComment("");
    }
  };

  const handleDeleteComment = (commentId) => {
    const idx = DB.comments.findIndex(c => c.id === commentId);
    if (idx !== -1) DB.comments.splice(idx, 1);
  };

  const getCommentUser = (userId) => {
    return DB.users.find(u => u.id === userId) || { name: "Unknown User" };
  };

  return (
    <div style={{ marginTop: 16, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
      {/* Comments Toggle Button */}
      <button
        style={{
          background: "none",
          border: "none",
          color: C.primary,
          cursor: "pointer",
          fontSize: 12,
          textDecoration: "underline",
          padding: 0,
          marginBottom: 12
        }}
        onClick={() => setShowComments(!showComments)}
      >
        💬 {itemComments.length} {itemComments.length === 1 ? "Comment" : "Comments"}
      </button>

      {/* Comments Section */}
      {showComments && (
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: 12, marginTop: 12 }}>
          {/* New Comment Input */}
          <div style={{ marginBottom: 12 }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              style={{
                ...S.input,
                resize: "vertical",
                minHeight: 60,
                fontFamily: "inherit"
              }}
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              style={{
                ...S.btn("primary"),
                marginTop: 8,
                opacity: newComment.trim() ? 1 : 0.5,
                cursor: newComment.trim() ? "pointer" : "not-allowed"
              }}
            >
              Post Comment
            </button>
          </div>

          {/* Comments List */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
            {itemComments.length === 0 ? (
              <div style={{ fontSize: 12, color: C.textMuted, textAlign: "center", padding: 12 }}>
                No comments yet. Be the first to comment!
              </div>
            ) : (
              itemComments.map(comment => {
                const commentUser = getCommentUser(comment.user_id);
                const isCommentOwner = currentUser.id === comment.user_id;

                return (
                  <div
                    key={comment.id}
                    style={{
                      background: C.border,
                      borderRadius: 4,
                      padding: 10,
                      marginBottom: 8,
                      borderLeft: `3px solid ${C.primary}`
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
                          {commentUser.name}
                        </div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>
                          {comment.date} at {comment.timestamp}
                        </div>
                        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>
                          {comment.comment_text}
                        </div>
                      </div>
                      {isCommentOwner && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: C.danger,
                            cursor: "pointer",
                            fontSize: 14,
                            padding: "0 4px",
                            marginLeft: 8
                          }}
                          title="Delete comment"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Comments;
