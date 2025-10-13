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
const users = []; // {id, name, email, passwordHash, createdAt}

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

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password)
    return res.status(400).json({ error: "Missing fields" });
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(409).json({ error: "Email already in use" });

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
    .json({ user: { id: user.id, name, email: user.email }, token });
});

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

app.get("/api/auth/me", auth, (req, res) => {
  const user = users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({ id: user.id, name: user.name, email: user.email });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
