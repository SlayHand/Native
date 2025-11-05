const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// --- In-memory “db” ---
const users = []; // {id, name, email, passwordHash, createdAt}
const listings = []; // {id, userId, title, price, category, image, description, createdAt}

// --- helpers ---
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

// --- AUTH ---
// REGISTER
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password)
    return res.status(400).json({ error: "Missing fields" });
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: "Email already in use" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: nanoid(),
    name,
    email,
    passwordHash,
    createdAt: Date.now(),
  };
  users.push(user);
  const token = makeToken(user);
  res
    .status(201)
    .json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(
    (u) => u.email.toLowerCase() === (email || "").toLowerCase()
  );
  if (!user)
    return res.status(401).json({ error: "Invalid email or password" });
  const ok = await bcrypt.compare(password, user.passwordHash);
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

// UPDATE PROFILE (PATCH)
app.patch("/api/auth/me", auth, async (req, res) => {
  const user = users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "Not found" });

  const { name, email } = req.body || {};
  let emailChanged = false;

  if (typeof name === "string" && name.trim()) user.name = name.trim();

  if (typeof email === "string" && email.trim()) {
    const lower = email.toLowerCase();
    if (
      lower !== user.email.toLowerCase() &&
      users.some((u) => u.email.toLowerCase() === lower)
    ) {
      return res.status(409).json({ error: "Email already in use" });
    }
    if (lower !== user.email.toLowerCase()) {
      user.email = email.trim();
      emailChanged = true;
    }
  }

  const response = {
    user: { id: user.id, name: user.name, email: user.email },
  };
  if (emailChanged) response.token = makeToken(user);
  res.json(response);
});

// CHANGE PASSWORD
app.post("/api/auth/change-password", auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword)
    return res.status(400).json({ error: "Missing fields" });

  const user = users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "Not found" });

  const ok = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid old password" });

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  res.json({ ok: true });
});

// MY LISTINGS (auth)
app.get("/api/listings/mine", auth, (req, res) => {
  const mine = listings
    .filter((l) => l.userId === req.userId)
    .sort((a, b) => b.createdAt - a.createdAt);
  res.json(mine);
});

app.get("/api/listings/:id", (req, res) => {
  const item = listings.find((l) => l.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

app.get("/api/listings", (req, res) => {
  const all = listings.sort((a, b) => b.createdAt - a.createdAt);
  res.json(all);
});

app.delete("/api/listings/:id", auth, (req, res) => {
  console.log("DELETE /api/listings/", req.params.id, "by", req.userId);
  const { id } = req.params;

  // leia selle kasutaja kuulutus
  const idx = listings.findIndex((l) => l.id === id && l.userId === req.userId);

  if (idx === -1) {
    return res.status(404).json({ error: "Not found" });
  }

  const removed = listings.splice(idx, 1)[0];
  console.log("LISTING DELETED:", removed.id);
  return res.json({ ok: true });
});

app.post("/api/listings", auth, (req, res) => {
  const { title, price, category, description, image } = req.body || {};

  if (!title || typeof price === "undefined" || !category) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const numPrice = Number(price);
  if (!Number.isFinite(numPrice) || numPrice < 0) {
    return res.status(400).json({ error: "Price must be a positive number" });
  }

  const safeImage = typeof image === "string" ? image : "";

  const item = {
    id: nanoid(),
    userId: req.userId,
    title: String(title),
    price: numPrice,
    category: String(category),
    description: description ? String(description) : "",
    image: safeImage,
    createdAt: Date.now(),
  };
  listings.push(item);
  console.log("NEW LISTING CREATED:", item);
  res.status(201).json(item);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
