import express from "express";
import prisma from "../utils/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all money sources
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const moneySources = await prisma.moneySource.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ moneySources });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch money sources" });
  }
});

// Create a new money source
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, type, balance, description } = req.body;
    const userId = req.user.id;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    const moneySource = await prisma.moneySource.create({
      data: {
        userId,
        name,
        type,
        balance: parseFloat(balance) || 0,
        description: description || null,
      },
    });

    res.status(201).json({ moneySource });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create money source" });
  }
});

// Update a money source
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, balance, description } = req.body;
    const userId = req.user.id;

    const existing = await prisma.moneySource.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Money source not found" });
    }
    if (existing.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const moneySource = await prisma.moneySource.update({
      where: { id },
      data: {
        name: name || existing.name,
        type: type || existing.type,
        balance: balance !== undefined ? parseFloat(balance) : existing.balance,
        description:
          description !== undefined ? description : existing.description,
      },
    });

    res.json({ moneySource });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update money source" });
  }
});

// Delete a money source
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await prisma.moneySource.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Money source not found" });
    }
    if (existing.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if money source has any transactions
    const transactionCount = await prisma.transaction.count({
      where: {
        moneySourceId: id,
      },
    });

    if (transactionCount > 0) {
      return res.status(400).json({
        message: `Cannot delete ${existing.name}. It has ${transactionCount} transaction(s). Delete the transactions first or change their money source.`,
      });
    }

    await prisma.moneySource.delete({ where: { id } });
    res.json({ message: "Money source deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete money source" });
  }
});

export default router;
