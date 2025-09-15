document.addEventListener('DOMContentLoaded', function () {

    // --- BACKEND API BASE URL ---
    const API_BASE = "http://localhost:5000"; // 👈 backend runs separately

    const locationData = { 
        "Alappuzha": { villages: ["Kayamkulam", "Cherthala", "Ambalapuzha", "Chengannur"], crop: "paddy", soil: "alluvial" },
        "Ernakulam": { villages: ["Kochi", "Aluva", "Muvattupuzha", "Kothamangalam"], crop: "coconut", soil: "laterite" },
        "Idukki": { villages: ["Thodupuzha", "Kattappana", "Adimali", "Munnar"], crop: "rubber", soil: "laterite" },
        "Kannur": { villages: ["Thalassery", "Payyanur", "Iritty", "Mattanur"], crop: "coconut", soil: "laterite" },
        "Kasaragod": { villages: ["Kanhangad", "Nileshwaram", "Manjeshwar", "Vellarikundu"], crop: "coconut", soil: "laterite" },
        "Kollam": { villages: ["Punalur", "Karunagappally", "Kottarakkara", "Pathanapuram"], crop: "paddy", soil: "alluvial" },
        "Kottayam": { villages: ["Changanassery", "Pala", "Vaikom", "Kanjirappally"], crop: "rubber", soil: "laterite" },
        "Kozhikode": { villages: ["Vatakara", "Koyilandy", "Thamarassery", "Perambra"], crop: "coconut", soil: "laterite" },
        "Malappuram": { villages: ["Tirur", "Perinthalmanna", "Manjeri", "Ponnani"], crop: "coconut", soil: "laterite" },
        "Palakkad": { villages: ["Ottapalam", "Chittur", "Alathur", "Mannarkkad"], crop: "paddy", soil: "clayey" },
        "Pathanamthitta": { villages: ["Thiruvalla", "Adoor", "Ranni", "Konni"], crop: "rubber", soil: "laterite" },
        "Thiruvananthapuram": { villages: ["Neyyattinkara", "Attingal", "Nedumangad", "Varkala"], crop: "coconut", soil: "laterite" },
        "Thrissur": { villages: ["Chalakudy", "Kodungallur", "Irinjalakuda", "Guruvayur"], crop: "paddy", soil: "clayey" },
        "Wayanad": { villages: ["Kalpetta", "Sultan Bathery", "Mananthavady", "Vythiri"], crop: "banana", soil: "laterite" }
    };

    // --- DOM ELEMENTS ---
    const districtSelect = document.getElementById('district-select');
    const villageSelect = document.getElementById('village-select');
    const mainCropSelect = document.getElementById('main-crop');
    const soilTypeSelect = document.getElementById('soil-type');
    const profileForm = document.getElementById('farmer-profile-form');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // --- FUNCTIONS ---
    
    // NEW FUNCTION: Populate the District dropdown
    const populateDistricts = () => {
        districtSelect.innerHTML = `<option value="">Select District</option>`; 
        Object.keys(locationData).forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    };

    const populateVillages = (district) => {
        villageSelect.innerHTML = `<option value="">Select Village</option>`;
        if (district && locationData[district]) {
            locationData[district].villages.forEach(village => {
                const option = document.createElement('option');
                option.value = village;
                option.textContent = village;
                villageSelect.appendChild(option);
            });
            villageSelect.disabled = false;
        } else {
            villageSelect.innerHTML = `<option value="">Select a district first</option>`;
            villageSelect.disabled = true;
        }
    };

    const addMessage = (text, sender) => {
        const messageContainer = document.createElement('div');
        messageContainer.className = `message ${sender}-message`;
        const messageBubble = document.createElement('div');
        messageBubble.innerHTML = `<p>${text}</p><span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;
        messageContainer.appendChild(messageBubble);
        chatBox.appendChild(messageContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const getBotResponse = (userText) => {
        const lowerText = userText.toLowerCase();
        if (lowerText.includes("hello")) return "Hello! How can I assist you with your farming questions today?";
        if (lowerText.includes("weather")) return "Weather forecast is displayed in the alert banner.";
        if (lowerText.includes("scheme")) return "Check the Schemes section for government schemes.";
        return "I'm still learning. Please ask about weather, sowing time, or schemes.";
    };

    const handleSendMessage = () => {
        const text = userInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            userInput.value = '';
            setTimeout(() => addMessage(getBotResponse(text), 'assistant'), 1000);
        }
    };

    // --- EVENT LISTENERS ---
    districtSelect.addEventListener('change', () => {
        populateVillages(districtSelect.value);
        // Also update crop and soil based on the selected district
        if (locationData[districtSelect.value]) {
            mainCropSelect.value = locationData[districtSelect.value].crop;
            soilTypeSelect.value = locationData[districtSelect.value].soil;
        }
    });

    sendBtn.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => (e.key === 'Enter') && handleSendMessage());

    // --- SUBMIT FARMER PROFILE TO BACKEND ---
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const profileData = {
                name: document.getElementById('Full Name').value,
                district: districtSelect.value,
                village: villageSelect.value,
                landSize: document.getElementById('Land Size(acres)').value,
                crop: mainCropSelect.value,
                soil: soilTypeSelect.value
            };

            try {
                const res = await fetch(`${API_BASE}/api/profile`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(profileData)
                });

                if (!res.ok) throw new Error("Failed to save profile");

                const data = await res.json();
                alert("✅ Profile saved successfully!");
                console.log("Saved profile:", data);

            } catch (error) {
                console.error("Error saving profile:", error);
                alert("❌ Failed to save profile. Please check backend.");
            }
        });
    }

    // --- LOAD SCHEMES FROM BACKEND ---
    async function loadSchemes() {
        try {
            const res = await fetch(`${API_BASE}/api/schemes`);
            const schemes = await res.json();
            console.log("Schemes loaded:", schemes);
            // TODO: show schemes in frontend cards
        } catch (error) {
            console.error("Error loading schemes:", error);
        }
    }

    // --- INITIALIZATION ---
    populateDistricts(); // <-- This line is the key fix
    populateVillages(districtSelect.value); // This will initially set the village dropdown as "Select a district first"
    loadSchemes(); 
});