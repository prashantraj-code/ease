import express from "express";
import prisma from "../utils/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Seed random transactions for testing
router.post("/seed", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { count = 10 } = req.body;

    // Get existing people and money sources for this user
    const people = await prisma.person.findMany({ where: { userId } });
    const moneySources = await prisma.moneySource.findMany({
      where: { userId },
    });

    if (people.length === 0) {
      return res.status(400).json({
        message: "Please add at least one person first",
      });
    }

    const descriptions = [
      "Lunch money",
      "Movie tickets",
      "Grocery shopping",
      "Cab fare",
      "Coffee",
      "Birthday gift",
      "Rent share",
      "Utility bills",
      "Shopping",
      "Medical expenses",
      "Travel expenses",
      "Dinner",
      "Books",
      "Electronics",
      "Subscription",
      "Emergency fund",
      "Party expenses",
      "Sports equipment",
      "Clothes",
      "Gadgets",
    ];

    const types = ["lent", "borrowed"];
    const statuses = ["paid", "unpaid"];

    const transactions = [];
    for (let i = 0; i < parseInt(count); i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const person = people[Math.floor(Math.random() * people.length)];
      const amount = Math.floor(Math.random() * 9500) + 500; // 500 to 10000
      const description =
        descriptions[Math.floor(Math.random() * descriptions.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const moneySource =
        moneySources.length > 0
          ? moneySources[Math.floor(Math.random() * moneySources.length)]
          : null;

      // Random date within last 90 days
      const daysAgo = Math.floor(Math.random() * 90);
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - daysAgo);

      const txn = await prisma.transaction.create({
        data: {
          userId,
          type,
          person: person.name,
          amount,
          description,
          status,
          dueDate,
          moneySourceId: moneySource?.id || null,
        },
      });

      // Update money source balance
      if (moneySource) {
        const balanceChange = type === "lent" ? -amount : amount;
        await prisma.moneySource.update({
          where: { id: moneySource.id },
          data: { balance: { increment: balanceChange } },
        });
      }

      transactions.push(txn);
    }

    res.status(201).json({
      message: `Successfully created ${transactions.length} random transactions`,
      count: transactions.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to seed transactions" });
  }
});

// Get transaction stats (totals)
router.get("/stats", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      select: { type: true, amount: true },
    });

    const totalTransactions = transactions.length;
    const totalLent = transactions
      .filter((t) => t.type === "lent")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalBorrowed = transactions
      .filter((t) => t.type === "borrowed")
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      totalTransactions,
      totalLent,
      totalBorrowed,
      netBalance: totalLent - totalBorrowed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transaction stats" });
  }
});

// Get all transactions with search, filter, sort, and pagination
router.get("/", requireAuth, async (req, res) => {
  try {
    const {
      search,
      type,
      status,
      person,
      moneySourceId,
      fromDate,
      toDate,
      sortBy,
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const userId = req.user.id;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = { userId };

    // Search filter (in description)
    if (search) {
      where.description = { contains: search, mode: "insensitive" };
    }

    // Person filter
    if (person) {
      where.person = person;
    }

    // Money source filter
    if (moneySourceId) {
      where.moneySourceId = moneySourceId;
    }

    // Type filter
    if (type && (type === "lent" || type === "borrowed")) {
      where.type = type;
    }

    // Status filter
    if (status && (status === "paid" || status === "unpaid")) {
      where.status = status;
    }

    // Date range filter
    if (fromDate || toDate) {
      where.dueDate = {};
      if (fromDate) {
        where.dueDate.gte = new Date(fromDate);
      }
      if (toDate) {
        // Include the entire day
        where.dueDate.lte = new Date(toDate + "T23:59:59.999Z");
      }
    }

    // Build orderBy - support multi-column sorting
    // sortBy can be a comma-separated string like "amount:desc,person:asc"
    let orderBy = [];
    if (sortBy) {
      const sortParts = sortBy.split(",");
      for (const part of sortParts) {
        const [column, sortOrder] = part.split(":");
        // Map frontend column names to database fields
        const fieldMap = {
          person: "person",
          amount: "amount",
          type: "type",
          source: "moneySourceId",
          date: "dueDate",
        };
        const field = fieldMap[column] || column;
        orderBy.push({ [field]: sortOrder || "asc" });
      }
    }

    // Default sort by dueDate desc if no sort specified
    if (orderBy.length === 0) {
      orderBy = [{ dueDate: "desc" }, { createdAt: "desc" }];
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    // Get total count for pagination
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
