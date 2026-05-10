export const DB = {
  users: [
    { id: "u1", name: "Admin User", uni_id: "ADM-001", email: "admin@uni.edu", password: "admin123", join_date: "2024-01-01", is_admin: true },
    { id: "u2", name: "Sarah Ahmed", uni_id: "STU-2210", email: "sarah@uni.edu", password: "pass123", join_date: "2024-03-15", is_admin: false },
    { id: "u3", name: "Rahul Islam", uni_id: "STU-1987", email: "rahul@uni.edu", password: "pass123", join_date: "2024-02-20", is_admin: false },
  ],
  items: [
    { id: "i1", title: "Blue Backpack", description: "Nike backpack with laptop compartment, has a red keychain", location: "Library 2nd Floor", status: "found", posted_by: "u3", date: "2025-05-08", image: "🎒" },
    { id: "i2", title: "Student ID Card", description: "ID card for student Ayesha Rahman, STU-3312", location: "Cafeteria", status: "lost", posted_by: "u2", date: "2025-05-07", image: "🪪" },
    { id: "i3", title: "Silver Watch", description: "Casio analog watch with silver strap, found near main gate", location: "Main Gate", status: "found", posted_by: "u2", date: "2025-05-06", image: "⌚" },
    { id: "i4", title: "Scientific Calculator", description: "Casio FX-991 EX, has 'Nadia' written on back", location: "Physics Lab", status: "claimed", posted_by: "u3", date: "2025-05-05", image: "🧮" },
    { id: "i5", title: "Umbrella", description: "Black folding umbrella left in classroom 304", location: "Block C Room 304", status: "found", posted_by: "u1", date: "2025-05-09", image: "☂️" },
  ],
  claims: [
    { claim_id: "c1", claimer_id: "u2", item_id: "i4", date: "2025-05-06", status: "approved" },
  ],
  notifications: [
    { id: "n1", user_id: "u2", message: "Your claim for 'Scientific Calculator' has been approved! Collect from Physics Lab.", date: "2025-05-06", read: false },
    { id: "n2", user_id: "u3", message: "Someone claimed your found item 'Scientific Calculator'. Please coordinate pickup.", date: "2025-05-06", read: false },
  ],
};

let nextId = 100;
export const uid = () => `id_${nextId++}`;
