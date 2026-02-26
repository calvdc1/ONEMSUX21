import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import bcrypt from "bcrypt";

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
    avatar TEXT,
    is_verified INTEGER DEFAULT 0,
    is_admin INTEGER DEFAULT 0
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
  
  CREATE TABLE IF NOT EXISTS email_verifications (
    email TEXT PRIMARY KEY,
    code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
  
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
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
        avatar TEXT,
        is_verified INTEGER DEFAULT 0,
        is_admin INTEGER DEFAULT 0
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
      CREATE TABLE IF NOT EXISTS email_verifications (
        email TEXT PRIMARY KEY,
        code TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
  CREATE TABLE IF NOT EXISTS lost_found (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    campus TEXT,
    contact TEXT,
    image_url TEXT,
    found INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
      CREATE TABLE IF NOT EXISTS lost_found (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        campus TEXT,
        contact TEXT,
        image_url TEXT,
        found INTEGER DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
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
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
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
try { db.exec(`ALTER TABLE users ADD COLUMN bio TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN cover_photo TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0`); } catch {}
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
  console.log("Starting server initialization...");
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(express.json());
  app.get("/api/test", (req, res) => {
    console.log("Test route hit");
    res.send("API is alive");
  });

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
    const user = db.prepare("SELECT id, name, email, campus, avatar, student_id, program, year_level, department, bio, cover_photo, is_verified, is_admin FROM users WHERE id = ?").get(id);
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
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });
    
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.json({ success: true, user });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    const { name, email, password, campus, code } = req.body;
    if (!name || !email || !password || !campus) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Check settings to see if code is required
    let requireCode = false;
    try {
      const s = db.prepare("SELECT value FROM settings WHERE key = 'requireSignupCode'").get() as { value: string } | undefined;
      if (s) {
        const v = JSON.parse(s.value);
        requireCode = !!v;
      }
    } catch {}
    if (requireCode) {
      const row = db.prepare("SELECT code, created_at FROM email_verifications WHERE email = ?").get(email) as { code: string; created_at: string } | undefined;
      if (!row || row.code !== code) {
        return res.status(400).json({ success: false, message: "Invalid or missing verification code" });
      }
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const info = db.prepare("INSERT INTO users (name, email, password, campus, is_verified, is_admin) VALUES (?, ?, ?, ?, 0, 0)").run(name, email, hashedPassword, campus);
      if (requireCode) db.prepare("DELETE FROM email_verifications WHERE email = ?").run(email);
      const user = db.prepare("SELECT id, name, email, campus, avatar, is_verified, is_admin FROM users WHERE id = ?").get(info.lastInsertRowid);
      res.json({ success: true, user });
    } catch (err) {
      res.status(400).json({ success: false, message: "Email already exists" });
    }
  });
  app.post("/api/auth/request-code", (req, res) => {
    const { email } = req.body as { email: string };
    if (!email) {
      return res.status(400).json({ success: false, message: "Valid email required" });
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    db.prepare("INSERT INTO email_verifications (email, code, created_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(email) DO UPDATE SET code=excluded.code, created_at=CURRENT_TIMESTAMP").run(email, code);
    const dev = process.env.NODE_ENV !== "production";
    res.json({ success: true, sent: true, devCode: dev ? code : undefined });
  });
  app.get("/api/auth/check-email", (req, res) => {
    const email = String(req.query.email || "").trim().toLowerCase();
    if (!email) return res.json({ exists: false });
    const row = db.prepare("SELECT 1 FROM users WHERE lower(email) = ?").get(email);
    res.json({ exists: !!row });
  });
  
  app.get("/api/lostfound", (_req, res) => {
    const items = db.prepare("SELECT * FROM lost_found ORDER BY datetime(timestamp) DESC").all();
    res.json(items);
  });
  app.post("/api/lostfound", (req, res) => {
    const { title, description, campus, contact, imageUrl } = req.body as { title: string; description: string; campus?: string; contact?: string; imageUrl?: string };
    if (!title || !description) return res.status(400).json({ success: false, message: "Title and description required" });
    const info = db.prepare("INSERT INTO lost_found (title, description, campus, contact, image_url) VALUES (?, ?, ?, ?, ?)").run(title, description, campus || '', contact || '', imageUrl || null);
    const item = db.prepare("SELECT * FROM lost_found WHERE id = ?").get(info.lastInsertRowid);
    res.json({ success: true, item });
  });
  app.patch("/api/lostfound/:id", (req, res) => {
    const id = Number(req.params.id);
    const { found } = req.body as { found: boolean };
    db.prepare("UPDATE lost_found SET found = ? WHERE id = ?").run(found ? 1 : 0, id);
    const item = db.prepare("SELECT * FROM lost_found WHERE id = ?").get(id);
    res.json({ success: true, item });
  });

  app.get("/api/messages/:roomId", (req, res) => {
    const roomId = req.params.roomId;
    const userId = Number(req.query.userId);
    const before = req.query.before as string | undefined;
    const pageSize = 50;
    
    let rows: any[] = [];
    const queryBase = `
      SELECT m.* FROM messages m
      LEFT JOIN deleted_messages dm ON m.id = dm.message_id AND dm.user_id = ?
      WHERE m.room_id = ? AND m.deleted_for_all = 0 AND dm.message_id IS NULL
    `;

    if (before) {
      rows = db.prepare(`${queryBase} AND m.timestamp < ? ORDER BY m.timestamp DESC LIMIT ?`).all(userId, roomId, before, pageSize);
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

  app.get("/api/messenger/recent-dms", (req, res) => {
    const userId = Number(req.query.userId);
    const rows = db.prepare(`
      SELECT DISTINCT 
        CASE WHEN sender_id = ? THEN room_id ELSE room_id END as room,
        CASE WHEN sender_id = ? THEN room_id ELSE room_id END as partner_id
      FROM messages 
      WHERE room_id LIKE 'dm-%' AND (sender_id = ? OR room_id LIKE '%-' || ? OR room_id LIKE 'dm-' || ? || '-%')
      ORDER BY timestamp DESC LIMIT 20
    `).all(userId, userId, userId, userId, userId);
    
    // Better query to get unique partners
    const partners = db.prepare(`
      SELECT DISTINCT u.id, u.name, u.avatar, u.campus
      FROM users u
      JOIN messages m ON (
        (m.room_id LIKE 'dm-' || ? || '-%' AND u.id = CAST(SUBSTR(m.room_id, INSTR(m.room_id, '-') + INSTR(SUBSTR(m.room_id, INSTR(m.room_id, '-') + 1), '-') + 1) AS INTEGER))
        OR 
        (m.room_id LIKE 'dm-%-' || ? AND u.id = CAST(SUBSTR(m.room_id, INSTR(m.room_id, '-') + 1, INSTR(SUBSTR(m.room_id, INSTR(m.room_id, '-') + 1), '-') - 1) AS INTEGER))
      )
      WHERE u.id != ?
    `).all(userId, userId, userId);

    res.json(partners);
  });

  app.get("/api/presence", (req, res) => {
    const threshold = new Date(Date.now() - 60000).toISOString(); // 1 minute
    const activeUsers = db.prepare("SELECT user_id FROM presence WHERE last_seen > ?").all(threshold);
    res.json(activeUsers.map((u: any) => u.user_id));
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
    const users = db.prepare("SELECT id, name, email, campus, is_verified, is_admin FROM users WHERE name LIKE ? OR email LIKE ? LIMIT 10").all(`%${query}%`, `%${query}%`);
    res.json(users);
  });

  app.put("/api/users/:id/roles", (req, res) => {
    const id = Number(req.params.id);
    const { email, is_verified, is_admin } = req.body as { email: string; is_verified?: boolean; is_admin?: boolean };
    if (!email || email !== "xandercamarin@gmail.com") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const row = db.prepare("SELECT id FROM users WHERE id = ?").get(id);
    if (!row) return res.status(404).json({ success: false, message: "User not found" });
    db.prepare("UPDATE users SET is_verified = COALESCE(?, is_verified), is_admin = COALESCE(?, is_admin) WHERE id = ?")
      .run(is_verified != null ? (is_verified ? 1 : 0) : null, is_admin != null ? (is_admin ? 1 : 0) : null, id);
    const user = db.prepare("SELECT id, name, email, campus, avatar, is_verified, is_admin FROM users WHERE id = ?").get(id);
    res.json({ success: true, user });
  });
  app.get("/api/settings", (_req, res) => {
    try {
      const rows = db.prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
      const obj: Record<string, any> = {};
      for (const r of rows) {
        try {
          obj[r.key] = JSON.parse(r.value);
        } catch {
          obj[r.key] = r.value;
        }
      }
      res.json({ success: true, settings: obj });
    } catch (e) {
      res.status(500).json({ success: false, message: "Failed to load settings" });
    }
  });

  app.put("/api/settings", (req, res) => {
    const { userId, email, updates } = req.body as { userId: number; email: string; updates: Record<string, any> };
    if (!email || email !== "xandercamarin@gmail.com") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ success: false, message: "Invalid updates" });
    }
    const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value");
    const tx = db.transaction((obj: Record<string, any>) => {
      for (const [k, v] of Object.entries(obj)) {
        stmt.run(k, JSON.stringify(v));
      }
    });
    try {
      tx(updates);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, message: "Failed to save settings" });
    }
  });

  // WebSocket Logic
  const clients = new Map<WebSocket, { userId: number; roomId: string }>();
  const userSockets = new Map<number, WebSocket>();
  const voiceRooms = new Map<string, Set<number>>();

  const broadcastToAll = (payload: any) => {
    const data = JSON.stringify(payload);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

  wss.on("connection", (ws) => {
    ws.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === "join") {
        clients.set(ws, { userId: message.userId, roomId: message.roomId });
        userSockets.set(message.userId, ws);
        // Mark as online
        db.prepare("INSERT OR REPLACE INTO presence (user_id, last_seen) VALUES (?, CURRENT_TIMESTAMP)").run(message.userId);
        broadcastToAll({ type: 'presence_update', userId: message.userId, status: 'online' });
      } else if (message.type === "chat") {
        const { senderId, senderName, content, roomId, mediaUrl, mediaType, clientId } = message;
        
        // Save to DB
        const result = db.prepare("INSERT INTO messages (sender_id, sender_name, content, room_id, media_url, media_type) VALUES (?, ?, ?, ?, ?, ?)").run(senderId, senderName, content, roomId, mediaUrl || null, mediaType || null);
        const msgId = result.lastInsertRowid;

        // Update presence
        db.prepare("INSERT OR REPLACE INTO presence (user_id, last_seen) VALUES (?, CURRENT_TIMESTAMP)").run(senderId);

        // Broadcast to room
        const payload = JSON.stringify({
          type: "chat",
          id: msgId,
          senderId,
          senderName,
          content,
          roomId,
          mediaUrl,
          mediaType,
          clientId: clientId || null,
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
      } else if (message.type === "typing") {
        const { roomId } = message;
        const payload = JSON.stringify({
          type: "typing",
          roomId: message.roomId,
          senderId: message.senderId,
          senderName: message.senderName,
          isTyping: !!message.isTyping
        });
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const clientData = clients.get(client);
            if (clientData && clientData.roomId === roomId) {
              client.send(payload);
            }
          }
        });
      } else if (message.type === "join-voice") {
        const roomId = String(message.roomId);
        const userId = Number(message.userId);
        const set = voiceRooms.get(roomId) ?? new Set<number>();
        const existing = Array.from(set).filter((id) => id !== userId);
        set.add(userId);
        voiceRooms.set(roomId, set);
        const socket = userSockets.get(userId);
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "voice-existing-users", users: existing }));
        }
        set.forEach((uid) => {
          if (uid !== userId) {
            const s = userSockets.get(uid);
            if (s && s.readyState === WebSocket.OPEN) {
              s.send(JSON.stringify({ type: "user-joined-voice", userId }));
            }
          }
        });
      } else if (message.type === "leave-voice") {
        const roomId = String(message.roomId);
        const userId = Number(message.userId);
        const set = voiceRooms.get(roomId);
        if (set) {
          set.delete(userId);
          voiceRooms.set(roomId, set);
          set.forEach((uid) => {
            const s = userSockets.get(uid);
            if (s && s.readyState === WebSocket.OPEN) {
              s.send(JSON.stringify({ type: "user-left-voice", userId }));
            }
          });
        }
      } else if (message.type === "voice-signal") {
        const targetId = Number(message.targetId);
        const senderId = Number(message.senderId);
        const s = userSockets.get(targetId);
        if (s && s.readyState === WebSocket.OPEN) {
          s.send(JSON.stringify({ type: "voice-signal", senderId, payload: message.payload }));
        }
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
            db.prepare("INSERT INTO read_receipts (user_id, room_id, last_read) VALUES (?, ?)").run(lastRead, userId, roomId);
          }
        }
      } else if (message.type === "delete_message") {
        const { messageId, userId, forEveryone, roomId } = message;
        // Broadcast deletion to room
        const payload = JSON.stringify({ type: 'message_deleted', messageId, userId, forEveryone, roomId });
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const clientData = clients.get(client);
            if (clientData && clientData.roomId === roomId) {
              client.send(payload);
            }
          }
        });
      } else if (message.type === "presence_ping") {
        const { userId } = message;
        db.prepare("INSERT OR REPLACE INTO presence (user_id, last_seen) VALUES (?, CURRENT_TIMESTAMP)").run(userId);
      }
    });

    ws.on("close", () => {
      const clientData = clients.get(ws);
      if (clientData) {
        const uid = clientData.userId;
        userSockets.delete(uid);
        Array.from(voiceRooms.entries()).forEach(([room, set]) => {
          if (set.has(uid)) {
            set.delete(uid);
            voiceRooms.set(room, set);
            set.forEach((other) => {
              const s = userSockets.get(other);
              if (s && s.readyState === WebSocket.OPEN) {
                s.send(JSON.stringify({ type: "user-left-voice", userId: uid }));
              }
            });
          }
        });
      }
      clients.delete(ws);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    app.get("*", async (req, res) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        res.status(500).end(e.message);
      }
    });
    console.log("Vite middleware and fallback ready");
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
