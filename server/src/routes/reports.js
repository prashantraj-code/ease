import express from "express";
import prisma from "../utils/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Get balance summary
router.get("/summary", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });

    // Calculate totals
    const totalLent = transactions
      .filter((t) => t.type === "lent")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBorrowed = transactions
      .filter((t) => t.type === "borrowed")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalLentUnpaid = transactions
      .filter((t) => t.type === "lent" && t.status === "unpaid")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBorrowedUnpaid = transactions
      .filter((t) => t.type === "borrowed" && t.status === "unpaid")
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalLent - totalBorrowed;

    res.json({
      summary: {
        totalLent,
        totalBorrowed,
        totalLentUnpaid,
        totalBorrowedUnpaid,
        netBalance,
        totalTransactions: transactions.length,
        lentCount: transactions.filter((t) => t.type === "lent").length,
        borrowedCount: transactions.filter((t) => t.type === "borrowed").length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
});

export default router;
