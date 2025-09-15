const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enables CORS for all requests
app.use(express.json()); // Allows parsing of JSON request bodies

const DB_FILE = path.join(__dirname, 'farmers_data.json');

// Function to initialize the database file
const initDb = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ farmers: [] }, null, 4));
    }
};

// --- API ENDPOINTS ---

// Endpoint to save farmer profile data
app.post('/api/profile', (req, res) => {
    const newProfile = req.body;
    if (!newProfile || Object.keys(newProfile).length === 0) {
        return res.status(400).json({ error: "No data provided" });
    }

    try {
        const dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        dbData.farmers.push(newProfile);
        fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 4));

        console.log('Profile saved:', newProfile);
        res.status(201).json({ message: "Profile saved successfully!", data: newProfile });

    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({ error: "Failed to save profile. Please check the data format." });
    }
});

// Endpoint to get a list of schemes
app.get('/api/schemes', (req, res) => {
    const schemes = [
        { name: "Pradhan Mantri Fasal Bima Yojana", description: "Crop insurance scheme for farmers." },
        { name: "Paramparagat Krishi Vikas Yojana", description: "Scheme to promote organic farming." },
        { name: "National Mission on Micro Irrigation", description: "Promotes efficient water use through micro-irrigation systems." },
        { name: "Soil Health Card Scheme", description: "Provides soil health cards to farmers to improve productivity." }
    ];
    res.status(200).json(schemes);
});

// Start the server
app.listen(PORT, () => {
    initDb(); // Ensure the database file exists when the app starts
    console.log(`Server is running on http://localhost:${PORT}`);
});