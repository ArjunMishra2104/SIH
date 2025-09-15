const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Example API route for saving farmer profile
app.post("/api/profile", (req, res) => {
  try {
    const profile = req.body;
    console.log("✅ Profile received:", profile);

    
    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: profile,
    });
  } catch (error) {
    console.error("❌ Error saving profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Example API route for schemes
app.get("/api/schemes", (req, res) => {
  const schemes = [
    { id: 1, name: "PM Kisan Samman Nidhi", desc: "Income support for farmers" },
    { id: 2, name: "Soil Health Card Scheme", desc: "Soil quality improvement" },
  ];
  res.json(schemes);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});