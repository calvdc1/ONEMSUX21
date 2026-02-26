import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

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

try { db.exec(`ALTER TABLE groups ADD COLUMN logo_url TEXT`); } catch {}
try { db.exec(`ALTER TABLE freedom_posts ADD COLUMN image_url TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN student_id TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN program TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN year_level TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN department TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN bio TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN cover_photo TEXT`); } catch {}
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
    const user = db.prepare("SELECT id, name, email, campus, avatar, student_id, program, year_level, department, bio, cover_photo FROM users WHERE id = ?").get(id);
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
    if (name) {
      db.prepare("UPDATE messages SET sender_name = ? WHERE sender_id = ?").run(name, id);
    }
    const user = db.prepare("SELECT id, name, email, campus, avatar, student_id, program, year_level, department, bio, cover_photo FROM users WHERE id = ?").get(id);
    res.json({ success: true, user });
  });
  app.get("/api/groups", (req, res) => {
    const groups = db.prepare("SELECT * FROM groups ORDER BY name ASC").all();
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
    const alias = `Anon-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
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
    const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ success: false, message: "Only base64 image data is supported" });
    }
    const mime = match[1];
    const base64 = match[2];
    const ext = mime.split("/")[1].toLowerCase();
    const uploadsDir = path.join(__dirname, "public", "uploads");
    try {
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const filePath = path.join(uploadsDir, name);
      fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
      const url = `/uploads/${name}`;
      res.json({ success: true, url });
    } catch (e) {
      res.status(500).json({ success: false, message: "Failed to save image" });
    }
  });
  app.post("/api/assistant/chat", async (req, res) => {
    const { message, campus, userName } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, message: "Missing message" });
    }

    if (!genAI) {
      return res.json({
        success: true,
        reply: `Hi ${userName || "MSU student"}! I can help with campus info, enrollment, programs, and ONEMSU navigation. Add GEMINI_API_KEY to enable full AI responses.`
      });
    }

    try {
      const systemPrompt = `You are JARVIS AI for ONEMSU. Keep answers concise, practical, and student-friendly. If asked outside MSU context, still help politely. Campus context: ${campus || "MSU"}.`;
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `${systemPrompt}

User (${userName || "Student"}): ${message}`
      });
      const reply = response.text || "I can help with ONEMSU questions, campus details, and student services.";
      res.json({ success: true, reply });
    } catch (error) {
      console.error("assistant chat error", error);
      res.status(500).json({ success: false, message: "Assistant unavailable right now." });
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
    const { name, email, password, student_id, program, year_level, campus } = req.body || {};
    if (!name || !email || !password || !student_id || !program || !year_level) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields." });
    }
    try {
      const info = db
        .prepare("INSERT INTO users (name, email, password, campus, student_id, program, year_level) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .run(name, email, password, campus || 'MSU Main', student_id, program, year_level);
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
      res.json({ success: true, user });
    } catch (err) {
      res.status(400).json({ success: false, message: "Email already exists" });
    }
  });

  app.get("/api/messages/:roomId", (req, res) => {
    const roomId = req.params.roomId;
    const before = req.query.before as string | undefined;
    const pageSize = 50;
    let rows: any[] = [];
    if (before) {
      rows = db
        .prepare(
          "SELECT * FROM messages WHERE room_id = ? AND timestamp < ? ORDER BY timestamp DESC LIMIT ?"
        )
        .all(roomId, before, pageSize);
    } else {
      rows = db
        .prepare(
          "SELECT * FROM messages WHERE room_id = ? ORDER BY timestamp DESC LIMIT ?"
        )
        .all(roomId, pageSize);
    }
    // Return ascending order for UI
    res.json(rows.reverse());
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

  wss.on("connection", (ws) => {
    ws.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === "join") {
        clients.set(ws, { userId: message.userId, roomId: message.roomId });
      } else if (message.type === "chat") {
        const { senderId, senderName, content, roomId } = message;
        
        // Save to DB
        db.prepare("INSERT INTO messages (sender_id, sender_name, content, room_id) VALUES (?, ?, ?, ?)").run(senderId, senderName, content, roomId);

        // Broadcast to room
        const payload = JSON.stringify({
          type: "chat",
          senderId,
          senderName,
          content,
          roomId,
          timestamp: new Date().toISOString()
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
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
    });
  });

  // Vite middleware for development
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
