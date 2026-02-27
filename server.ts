import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = new Database("onemsu.db");

try {
  db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    campus TEXT,
    avatar TEXT,
    student_id TEXT,
    program TEXT,
    year_level TEXT,
    department TEXT,
    bio TEXT,
    cover_photo TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    sender_name TEXT,
    content TEXT,
    room_id TEXT,
    media_url TEXT,
    media_type TEXT,
    deleted_for_all INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS deleted_messages (
    message_id INTEGER,
    user_id INTEGER,
    PRIMARY KEY (message_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS presence (
    user_id INTEGER PRIMARY KEY,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
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
} catch (err: any) {
  if (err && err.code === "SQLITE_NOTADB") {
    db = new Database(":memory:");
  } else {
    throw err;
  }
}

// Safe ALTERs
for (const sql of [
  `ALTER TABLE messages ADD COLUMN media_url TEXT`,
  `ALTER TABLE messages ADD COLUMN media_type TEXT`,
  `ALTER TABLE messages ADD COLUMN deleted_for_all INTEGER DEFAULT 0`,
  `ALTER TABLE groups ADD COLUMN logo_url TEXT`,
  `ALTER TABLE freedom_posts ADD COLUMN image_url TEXT`,
  `ALTER TABLE users ADD COLUMN student_id TEXT`,
  `ALTER TABLE users ADD COLUMN program TEXT`,
  `ALTER TABLE users ADD COLUMN year_level TEXT`,
  `ALTER TABLE users ADD COLUMN department TEXT`,
  `ALTER TABLE users ADD COLUMN bio TEXT`,
  `ALTER TABLE users ADD COLUMN cover_photo TEXT`,
]) {
  try {
    db.exec(sql);
  } catch {}
}

const groupsCount = db.prepare("SELECT COUNT(*) AS c FROM groups").get() as { c: number };
if (!groupsCount.c) {
  const stmt = db.prepare("INSERT INTO groups (name, description, campus) VALUES (?, ?, ?)");
  stmt.run("Debate Society", "Debate and public speaking club", "MSU Main");
  stmt.run("Tech Innovators", "Technology and innovation community", "MSU IIT");
  stmt.run("Arts Guild", "Visual and performing arts group", "MSU Gensan");
  stmt.run("Marine Society", "Marine sciences student org", "MSU Naawan");
  stmt.run("Oceanic Research Circle", "Fisheries and oceanography circle", "MSU Tawi-Tawi");
}

/** ✅ Always use dm-min-max format */
function dmRoomId(a: number, b: number) {
  const x = Math.min(a, b);
  const y = Math.max(a, b);
  return `dm-${x}-${y}`;
}

function isDmRoom(roomId: string) {
  return /^dm-\d+-\d+$/.test(roomId);
}

function dmOtherUser(roomId: string, viewerId: number): number | null {
  if (!isDmRoom(roomId)) return null;
  const [, aStr, bStr] = roomId.split("-");
  const a = Number(aStr);
  const b = Number(bStr);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return a === viewerId ? b : b === viewerId ? a : null;
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(express.json());

  // ----------------------------
  // API Routes (unchanged ones can stay as-is)
  // ----------------------------

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
    const user = db
      .prepare(
        "SELECT id, name, email, campus, avatar, student_id, program, year_level, department, bio, cover_photo FROM users WHERE id = ?"
      )
      .get(id);
    if (!user) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, user });
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

    const user = db
      .prepare(
        "SELECT id, name, email, campus, avatar, student_id, program, year_level, department, bio, cover_photo FROM users WHERE id = ?"
      )
      .get(id);

    res.json({ success: true, user });
  });

  // ----------------------------
  // ✅ Messages: list + delete + clear
  // ----------------------------

  app.get("/api/messages/:roomId", (req, res) => {
    const roomId = req.params.roomId;
    const userId = Number(req.query.userId);
    const before = req.query.before as string | undefined;
    const pageSize = 50;

    const queryBase = `
      SELECT m.* FROM messages m
      LEFT JOIN deleted_messages dm ON m.id = dm.message_id AND dm.user_id = ?
      WHERE m.room_id = ?
        AND m.deleted_for_all = 0
        AND dm.message_id IS NULL
    `;

    let rows: any[] = [];
    if (before) {
      rows = db
        .prepare(`${queryBase} AND m.timestamp < ? ORDER BY m.timestamp DESC LIMIT ?`)
        .all(userId, roomId, before, pageSize);
    } else {
      rows = db.prepare(`${queryBase} ORDER BY m.timestamp DESC LIMIT ?`).all(userId, roomId, pageSize);
    }

    res.json(rows.reverse());
  });

  app.delete("/api/messages/:id", (req, res) => {
    const id = Number(req.params.id);
    const { userId, forEveryone } = req.body;

    const msg = db.prepare("SELECT sender_id FROM messages WHERE id = ?").get(id) as { sender_id: number } | undefined;
    if (!msg) return res.status(404).json({ success: false });

    if (forEveryone && msg.sender_id === userId) {
      db.prepare("UPDATE messages SET deleted_for_all = 1 WHERE id = ?").run(id);
    } else {
      db.prepare("INSERT OR IGNORE INTO deleted_messages (message_id, user_id) VALUES (?, ?)").run(id, userId);
    }
    res.json({ success: true });
  });

  app.post("/api/messages/clear", (req, res) => {
    const { userId, roomId } = req.body;
    db.prepare(`
      INSERT OR IGNORE INTO deleted_messages (message_id, user_id)
      SELECT id, ? FROM messages WHERE room_id = ?
    `).run(userId, roomId);
    res.json({ success: true });
  });

  // ----------------------------
  // ✅ FIXED: Recent DMs (this was the biggest mess)
  // Returns partner + last message
  // ----------------------------
  app.get("/api/messenger/recent-dms", (req, res) => {
    const userId = Number(req.query.userId);
    if (!Number.isFinite(userId)) return res.status(400).json({ success: false, message: "Missing userId" });

    // 1) For every DM room involving user, find last message id per room
    // 2) Convert room -> partnerId
    // 3) Join partner user + last message
    const rows = db
      .prepare(
        `
      WITH dm_rooms AS (
        SELECT
          room_id,
          MAX(id) AS last_msg_id
        FROM messages
        WHERE room_id LIKE 'dm-%'
          AND deleted_for_all = 0
          AND (room_id LIKE 'dm-' || ? || '-%' OR room_id LIKE 'dm-%-' || ?)
        GROUP BY room_id
      )
      SELECT
        u.id AS partner_id,
        u.name AS partner_name,
        u.avatar AS partner_avatar,
        u.campus AS partner_campus,
        m.id AS message_id,
        m.sender_id,
        m.sender_name,
        m.content,
        m.media_url,
        m.media_type,
        m.room_id,
        m.timestamp
      FROM dm_rooms r
      JOIN messages m ON m.id = r.last_msg_id
      JOIN users u ON u.id = (
        CASE
          WHEN CAST(SUBSTR(r.room_id, 4, INSTR(SUBSTR(r.room_id, 4), '-') - 1) AS INTEGER) = ?
            THEN CAST(SUBSTR(r.room_id, 4 + INSTR(SUBSTR(r.room_id, 4), '-')) AS INTEGER)
          ELSE CAST(SUBSTR(r.room_id, 4, INSTR(SUBSTR(r.room_id, 4), '-') - 1) AS INTEGER)
        END
      )
      ORDER BY m.timestamp DESC
      LIMIT 20
    `
      )
      .all(userId, userId, userId);

    res.json(rows);
  });

  // ----------------------------
  // Presence + Receipts
  // ----------------------------

  app.get("/api/presence", (req, res) => {
    const threshold = new Date(Date.now() - 60_000).toISOString(); // 1 min
    const activeUsers = db.prepare("SELECT user_id FROM presence WHERE last_seen > ?").all(threshold);
    res.json(activeUsers.map((u: any) => u.user_id));
  });

  app.get("/api/receipts/:roomId", (req, res) => {
    const roomId = req.params.roomId;
    const viewer = Number(req.query.viewer);
    if (!roomId || !Number.isFinite(viewer)) {
      return res.status(400).json({ success: false, message: "Missing params" });
    }

    const otherId = dmOtherUser(roomId, viewer);
    if (otherId == null) return res.json({ success: true, last_read: null });

    const row = db
      .prepare("SELECT last_read FROM read_receipts WHERE user_id = ? AND room_id = ?")
      .get(otherId, roomId) as { last_read: string } | undefined;

    res.json({ success: true, last_read: row?.last_read ?? null });
  });

  app.get("/api/users/search", (req, res) => {
    const query = String(req.query.q || "");
    const users = db
      .prepare("SELECT id, name, email, campus FROM users WHERE name LIKE ? OR email LIKE ? LIMIT 10")
      .all(`%${query}%`, `%${query}%`);
    res.json(users);
  });

  // ----------------------------
  // Upload
  // ----------------------------

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
    } catch {
      res.status(500).json({ success: false, message: "Failed to save file" });
    }
  });

  // ----------------------------
  // Auth
  // ----------------------------

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) res.json({ success: true, user });
    else res.status(401).json({ success: false, message: "Invalid credentials" });
  });

  app.post("/api/auth/signup", (req, res) => {
    const { name, email, password, campus, student_id, program, year_level } = req.body;
    try {
      const info = db
        .prepare("INSERT INTO users (name, email, password, campus, student_id, program, year_level) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .run(name, email, password, campus, student_id, program, year_level);
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
      res.json({ success: true, user });
    } catch {
      res.status(400).json({ success: false, message: "Email already exists" });
    }
  });

  // ----------------------------
  // ✅ WebSocket Logic (fixed)
  // ----------------------------

  type ClientInfo = { userId: number; rooms: Set<string> };
  const clients = new Map<WebSocket, ClientInfo>();

  const sendToRoom = (roomId: string, payload: any) => {
    const data = JSON.stringify(payload);
    wss.clients.forEach((client) => {
      if (client.readyState !== WebSocket.OPEN) return;
      const info = clients.get(client);
      if (!info) return;
      if (info.rooms.has(roomId)) client.send(data);
    });
  };

  const broadcastToAll = (payload: any) => {
    const data = JSON.stringify(payload);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(data);
    });
  };

  wss.on("connection", (ws) => {
    clients.set(ws, { userId: -1, rooms: new Set() });

    ws.on("message", (raw) => {
      let message: any;
      try {
        message = JSON.parse(raw.toString());
      } catch {
        return;
      }

      // ✅ join can be called multiple times
      if (message.type === "join") {
        const userId = Number(message.userId);
        let roomId = String(message.roomId || "");

        if (!Number.isFinite(userId) || !roomId) return;

        // Normalize DM roomId if they send dm with partnerId
        // Supports: {type:'join', userId, partnerId}
        if (!roomId && Number.isFinite(Number(message.partnerId))) {
          roomId = dmRoomId(userId, Number(message.partnerId));
        }

        const info = clients.get(ws)!;
        info.userId = userId;
        info.rooms.add(roomId);

        db.prepare("INSERT OR REPLACE INTO presence (user_id, last_seen) VALUES (?, CURRENT_TIMESTAMP)").run(userId);
        broadcastToAll({ type: "presence_update", userId, status: "online" });
        return;
      }

      if (message.type === "presence_ping") {
        const userId = Number(message.userId);
        if (!Number.isFinite(userId)) return;
        db.prepare("INSERT OR REPLACE INTO presence (user_id, last_seen) VALUES (?, CURRENT_TIMESTAMP)").run(userId);
        return;
      }

      if (message.type === "chat") {
        const senderId = Number(message.senderId);
        const senderName = String(message.senderName || "");
        const content = String(message.content || "");
        let roomId = String(message.roomId || "");
        const mediaUrl = message.mediaUrl ? String(message.mediaUrl) : null;
        const mediaType = message.mediaType ? String(message.mediaType) : null;

        if (!Number.isFinite(senderId) || !roomId) return;
        if (!content && !mediaUrl) return; // prevent empty messages

        // ✅ Normalize DM rooms
        if (isDmRoom(roomId)) {
          const other = dmOtherUser(roomId, senderId);
          if (other == null) return; // sender not part of this dm
          roomId = dmRoomId(senderId, other);
        }

        const result = db
          .prepare(
            "INSERT INTO messages (sender_id, sender_name, content, room_id, media_url, media_type) VALUES (?, ?, ?, ?, ?, ?)"
          )
          .run(senderId, senderName, content, roomId, mediaUrl, mediaType);

        const msgId = result.lastInsertRowid as number;

        db.prepare("INSERT OR REPLACE INTO presence (user_id, last_seen) VALUES (?, CURRENT_TIMESTAMP)").run(senderId);

        sendToRoom(roomId, {
          type: "chat",
          id: msgId,
          senderId,
          senderName,
          content,
          roomId,
          mediaUrl,
          mediaType,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (message.type === "seen") {
        const userId = Number(message.userId);
        const roomId = String(message.roomId || "");
        const lastRead = String(message.lastRead || "");
        if (!Number.isFinite(userId) || !roomId || !lastRead) return;

        // ✅ Correct UPSERT + correct fallback
        try {
          db.prepare(
            `INSERT INTO read_receipts (user_id, room_id, last_read)
             VALUES (?, ?, ?)
             ON CONFLICT(user_id, room_id)
             DO UPDATE SET last_read = excluded.last_read`
          ).run(userId, roomId, lastRead);
        } catch {
          const exists = db.prepare("SELECT 1 FROM read_receipts WHERE user_id = ? AND room_id = ?").get(userId, roomId);
          if (exists) {
            db.prepare("UPDATE read_receipts SET last_read = ? WHERE user_id = ? AND room_id = ?").run(lastRead, userId, roomId);
          } else {
            // ✅ FIXED placeholders (was wrong in your code)
            db.prepare("INSERT INTO read_receipts (user_id, room_id, last_read) VALUES (?, ?, ?)").run(userId, roomId, lastRead);
          }
        }

        // ✅ Broadcast so other side updates “Seen”
        sendToRoom(roomId, { type: "seen_update", userId, roomId, lastRead });
        return;
      }

      if (message.type === "delete_message") {
        const messageId = Number(message.messageId);
        const userId = Number(message.userId);
        const forEveryone = Boolean(message.forEveryone);
        const roomId = String(message.roomId || "");
        if (!Number.isFinite(messageId) || !Number.isFinite(userId) || !roomId) return;

        // ✅ Write deletion to DB (your WS version didn’t)
        const msg = db.prepare("SELECT sender_id FROM messages WHERE id = ?").get(messageId) as
          | { sender_id: number }
          | undefined;

        if (!msg) return;

        if (forEveryone && msg.sender_id === userId) {
          db.prepare("UPDATE messages SET deleted_for_all = 1 WHERE id = ?").run(messageId);
        } else {
          db.prepare("INSERT OR IGNORE INTO deleted_messages (message_id, user_id) VALUES (?, ?)").run(messageId, userId);
        }

        sendToRoom(roomId, { type: "message_deleted", messageId, userId, forEveryone, roomId });
        return;
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
    });
  });

  // ----------------------------
  // Vite middleware / static
  // ----------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();