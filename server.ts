import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import nodemailer from "nodemailer";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = new Database("onemsu.db");
try {
  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    campus TEXT,
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    sender_name TEXT,
    content TEXT,
    room_id TEXT,
    media_url TEXT,
    media_type TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_by_sender INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS user_room_settings (
    user_id INTEGER,
    room_id TEXT,
    clear_before TEXT,
    PRIMARY KEY (user_id, room_id)
  );

  CREATE TABLE IF NOT EXISTS read_receipts (
    user_id INTEGER,
    room_id TEXT,
    last_read TEXT,
    PRIMARY KEY (user_id, room_id)
  );

  CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    campus TEXT,
    logo_url TEXT
  );
  
  CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS group_members (
    group_id INTEGER,
    user_id INTEGER,
    PRIMARY KEY (group_id, user_id)
  );
  
  CREATE TABLE IF NOT EXISTS freedom_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    alias TEXT,
    content TEXT,
    campus TEXT,
    image_url TEXT,
    likes INTEGER DEFAULT 0,
    reports INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER,
    following_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id)
  );
`);
} catch (err: any) {
  if (err && err.code === "SQLITE_NOTADB") {
    db = new Database(":memory:");
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        campus TEXT,
        avatar TEXT
      );
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER,
        sender_name TEXT,
        content TEXT,
        room_id TEXT,
        media_url TEXT,
        media_type TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS read_receipts (
        user_id INTEGER,
        room_id TEXT,
        last_read TEXT,
        PRIMARY KEY (user_id, room_id)
      );
      CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        campus TEXT,
        logo_url TEXT
      );
      CREATE TABLE IF NOT EXISTS feedbacks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS group_members (
        group_id INTEGER,
        user_id INTEGER,
        PRIMARY KEY (group_id, user_id)
      );
      CREATE TABLE IF NOT EXISTS freedom_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        alias TEXT,
        content TEXT,
        campus TEXT,
        image_url TEXT,
        likes INTEGER DEFAULT 0,
        reports INTEGER DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } else {
    throw err;
  }
}

try { db.exec(`ALTER TABLE messages ADD COLUMN media_url TEXT`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN media_type TEXT`); } catch {}
try { db.exec(`ALTER TABLE groups ADD COLUMN logo_url TEXT`); } catch {}
try { db.exec(`ALTER TABLE freedom_posts ADD COLUMN image_url TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN student_id TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN program TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN year_level TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN department TEXT`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN deleted_by_sender INTEGER DEFAULT 0`); } catch {}
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_room_settings (
      user_id INTEGER,
      room_id TEXT,
      clear_before TEXT,
      PRIMARY KEY (user_id, room_id)
    )
  `);
} catch {}
const groupsCount = db.prepare("SELECT COUNT(*) AS c FROM groups").get() as { c: number };
if (!groupsCount.c) {
  const stmt = db.prepare("INSERT INTO groups (name, description, campus) VALUES (?, ?, ?)");
  stmt.run("MSU Main Debate Society", "Debate and public speaking club", "MSU Main");
  stmt.run("IIT Tech Innovators", "Technology and innovation community", "MSU IIT");
  stmt.run("Gensan Arts Guild", "Visual and performing arts group", "MSU Gensan");
  stmt.run("Naawan Marine Society", "Marine sciences student org", "MSU Naawan");
  stmt.run("Tawi-Tawi Oceanic Research Circle", "Fisheries and oceanography circle", "MSU Tawi-Tawi");
}
async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(express.json());

  // API Routes
  app.get("/api/feedbacks", (req, res) => {
    const items = db.prepare("SELECT * FROM feedbacks ORDER BY timestamp DESC LIMIT 50").all();
    res.json(items);
  });
  app.post("/api/feedbacks", (req, res) => {
    const { userId, content } = req.body;
    if (!userId || !content) return res.status(400).json({ success: false, message: "Missing userId or content" });
    const info = db.prepare("INSERT INTO feedbacks (user_id, content) VALUES (?, ?)").run(userId, content);
    const item = db.prepare("SELECT * FROM feedbacks WHERE id = ?").get(info.lastInsertRowid);
    res.json({ success: true, item });
  });
  app.get("/api/profile/:id", (req, res) => {
    const id = Number(req.params.id);
    const viewerId = Number(req.query.viewerId);
    const user = db.prepare("SELECT id, name, email, campus, avatar, student_id, program, year_level, department, bio, cover_photo FROM users WHERE id = ?").get(id);
    if (!user) return res.status(404).json({ success: false, message: "Not found" });
    
    const followerCount = db.prepare("SELECT COUNT(*) as c FROM follows WHERE following_id = ?").get(id) as { c: number };
    const followingCount = db.prepare("SELECT COUNT(*) as c FROM follows WHERE follower_id = ?").get(id) as { c: number };
    let isFollowing = false;
    if (viewerId) {
      const follow = db.prepare("SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?").get(viewerId, id);
      isFollowing = !!follow;
    }

    res.json({ 
      success: true, 
      user: { 
        ...user, 
        followers: followerCount.c, 
        following: followingCount.c,
        isFollowing
      } 
    });
  });

  app.post("/api/profile/:id/follow", (req, res) => {
    const targetId = Number(req.params.id);
    const { followerId } = req.body;
    if (!followerId || followerId === targetId) return res.status(400).json({ success: false });
    try {
      db.prepare("INSERT INTO follows (follower_id, following_id) VALUES (?, ?)").run(followerId, targetId);
      res.json({ success: true, following: true });
    } catch {
      db.prepare("DELETE FROM follows WHERE follower_id = ? AND following_id = ?").run(followerId, targetId);
      res.json({ success: true, following: false });
    }
  });
  app.put("/api/profile/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, campus, avatar, student_id, program, year_level, department, bio, cover_photo } = req.body;
    const stmt = db.prepare(`
      UPDATE users 
      SET name = COALESCE(?, name),
          campus = COALESCE(?, campus),
          avatar = COALESCE(?, avatar),
          student_id = COALESCE(?, student_id),
          program = COALESCE(?, program),
          year_level = COALESCE(?, year_level),
          department = COALESCE(?, department),
          bio = COALESCE(?, bio),
          cover_photo = COALESCE(?, cover_photo)
      WHERE id = ?
    `);
    const info = stmt.run(name, campus, avatar, student_id, program, year_level, department, bio, cover_photo, id);
    if (info.changes === 0) return res.status(404).json({ success: false, message: "Not found" });
    const user = db.prepare("SELECT id, name, email, campus, avatar, student_id, program, year_level, department, bio, cover_photo FROM users WHERE id = ?").get(id);
    res.json({ success: true, user });
  });
  app.get("/api/groups", (req, res) => {
    const userId = req.query.userId ? Number(req.query.userId) : null;
    const joinedOnly = req.query.joined === "true";
    
    let groups;
    if (joinedOnly && userId) {
      groups = db.prepare(`
        SELECT g.* FROM groups g
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.user_id = ?
        ORDER BY g.name ASC
      `).all(userId);
    } else {
      groups = db.prepare("SELECT * FROM groups ORDER BY name ASC").all();
    }
    res.json(groups);
  });
  app.post("/api/groups/:id/join", (req, res) => {
    const groupId = Number(req.params.id);
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });
    try {
      db.prepare("INSERT INTO group_members (group_id, user_id) VALUES (?, ?)").run(groupId, userId);
      res.json({ success: true });
    } catch (err) {
      res.json({ success: true, message: "Already joined" });
    }
  });
  app.post("/api/groups/:id/leave", (req, res) => {
    const groupId = Number(req.params.id);
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });
    db.prepare("DELETE FROM group_members WHERE group_id = ? AND user_id = ?").run(groupId, userId);
    res.json({ success: true });
  });
  app.get("/api/users/:id/groups", (req, res) => {
    const userId = Number(req.params.id);
    const groups = db.prepare(`
      SELECT g.* FROM groups g
      JOIN group_members gm ON g.id = gm.group_id
      WHERE gm.user_id = ?
    `).all(userId);
    res.json(groups);
  });
  app.post("/api/groups", (req, res) => {
    const { name, description, campus, logoUrl } = req.body;
    if (!name || !campus) return res.status(400).json({ success: false, message: "Missing name or campus" });
    const stmt = db.prepare("INSERT INTO groups (name, description, campus, logo_url) VALUES (?, ?, ?, ?)");
    const info = stmt.run(name, description || "", campus, logoUrl || null);
    const group = db.prepare("SELECT * FROM groups WHERE id = ?").get(info.lastInsertRowid);
    res.json({ success: true, group });
  });
  app.get("/api/freedomwall", (req, res) => {
    const campus = (req.query.campus as string) || null;
    const stmt = campus
      ? db.prepare("SELECT * FROM freedom_posts WHERE campus = ? ORDER BY timestamp DESC LIMIT 50")
      : db.prepare("SELECT * FROM freedom_posts ORDER BY timestamp DESC LIMIT 50");
    const rows = campus ? stmt.all(campus) : stmt.all();
    res.json(rows);
  });
  app.post("/api/freedomwall", (req, res) => {
    const { userId, content, campus, imageUrl } = req.body;
    if (!content || !campus) return res.status(400).json({ success: false, message: "Missing content or campus" });
    
    // Get next sequential number
    const count = db.prepare("SELECT COUNT(*) as c FROM freedom_posts").get() as { c: number };
    const alias = `Anonymous #${count.c + 1}`;
    
    const info = db.prepare("INSERT INTO freedom_posts (user_id, alias, content, campus, image_url) VALUES (?, ?, ?, ?, ?)").run(userId || null, alias, content, campus, imageUrl || null);
    const item = db.prepare("SELECT * FROM freedom_posts WHERE id = ?").get(info.lastInsertRowid);
    res.json({ success: true, item });
  });
  app.post("/api/freedomwall/:id/react", (req, res) => {
    const id = Number(req.params.id);
    const { type } = req.body;
    if (type === "like") {
      db.prepare("UPDATE freedom_posts SET likes = likes + 1 WHERE id = ?").run(id);
    } else if (type === "report") {
      db.prepare("UPDATE freedom_posts SET reports = reports + 1 WHERE id = ?").run(id);
    } else {
      return res.status(400).json({ success: false, message: "Invalid reaction type" });
    }
    const item = db.prepare("SELECT * FROM freedom_posts WHERE id = ?").get(id);
    res.json({ success: true, item });
  });
  app.post("/api/upload", (req, res) => {
    const { dataUrl } = req.body as { dataUrl: string };
    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
      return res.status(400).json({ success: false, message: "Invalid dataUrl" });
    }
    const match = dataUrl.match(/^data:((image|video)\/\w+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ success: false, message: "Only base64 image or video data is supported" });
    }
    const mime = match[1];
    const base64 = match[3];
    const ext = mime.split("/")[1].toLowerCase();
    const uploadsDir = path.join(__dirname, "public", "uploads");
    try {
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const filePath = path.join(uploadsDir, name);
      fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
      const url = `/uploads/${name}`;
      res.json({ success: true, url, mimeType: mime });
    } catch (e) {
      res.status(500).json({ success: false, message: "Failed to save file" });
    }
  });
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.post("/api/auth/signup", (req, res) => {
    const { name, email, password, campus } = req.body;
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ success: false, message: "Only @gmail.com accounts are allowed" });
    }
    try {
      const info = db.prepare("INSERT INTO users (name, email, password, campus) VALUES (?, ?, ?, ?)").run(name, email, password, campus);
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
      res.json({ success: true, user });
    } catch (err) {
      res.status(400).json({ success: false, message: "Email already exists" });
    }
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
      // Return success even if user not found to prevent user enumeration
      return res.json({ success: true, message: "If an account exists, a reset link will be sent." });
    }

    try {
      // Use your Gmail credentials here or from .env
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER || "your-email@gmail.com",
          pass: process.env.EMAIL_PASS || "your-app-password"
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER || "your-email@gmail.com",
        to: email,
        subject: "ONE MSU - Password Reset Request",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #0a0502; color: #ffffff; padding: 40px; border-radius: 24px; border: 1px solid #f59e0b;">
            <h1 style="color: #f59e0b; margin-bottom: 24px;">Password Reset Request</h1>
            <p style="font-size: 16px; line-height: 1.6;">Hello ${user.name},</p>
            <p style="font-size: 16px; line-height: 1.6;">We received a request to reset your password for your ONE MSU account. Click the button below to proceed with the reset:</p>
            <div style="margin: 32px 0;">
              <a href="http://localhost:3000?reset=true&email=${encodeURIComponent(email)}" style="background-color: #f59e0b; color: #000000; padding: 12px 24px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block;">Reset Password</a>
            </div>
            <p style="font-size: 14px; color: #6b7280;">If you did not request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #1f2937; margin: 32px 0;">
            <p style="font-size: 12px; color: #6b7280;">&copy; 2026 ONE MSU System. All rights reserved.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "A reset link has been sent to your Gmail inbox." });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ success: false, message: "Failed to send email. Ensure server credentials are set." });
    }
  });

  app.get("/api/messages/:roomId", (req, res) => {
    const roomId = req.params.roomId;
    const userId = Number(req.query.userId);
    const before = req.query.before as string | undefined;
    const limit = Number(req.query.limit) || 50;
    const pageSize = limit;

    let clearBefore: string | null = null;
    if (userId) {
      const setting = db.prepare("SELECT clear_before FROM user_room_settings WHERE user_id = ? AND room_id = ?").get(userId, roomId) as { clear_before: string } | undefined;
      clearBefore = setting?.clear_before ?? null;
    }

    let rows: any[] = [];
    if (before) {
      let query = `
        SELECT m.*, u.email as sender_email, u.avatar as sender_avatar
        FROM messages m
        LEFT JOIN users u ON m.sender_id = u.id
        WHERE m.room_id = ? AND m.timestamp < ? AND m.deleted_by_sender = 0
      `;
      let params: any[] = [roomId, before];
      if (clearBefore) {
        query += " AND m.timestamp > ?";
        params.push(clearBefore);
      }
      query += " ORDER BY m.timestamp DESC LIMIT ?";
      params.push(pageSize);
      rows = db.prepare(query).all(...params);
    } else {
      let query = `
        SELECT m.*, u.email as sender_email, u.avatar as sender_avatar
        FROM messages m
        LEFT JOIN users u ON m.sender_id = u.id
        WHERE m.room_id = ? AND m.deleted_by_sender = 0
      `;
      let params: any[] = [roomId];
      if (clearBefore) {
        query += " AND m.timestamp > ?";
        params.push(clearBefore);
      }
      query += " ORDER BY m.timestamp DESC LIMIT ?";
      params.push(pageSize);
      rows = db.prepare(query).all(...params);
    }
    // Return ascending order for UI
    res.json(rows.reverse());
  });

  app.post("/api/messages/clear", (req, res) => {
    const { userId, roomId } = req.body;
    if (!userId || !roomId) return res.status(400).json({ success: false });
    const now = new Date().toISOString();
    db.prepare("INSERT INTO user_room_settings (user_id, room_id, clear_before) VALUES (?, ?, ?) ON CONFLICT(user_id, room_id) DO UPDATE SET clear_before = excluded.clear_before").run(userId, roomId, now);
    res.json({ success: true });
  });

  app.delete("/api/messages/:id", (req, res) => {
    const id = Number(req.params.id);
    const { userId } = req.body;
    const msg = db.prepare("SELECT sender_id FROM messages WHERE id = ?").get(id) as { sender_id: number } | undefined;
    if (!msg || msg.sender_id !== userId) return res.status(403).json({ success: false });
    db.prepare("UPDATE messages SET deleted_by_sender = 1 WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.get("/api/receipts/:roomId", (req, res) => {
    const roomId = req.params.roomId;
    const viewer = Number(req.query.viewer);
    if (!roomId || !Number.isFinite(viewer)) {
      return res.status(400).json({ success: false, message: "Missing params" });
    }
    // For DMs, derive the other participant id from roomId pattern dm-a-b
    let otherId: number | null = null;
    if (roomId.startsWith("dm-")) {
      const parts = roomId.split("-");
      if (parts.length === 3) {
        const a = Number(parts[1]);
        const b = Number(parts[2]);
        otherId = a === viewer ? b : a;
      }
    }
    if (otherId == null) {
      return res.json({ success: true, last_read: null });
    }
    const row = db
      .prepare("SELECT last_read FROM read_receipts WHERE user_id = ? AND room_id = ?")
      .get(otherId, roomId) as { last_read: string } | undefined;
    res.json({ success: true, last_read: row?.last_read ?? null });
  });

  app.get("/api/users/search", (req, res) => {
    const query = req.query.q;
    const users = db.prepare("SELECT id, name, email, campus FROM users WHERE name LIKE ? OR email LIKE ? LIMIT 10").all(`%${query}%`, `%${query}%`);
    res.json(users);
  });

  // WebSocket Logic
  const clients = new Map<WebSocket, { userId: number; roomId: string }>();
  const onlineUsers = new Set<number>();
  const voiceRooms = new Map<string, Set<WebSocket>>(); // roomId -> Set<ws>

  wss.on("connection", (ws) => {
    ws.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === "join") {
        clients.set(ws, { userId: message.userId, roomId: message.roomId });
        onlineUsers.add(message.userId);
        // Broadcast online status
        wss.clients.forEach(c => {
          if (c.readyState === WebSocket.OPEN) {
            c.send(JSON.stringify({ type: 'presence', onlineUsers: Array.from(onlineUsers) }));
          }
        });
      } else if (message.type === "join-voice") {
        // User joining a voice channel
        const { roomId, userId } = message;
        if (!voiceRooms.has(roomId)) {
          voiceRooms.set(roomId, new Set());
        }
        const room = voiceRooms.get(roomId)!;
        room.add(ws);

        // Notify others in the voice room
        room.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'user-joined-voice', userId }));
          }
        });
        
        // Send list of existing users to the new joiner
        const existingUsers = Array.from(room)
          .filter(client => client !== ws)
          .map(client => clients.get(client)?.userId)
          .filter(id => id !== undefined);
          
        ws.send(JSON.stringify({ type: 'voice-existing-users', users: existingUsers }));

      } else if (message.type === "leave-voice") {
        const { roomId, userId } = message;
        if (voiceRooms.has(roomId)) {
          const room = voiceRooms.get(roomId)!;
          room.delete(ws);
          if (room.size === 0) {
            voiceRooms.delete(roomId);
          } else {
            // Notify others
            room.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'user-left-voice', userId }));
              }
            });
          }
        }
      } else if (message.type === "voice-signal") {
        // WebRTC signaling: offer, answer, candidate
        const { targetId, payload } = message;
        // Find target socket
        let targetWs: WebSocket | undefined;
        for (const [client, data] of clients.entries()) {
          if (data.userId === targetId) {
            targetWs = client;
            break;
          }
        }
        
        if (targetWs && targetWs.readyState === WebSocket.OPEN) {
          const senderId = clients.get(ws)?.userId;
          targetWs.send(JSON.stringify({ 
            type: 'voice-signal', 
            senderId, 
            payload 
          }));
        }
      } else if (message.type === "chat") {
        const { senderId, senderName, content, roomId, mediaUrl, mediaType, clientId } = message;
        const timestamp = new Date().toISOString();
        
        // Save to DB
        db.prepare("INSERT INTO messages (sender_id, sender_name, content, room_id, media_url, media_type, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)").run(senderId, senderName, content, roomId, mediaUrl || null, mediaType || null, timestamp);

        // Get sender email for verified badge
        const sender = db.prepare("SELECT email FROM users WHERE id = ?").get(senderId) as { email: string } | undefined;

        // Broadcast to room
        const payload = JSON.stringify({
          type: 'chat',
          clientId, // Echo back clientId for deduplication
          senderId,
          senderName,
          senderEmail: sender?.email,
          content,
          roomId,
          mediaUrl,
          mediaType,
          timestamp
        });

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const clientData = clients.get(client);
            if (clientData && clientData.roomId === roomId) {
              client.send(payload);
            }
          }
        });
      } else if (message.type === "seen") {
        const { userId, roomId, lastRead } = message as { userId: number; roomId: string; lastRead: string };
        try {
          db.prepare("INSERT INTO read_receipts (user_id, room_id, last_read) VALUES (?, ?, ?) ON CONFLICT(user_id, room_id) DO UPDATE SET last_read = excluded.last_read").run(userId, roomId, lastRead);
        } catch {
          // Fallback if ON CONFLICT not available (SQLite should support it)
          const exists = db.prepare("SELECT 1 FROM read_receipts WHERE user_id = ? AND room_id = ?").get(userId, roomId);
          if (exists) {
            db.prepare("UPDATE read_receipts SET last_read = ? WHERE user_id = ? AND room_id = ?").run(lastRead, userId, roomId);
          } else {
            db.prepare("INSERT INTO read_receipts (user_id, room_id, last_read) VALUES (?, ?, ?)").run(userId, roomId, lastRead);
          }
        }
      } else if (message.type === 'typing') {
        const { senderId, senderName, roomId, isTyping } = message;
        // Broadcast typing status to everyone else in the room
        const payload = JSON.stringify({
          type: 'typing',
          senderId,
          senderName,
          roomId,
          isTyping
        });
        wss.clients.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        });
      }
    });

    ws.on("close", () => {
      const data = clients.get(ws);
      if (data) {
        clients.delete(ws);
        // Only remove if no other tabs are open
        const stillConnected = Array.from(clients.values()).some(v => v.userId === data.userId);
        if (!stillConnected) {
          onlineUsers.delete(data.userId);
          wss.clients.forEach(c => {
            if (c.readyState === WebSocket.OPEN) {
              c.send(JSON.stringify({ type: 'presence', onlineUsers: Array.from(onlineUsers) }));
            }
          });
        }
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { port: 24680 } },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3006;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
