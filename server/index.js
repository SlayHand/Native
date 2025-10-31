const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// Lihtne in-memory “andmebaas”
const users = []; // { id, name, email, passwordHash, createdAt }

function makeToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

function auth(req, res, next) {
  const m = (req.headers.authorization || "").match(/^Bearer (.+)$/);
  if (!m) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(m[1], JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/** ---------- AUTH ---------- */

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password)
    return res.status(400).json({ error: "Missing fields" });

  const exists = users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
  if (exists) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: nanoid(),
    name: String(name),
    email: String(email),
    passwordHash,
    createdAt: Date.now(),
  };
  users.push(user);

  const token = makeToken(user);
  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(
    (u) => u.email.toLowerCase() === String(email || "").toLowerCase()
  );
  if (!user)
    return res.status(401).json({ error: "Invalid email or password" });

  const ok = await bcrypt.compare(String(password || ""), user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid email or password" });

  const token = makeToken(user);
  res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
});

// ME (GET)
app.get("/api/auth/me", auth, (req, res) => {
  const user = users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({ id: user.id, name: user.name, email: user.email });
});

/** Ühine update-loogika, mida kasutavad nii PATCH kui PUT */
async function applyProfileUpdate(user, body) {
  const { name, email } = body || {};
  let emailChanged = false;

  if (typeof name === "string" && name.trim()) {
    user.name = name.trim();
  }

  if (typeof email === "string" && email.trim()) {
    const nextLower = email.toLowerCase();
    const currentLower = user.email.toLowerCase();

    // keelame duplikaadi teiste kasutajate seas
    const duplicate = users.some(
      (u) => u.id !== user.id && u.email.toLowerCase() === nextLower
    );
    if (duplicate) {
      const err = new Error("Email already in use");
      err.status = 409;
      throw err;
    }

    if (nextLower !== currentLower) {
      user.email = email.trim();
      emailChanged = true;
    }
  }

  const response = {
    user: { id: user.id, name: user.name, email: user.email },
  };
  if (emailChanged) {
    response.token = makeToken(user);
  }
  return response;
}

// UPDATE PROFILE (PATCH – osaline uuendus)
app.patch("/api/auth/me", auth, async (req, res) => {
  try {
    const user = users.find((u) => u.id === req.userId);
    if (!user) return res.status(404).json({ error: "Not found" });

    const payload = await applyProfileUpdate(user, req.body);
    return res.json(payload);
  } catch (e) {
    if (e.status) return res.status(e.status).json({ error: e.message });
    console.error("PATCH /api/auth/me error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

// UPDATE PROFILE (PUT – lubame samamoodi osalist uuendust)
app.put("/api/auth/me", auth, async (req, res) => {
  try {
    const user = users.find((u) => u.id === req.userId);
    if (!user) return res.status(404).json({ error: "Not found" });

    // Kui tahad PUTi puhul *nõuda* kõiki välju, tee siin range kontroll:
    // const { name, email } = req.body || {};
    // if (!name || !email) return res.status(400).json({ error: "Missing fields" });

    const payload = await applyProfileUpdate(user, req.body);
    return res.json(payload);
  } catch (e) {
    if (e.status) return res.status(e.status).json({ error: e.message });
    console.error("PUT /api/auth/me error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

// CHANGE PASSWORD
app.post("/api/auth/change-password", auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const user = users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "Not found" });

  const ok = await bcrypt.compare(String(oldPassword), user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid old password" });

  user.passwordHash = await bcrypt.hash(String(newPassword), 10);
  return res.json({ ok: true });
});

/** ---------- START ---------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
