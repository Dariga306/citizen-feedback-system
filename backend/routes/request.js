
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  name: String,
  region: String,
  category: String,
  subcategory: String,
  service: String,
  contact: String,
  message: String,
  attachment: String,
  aiResult: Object,
  status: { type: String, default: "Новое" },
  executor: String,
  createdAt: { type: Date, default: Date.now },
});

const Request = mongoose.model("Request", requestSchema);

router.post("/", async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.status(201).json({ message: "Сохранено" });
  } catch (err) {
    console.error("Ошибка POST /api/requests:", err);
    res.status(500).json({ error: "Ошибка при сохранении" });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Request.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("Ошибка GET /api/requests:", err);
    res.status(500).json({ error: "Ошибка при получении" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    await Request.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Обновлено" });
  } catch (err) {
    console.error("Ошибка PATCH /api/requests/:id:", err);
    res.status(500).json({ error: "Ошибка при обновлении" });
  }
});

module.exports = router;
