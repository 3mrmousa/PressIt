# Socket.io Integration Guide for System Logs

## 1. What is Socket.io?
Socket.io is a library that enables real-time, bi-directional communication between web clients and servers. Unlike REST APIs where the client has to ask for data (polling), Socket.io allows the server to *push* data to the client instantly.

## 2. Server-side Setup (Backend)

First, you need to install the package in your backend. Open your terminal in the `server` folder:
`npm install socket.io`

### Modifying `server/index.ts`

Right now, you use `app.listen(PORT)` to start your express server. With Socket.io, we need to attach it to the raw Node.js HTTP server.

**Code to change in `index.ts`**:
```typescript
import { createServer } from "http";
import { Server } from "socket.io";

// ... existing code ...
const app = express();
const httpServer = createServer(app); // Create HTTP server from Express

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:3002"], // allow your frontend (client & admin)
    methods: ["GET", "POST"]
  }
});

// Handle connections (good for debugging)
io.on("connection", (socket) => {
  console.log("A user connected to Socket.io:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Export it so we can use it in other files (like admin.service.ts)
export { io };
```

Make sure to change the bottom of the file from `app.listen` to `httpServer.listen`:
```typescript
connectDB()
  .then(() => {
    // USE httpServer here instead of app
    httpServer.listen(PORT, () => {
      console.log("🚀 Server started on port", PORT);
    });
  })
```

## 3. Emitting Logs from the Backend

Now that the server is set up, we need to send ("emit") a message to all connected clients whenever a new log is created.

If you look in your `index.ts` error handler around line 70, you are creating an error log. Let's make it real-time.

**Code to update:**
```typescript
import { io } from "./index.js"; // Import the io instance

// Inside the error handler where you create the log:
SystemLog.create({
  level: "error",
  message: err.message || "Internal server error",
  // ... meta data ...
}).then((newLog) => {
  // IMPORTANT: Emit the new log to everyone listening in real-time!
  io.emit("new-system-log", newLog);
}).catch((dbErr) => console.error("Failed to log error to DB:", dbErr));
```
You can do this exact same `io.emit("new-system-log", newLog)` anywhere you create a `SystemLog`.

## 4. Client-side Setup (Frontend)

Now, your React/Next.js frontend needs to listen for these events.

First, install the client package. Open your terminal in the `admin` folder:
`npm install socket.io-client`

### Modifying your Logs Page

In your `LogsPage.tsx` or a dedicated component, you'll establish the connection and listen for the event.

**Code for `LogsPage.tsx`**:
```tsx
"use client"; // Needs to be a client component for real-time hooks

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SystemLog } from "../../features/admin/types";

export default function LogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);

  useEffect(() => {
    // 1. Fetch initial historical logs from your REST API
    // (You already know how to do this using your serverIndex.ts)
    // fetchLogs().then(data => setLogs(data.logs));

    // 2. Connect to Socket.io backend
    const socket: Socket = io("http://localhost:5000", {
      withCredentials: true,
    });

    // 3. Listen for the specific event we created on the backend
    socket.on("new-system-log", (newLog: SystemLog) => {
      console.log("Received new log in real-time!", newLog);
      
      // Add the new log to the TOP of the current logs list
      setLogs((prevLogs) => [newLog, ...prevLogs]);
    });

    // 4. Cleanup when the component unmounts so we don't have memory leaks
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col flex-1 font-sans p-8">
      <h1>Live System Logs</h1>
      <ul>
        {logs.map((log) => (
          <li key={log._id}>[{log.level}] {log.message}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Summary of the Flow:
1. **Frontend** visits the Logs page and connects to Socket.io (`socket.on`).
2. **Backend** encounters an error (or other event), creates a MongoDB document, and yells into the megaphone: `io.emit("new-system-log", data)`.
3. **Frontend** instantly receives that data and updates the React state (`setLogs`). The UI updates immediately without refreshing the page!
