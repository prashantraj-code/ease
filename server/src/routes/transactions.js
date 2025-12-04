import express from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get all transactions with search, filter, sort, and pagination
router.get("/", requireAuth, async (req, res) => {
  try {
    const {
      search,
      type,
      status,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const userId = req.user.id;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = { userId };

    // Search filter
    if (search) {
      where.OR = [
        { person: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Type filter
    if (type && (type === "lent" || type === "borrowed")) {
      where.type = type;
    }

    // Status filter
    if (status && (status === "paid" || status === "unpaid")) {
      where.status = status;
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip,
      take,
    });

    // Get total count
    const total = await prisma.transaction.count({ where });

    res.json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

// Create a new transaction
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      type,
      person,
      amount,
      description,
      status,
      dueDate,
      moneySourceId,
    } = req.body;
    const userId = req.user.id;
    const parsedAmount = parseFloat(amount);

    if (!type || !person || !amount) {
      return res
        .status(400)
        .json({ message: "Type, person, and amount are required" });
    }

    if (type !== "lent" && type !== "borrowed") {
      return res
        .status(400)
        .json({ message: "Type must be 'lent' or 'borrowed'" });
    }

    // Check balance if money source is selected and type is lent
    if (moneySourceId && type === "lent") {
      const moneySource = await prisma.moneySource.findUnique({
        where: { id: moneySourceId },
      });
      if (moneySource && moneySource.balance < parsedAmount) {
        return res.status(400).json({
          message: `Insufficient balance in ${moneySource.name}. Available: ₹${moneySource.balance}`,
        });
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        person,
        amount: parsedAmount,
        description: description || null,
        status: status || "unpaid",
        dueDate: dueDate ? new Date(dueDate) : null,
        moneySourceId: moneySourceId || null,
      },
    });

    // Update money source balance
    if (moneySourceId) {
      const balanceChange = type === "lent" ? -parsedAmount : parsedAmount;
      await prisma.moneySource.update({
        where: { id: moneySourceId },
        data: {
          balance: { increment: balanceChange },
        },
      });
    }

    res.status(201).json({ transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create transaction" });
  }
});

// Update a transaction
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      person,
      amount,
      description,
      status,
      dueDate,
      moneySourceId,
    } = req.body;
    const userId = req.user.id;

    // Check if transaction exists and belongs to user
    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const newType = type || existing.type;
    const newAmount =
      amount !== undefined ? parseFloat(amount) : existing.amount;
    const newMoneySourceId =
      moneySourceId !== undefined
        ? moneySourceId || null
        : existing.moneySourceId;

    // Revert old money source balance
    if (existing.moneySourceId) {
      const oldBalanceChange =
        existing.type === "lent" ? existing.amount : -existing.amount;
      await prisma.moneySource.update({
        where: { id: existing.moneySourceId },
        data: { balance: { increment: oldBalanceChange } },
      });
    }

    // Check new balance if needed
    if (newMoneySourceId && newType === "lent") {
      const moneySource = await prisma.moneySource.findUnique({
        where: { id: newMoneySourceId },
      });
      if (moneySource && moneySource.balance < newAmount) {
        // Revert the old balance change we just made
        if (existing.moneySourceId) {
          const revertChange =
            existing.type === "lent" ? -existing.amount : existing.amount;
          await prisma.moneySource.update({
            where: { id: existing.moneySourceId },
            data: { balance: { increment: revertChange } },
          });
        }
        return res.status(400).json({
          message: `Insufficient balance in ${moneySource.name}. Available: ₹${moneySource.balance}`,
        });
      }
    }

    // Apply new money source balance
    if (newMoneySourceId) {
      const newBalanceChange = newType === "lent" ? -newAmount : newAmount;
      await prisma.moneySource.update({
        where: { id: newMoneySourceId },
        data: { balance: { increment: newBalanceChange } },
      });
    }

    // Build update data
    const updateData = {};
    if (type) updateData.type = type;
    if (person) updateData.person = person;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;
    if (dueDate !== undefined)
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (moneySourceId !== undefined)
      updateData.moneySourceId = moneySourceId || null;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });

    res.json({ transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update transaction" });
  }
});

// Delete a transaction
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if transaction exists and belongs to user
    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Revert money source balance before deleting
    if (existing.moneySourceId) {
      const balanceChange =
        existing.type === "lent" ? existing.amount : -existing.amount;
      await prisma.moneySource.update({
        where: { id: existing.moneySourceId },
        data: { balance: { increment: balanceChange } },
      });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
});

export default router;
