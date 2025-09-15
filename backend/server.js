// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dummy schemes data
const schemes = [
  {
    title: "Pradhan Mantri Fasal Bima Yojana",
    description: "Provides insurance coverage against crop failure.",
    eligibility: "All farmers growing notified crops."
  },
  {
    title: "PM-KISAN Scheme",
    description: "Financial benefit of ₹6,000 per year for eligible farmer families.",
    eligibility: "All landholding farmer families."
  },
  {
    title: "Sub-Mission on Agricultural Mechanization",
    description: "Subsidies on tractors and machinery.",
    eligibility: "Individual farmers and groups."
  }
];

// GET endpoint for schemes
app.get("/api/schemes", (req, res) => {
  res.json(schemes);
});

// POST endpoint for saving farmer profile
app.post("/api/profile", (req, res) => {
  console.log("📩 Farmer Profile Received:", req.body);
  res.json({ message: "✅ Farmer profile saved successfully!" });
});

// POST endpoint for chat
app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  console.log("💬 User asked:", message);
  res.json({ reply: `AI Assistant: You said "${message}"` });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
