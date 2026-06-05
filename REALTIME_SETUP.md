# Real-Time Synchronization Setup

## Overview
This document explains the WebSocket real-time synchronization system implemented for the Lost & Found application.

## Backend Changes

### 1. Added WebSocket Server
- File: `backend/server.js`
- The server now uses `http.createServer` with `ws` (WebSocket) library
- Runs on the same port (5000) as the HTTP server

### 2. Broadcast Events
When users create items, messages, comments, or claims, the backend broadcasts updates to all connected clients:

**Events:**
- `item_created` - Triggered when a new item is posted
- `claim_created` - Triggered when someone claims an item
- `comment_created` - Triggered when a comment is posted
- `message_created` - Triggered when a message is sent

### 3. Installation
```bash
cd backend
npm install ws
npm start
```

## Frontend Changes

### 1. New Utility Files

#### `src/utils/websocket.js`
Handles WebSocket connection and event management:
- `initWebSocket()` - Initialize connection on app start
- `onWebSocketEvent(eventType, callback)` - Listen to events
- `removeWebSocketListener()` - Clean up listeners
- Auto-reconnect with exponential backoff

#### `src/utils/api.js`
API wrapper for all backend calls:
- `itemsAPI` - Fetch/create items
- `claimsAPI` - Handle claims
- `commentsAPI` - Manage comments
- `messagesAPI` - Handle messaging

### 2. Component Updates

**Dashboard.js** - Updated to:
- Fetch items and claims from API (not local DB)
- Listen to `item_created` and `claim_created` WebSocket events
- Real-time update of stats and recent activity

### 3. App.js Changes
- Initialize WebSocket connection when user logs in
- Close WebSocket connection on logout
- Cleanup on unmount

## How It Works

```
User A (Browser)              User B (Browser)
      |                             |
      |                             |
   React App ← ← ← WebSocket ← ← → React App
      |         Connection          |
      |                             |
      ↓                             ↓
  API Call               API Call (backend broadcast)
      |                             |
      ├─ POST /api/items ─ → Backend
                                    |
                          (Broadcast to all clients)
                                    |
                                 User A & B
                          See update in real-time
```

## Configuration

### Environment Variables
Create `.env` in frontend root:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
```

## Testing Real-Time Updates

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npm start`
3. Open two browser windows
4. Log in as different users
5. One user creates an item - it should appear instantly in the other user's dashboard

## Next Steps

Apply the same pattern to other components:
- `ItemsPage.js` - Fetch/create items
- `MessagesPage.js` - Real-time messages
- `CommentsPage.js` - Live comments
- `AdminPage.js` - Admin statistics

## Troubleshooting

**WebSocket not connecting:**
- Check backend is running on port 5000
- Check browser console for errors
- Verify firewall allows WebSocket connections

**Data not updating:**
- Verify API calls are successful (check Network tab)
- Check WebSocket connection status in console
- Verify event listeners are attached

**Performance issues:**
- For large data sets, implement pagination
- Use message filtering to reduce broadcast size
- Add data caching strategies
