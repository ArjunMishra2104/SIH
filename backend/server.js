const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// --- Middleware ---
app.use(cors()); // allow frontend from another folder (different origin)
app.use(express.json()); // parse JSON bodies

// --- Routes ---
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

// Save farmer profile
app.post("/api/profile", (req, res) => {
  console.log("📩 Received farmer profile:", req.body);

  // Here you would normally save to a database (MongoDB/MySQL/etc.)
  // For now, we just send it back
  res.json({
    message: "✅ Profile saved successfully!",
    profile: req.body,
  });
});

// Get schemes list
app.get("/api/schemes", (req, res) => {
  res.json([
    {
      title: "PM-KISAN",
      description: "Income support of ₹6,000 per year to farmers.",
    },
    {
      title: "PMFBY",
      description: "Crop insurance scheme for protection against crop loss.",
    },
    {
      title: "SMAM",
      description: "Subsidy on tractors and farming equipment.",
    },
  ]);
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
