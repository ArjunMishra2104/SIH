const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// --- Middleware ---
app.use(cors()); // allow requests from frontend
app.use(express.json()); // parse JSON bodies

// --- Sample schemes data ---
const schemes = [
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
];

// --- Routes ---
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

// Save farmer profile
app.post("/api/profile", (req, res) => {
  console.log("📩 Received farmer profile:", req.body);

  // Normally you’d save this to a database
  res.json({
    message: "✅ Profile saved successfully!",
    profile: req.body,
  });
});

// Get schemes (optionally filtered by district)
app.get("/api/schemes", (req, res) => {
  const district = req.query.district;

  if (district) {
    // filter schemes for that district
    const filtered = schemes.filter((s) =>
      s.districts.includes(district)
    );
    return res.json(filtered);
  }

  res.json(schemes);
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
