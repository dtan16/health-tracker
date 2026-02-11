import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import DailyLog from "./models/DailyLog.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// --- MongoDB connection ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Health tracker API is running" });
});

// Get recent logs (newest first)
app.get("/api/logs", async (req, res) => {
  try {
    const logs = await DailyLog.find().sort({ date: -1 }).limit(30).lean();
    res.json(
      logs.map((log) => ({
        id: log._id,
        date: log.date,
        calories: log.calories,
        waterMl: log.waterMl,
        sleepHours: log.sleepHours,
        carbs: log.carbs,
        protein: log.protein,
        fats: log.fats,
        weight: log.weight,
        weightUnit: log.weightUnit,
      }))
    );
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// Create or update a daily log
app.post("/api/logs", async (req, res) => {
  try {
    const {
      date,
      calories,
      waterMl,
      sleepHours,
      carbs,
      protein,
      fats,
      weight,
      weightUnit,
    } = req.body;

    if (!date) {
      return res.status(400).json({ error: "date is required" });
    }

    // Normalize date to midnight so each day is unique
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);

    const update = {
      calories: Number(calories) || 0,
      waterMl: Number(waterMl) || 0,
      sleepHours: Number(sleepHours) || 0,
      carbs: Number(carbs) || 0,
      protein: Number(protein) || 0,
      fats: Number(fats) || 0,
      weight: weight ? Number(weight) : null,
      weightUnit: weightUnit || null,
    };

    const log = await DailyLog.findOneAndUpdate(
      { date: day },
      { date: day, ...update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      id: log._id,
      date: log.date,
      ...update,
    });
  } catch (err) {
    console.error("Error saving log:", err);
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: "A log for this date already exists" });
    }
    res.status(500).json({ error: "Failed to save log" });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
