import express from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get upcoming notifications (due dates)
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    // Get unpaid transactions with upcoming due dates
    const upcomingTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        status: "unpaid",
        dueDate: {
          gte: today,
          lte: nextWeek,
        },
      },
      orderBy: { dueDate: "asc" },
    });

    // Get overdue transactions
    const overdueTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        status: "unpaid",
        dueDate: {
          lt: today,
        },
      },
      orderBy: { dueDate: "asc" },
    });

    res.json({
      upcoming: upcomingTransactions,
      overdue: overdueTransactions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

export default router;
