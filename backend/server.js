const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.post("/api/profile", (req, res) => {
  const profile = req.body;
  console.log("Received Farmer Profile:", profile);
  res.json({ message: "✅ Farmer profile saved successfully!" });
});

// --- Chat API ---
app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  let reply = "Sorry, I didn't understand.";

  if (message.toLowerCase().includes("hello")) {
    reply = "Hello! How can I help you with your farming today?";
  } else if (message.toLowerCase().includes("weather")) {
    reply = "🌧️ Heavy rain expected in Chittur today. Please take precautions.";
  }

  res.json({ reply });
});

// --- Schemes API ---
app.get("/api/schemes", (req, res) => {
  const schemes = [
    { title: "PM-Kisan", description: "₹6,000 yearly support to farmers.", eligibility: "All small/marginal farmers", category: "income", link: "#" },
    { title: "PMFBY", description: "Crop insurance scheme.", eligibility: "All farmers with notified crops", category: "insurance", link: "#" },
    { title: "SMAM", description: "Subsidy on tractors and equipment.", eligibility: "Individual farmers and groups", category: "subsidy", link: "#" }
  ];
  res.json(schemes);
});

// --- Start Server ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
