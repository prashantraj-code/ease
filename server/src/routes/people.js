import express from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get all people
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const people = await prisma.person.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
    res.json({ people });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch people" });
  }
});

// Create a new person
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, phone, email, notes } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const person = await prisma.person.create({
      data: {
        userId,
        name,
        phone: phone || null,
        email: email || null,
        notes: notes || null,
      },
    });

    res.status(201).json({ person });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create person" });
  }
});

// Update a person
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, notes } = req.body;
    const userId = req.user.id;

    const existing = await prisma.person.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Person not found" });
    }
    if (existing.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const person = await prisma.person.update({
      where: { id },
      data: {
        name: name || existing.name,
        phone: phone !== undefined ? phone : existing.phone,
        email: email !== undefined ? email : existing.email,
        notes: notes !== undefined ? notes : existing.notes,
      },
    });

    res.json({ person });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update person" });
  }
});

// Delete a person
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await prisma.person.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Person not found" });
    }
    if (existing.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.person.delete({ where: { id } });
    res.json({ message: "Person deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete person" });
  }
});

export default router;
