export const DB = {
  users: [
    { id: "u1", name: "Admin User", uni_id: "ADM-001", email: "admin@uni.edu", password: "admin123", join_date: "2024-01-01", is_admin: true },
    { id: "u2", name: "Sarah Ahmed", uni_id: "STU-2210", email: "sarah@uni.edu", password: "pass123", join_date: "2024-03-15", is_admin: false },
    { id: "u3", name: "Rahul Islam", uni_id: "STU-1987", email: "rahul@uni.edu", password: "pass123", join_date: "2024-02-20", is_admin: false },
  ],
  items: [
    { id: "i1", title: "Blue Backpack", description: "Nike backpack with laptop compartment, has a red keychain", location: "Library 2nd Floor", status: "found", posted_by: "u3", date: "2025-05-08", image: "🎒", category: "accessories", tags: ["nike", "laptop", "red"] },
    { id: "i2", title: "Student ID Card", description: "ID card for student Ayesha Rahman, STU-3312", location: "Cafeteria", status: "lost", posted_by: "u2", date: "2025-05-07", image: "🪪", category: "documents", tags: ["id-card", "university"] },
    { id: "i3", title: "Silver Watch", description: "Casio analog watch with silver strap, found near main gate", location: "Main Gate", status: "found", posted_by: "u2", date: "2025-05-06", image: "⌚", category: "accessories", tags: ["casio", "analog", "silver"] },
    { id: "i4", title: "Scientific Calculator", description: "Casio FX-991 EX, has 'Nadia' written on back", location: "Physics Lab", status: "claimed", posted_by: "u3", date: "2025-05-05", image: "🧮", category: "electronics", tags: ["calculator", "scientific"] },
    { id: "i5", title: "Umbrella", description: "Black folding umbrella left in classroom 304", location: "Block C Room 304", status: "found", posted_by: "u1", date: "2025-05-09", image: "☂️", category: "accessories", tags: ["black", "folding"] },
  ],
  claims: [
    { claim_id: "c1", claimer_id: "u2", item_id: "i4", date: "2025-05-06", status: "approved" },
  ],
  comments: [
    { id: "cm1", item_id: "i1", user_id: "u2", comment_text: "I think I saw this backpack! Is it still available?", date: "2025-05-08", timestamp: "14:30" },
    { id: "cm2", item_id: "i1", user_id: "u3", comment_text: "Yes, it's still available! Can you describe the keychain color?", date: "2025-05-08", timestamp: "14:45" },
    { id: "cm3", item_id: "i3", user_id: "u3", comment_text: "This looks like my watch! Can I claim it?", date: "2025-05-06", timestamp: "10:20" },
  ],
  messages: [
    { id: "m1", sender_id: "u2", receiver_id: "u3", item_id: "i1", message_text: "Hi! I'm interested in your backpack. Is it still available?", date: "2025-05-08", timestamp: "14:30", read: true },
    { id: "m2", sender_id: "u3", receiver_id: "u2", item_id: "i1", message_text: "Yes it is! Can you describe the keychain color to make sure it's the right one?", date: "2025-05-08", timestamp: "14:35", read: true },
    { id: "m3", sender_id: "u2", receiver_id: "u3", item_id: "i1", message_text: "It's red! When can we arrange a handover?", date: "2025-05-08", timestamp: "14:40", read: true },
    { id: "m4", sender_id: "u3", receiver_id: "u2", item_id: "i1", message_text: "Great! Let's meet at the library tomorrow at 2 PM", date: "2025-05-08", timestamp: "14:45", read: true },
    { id: "m5", sender_id: "u2", receiver_id: "u1", item_id: "i5", message_text: "Hi! I found your umbrella. Would you like to claim it?", date: "2025-05-09", timestamp: "09:00", read: false },
  ],
  notifications: [
    { id: "n1", user_id: "u2", message: "Your claim for 'Scientific Calculator' has been approved! Collect from Physics Lab.", date: "2025-05-06", read: false },
    { id: "n2", user_id: "u3", message: "Someone claimed your found item 'Scientific Calculator'. Please coordinate pickup.", date: "2025-05-06", read: false },
  ],
};

let nextId = 100;
export const uid = () => `id_${nextId++}`;
