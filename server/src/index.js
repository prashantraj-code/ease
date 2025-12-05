import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import "dotenv/config";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";
import reportRoutes from "./routes/reports.js";
import notificationRoutes from "./routes/notifications.js";
import moneySourceRoutes from "./routes/moneySources.js";
import peopleRoutes from "./routes/people.js";
import notesRoutes from "./routes/notes.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://ease-kappa.vercel.app",
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/money-sources", moneySourceRoutes);
app.use("/api/people", peopleRoutes);
app.use("/api/notes", notesRoutes);

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

app.get("/ping", (req, res) => {
  res.send("Sever is running .. SUCCESFULLY");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
