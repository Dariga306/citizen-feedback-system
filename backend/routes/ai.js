const express = require("express");
const router = express.Router();

// ЗАГЛУШКА вместо реальной ML-модели
function mockAI(text) {
  const lower = text.toLowerCase();
  const sentiment = lower.includes("жақсы") || lower.includes("спасибо")
    ? "позитив"
    : lower.includes("проблема") || lower.includes("плохо")
    ? "негатив"
    : "нейтрально";

  const intent = lower.includes("?")
    ? "вопрос"
    : lower.includes("требую") || lower.includes("прошу")
    ? "жалоба"
    : lower.includes("предлагаю") || lower.includes("можно")
    ? "предложение"
    : "неизвестно";

  return { intent, sentiment };
}

router.post("/", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  const result = mockAI(text);
  res.json(result);
});

module.exports = router;
