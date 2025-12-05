import express from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
import { signToken } from "../utils/jwt.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// ✅ Signup route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing)
      return res.status(409).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hash, name: username },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        profilePic: true,
        currency: true,
        createdAt: true,
      },
    });

    const token = signToken({ id: user.id, username: user.username });

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
});

// ✅ Login route
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { username: identifier }] },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        profilePic: true,
        currency: true,
        password: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ id: user.id, username: user.username });

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userData } = user;
    res.json({ user: userData });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});

// ✅ Logout
router.post("/logout", (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out" });
});

// ✅ Get current user (full profile from database)
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.json({ user: null });

    // Decode token to get user id
    const decoded = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        profilePic: true,
        currency: true,
        createdAt: true,
      },
    });

    if (!user) return res.json({ user: null });

    res.json({ user });
  } catch (err) {
    res.json({ user: null });
  }
});

// ✅ Update user profile (name, profilePic)
router.put("/profile", requireAuth, async (req, res) => {
  try {
    const { name, profilePic } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (profilePic !== undefined) updateData.profilePic = profilePic;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        profilePic: true,
        currency: true,
        createdAt: true,
      },
    });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// ✅ Update user currency preference
router.put("/currency", requireAuth, async (req, res) => {
  try {
    const { currency } = req.body;

    if (!currency)
      return res.status(400).json({ message: "Currency is required" });

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { currency },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        profilePic: true,
        currency: true,
        createdAt: true,
      },
    });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update currency" });
  }
});

export default router;
