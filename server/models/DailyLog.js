import mongoose from "mongoose";

const dailyLogSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    calories: { type: Number, default: 0 },
    waterMl: { type: Number, default: 0 },
    sleepHours: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    weight: { type: Number, default: null },
    weightUnit: { type: String, enum: ["kg", "lb", null], default: null },
  },
  { timestamps: true }
);

// optional: enforce one log per day
dailyLogSchema.index({ date: 1 }, { unique: true });

const DailyLog = mongoose.model("DailyLog", dailyLogSchema);

export default DailyLog;
