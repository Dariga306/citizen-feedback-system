const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 4000;

// ✅ ВКЛЮЧАЕМ CORS ДО маршрутов!
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ✅ Подключение к MongoDB
mongoose
  .connect("mongodb://localhost:27017/citizen-feedback")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Роуты
const requestRoutes = require("./routes/request");
const aiRoute = require("./routes/ai");

app.use("/api/requests", requestRoutes);
app.use("/api/analyze", aiRoute); // AI маршрут

// ✅ Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
