import express from "express";
import prisma from "../utils/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all people with transaction stats
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const people = await prisma.person.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });

    // Get transaction stats for each person
    const peopleWithStats = await Promise.all(
      people.map(async (person) => {
        const transactions = await prisma.transaction.findMany({
          where: {
            userId,
            person: person.name,
          },
          select: {
            type: true,
            amount: true,
            status: true,
          },
        });

        const transactionCount = transactions.length;
        const totalLent = transactions
          .filter((t) => t.type === "lent")
          .reduce((sum, t) => sum + t.amount, 0);
        const totalBorrowed = transactions
          .filter((t) => t.type === "borrowed")
          .reduce((sum, t) => sum + t.amount, 0);

        // Net balance: positive means they owe you, negative means you owe them
        const netBalance = totalLent - totalBorrowed;

        return {
          ...person,
          transactionCount,
          totalLent,
          totalBorrowed,
          netBalance,
        };
      })
    );

    res.json({ people: peopleWithStats });
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

    const oldName = existing.name;
    const newName = name || existing.name;

    const person = await prisma.person.update({
      where: { id },
      data: {
        name: newName,
        phone: phone !== undefined ? phone : existing.phone,
        email: email !== undefined ? email : existing.email,
        notes: notes !== undefined ? notes : existing.notes,
      },
    });

    // If name changed, update all transactions with the old name
    if (oldName !== newName) {
      await prisma.transaction.updateMany({
        where: {
          userId,
          person: oldName,
        },
        data: {
          person: newName,
        },
      });
    }

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

    // Check if person has any transactions
    const transactionCount = await prisma.transaction.count({
      where: {
        userId,
        person: existing.name,
      },
    });

    if (transactionCount > 0) {
      return res.status(400).json({
        message: `Cannot delete ${existing.name}. They have ${transactionCount} transaction(s). Delete the transactions first or reassign them to another person.`,
      });
    }

    await prisma.person.delete({ where: { id } });
    res.json({ message: "Person deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete person" });
  }
});

export default router;
