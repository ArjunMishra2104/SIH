document.addEventListener('DOMContentLoaded', function () {
    // --- SAMPLE DATA (local, still used for dropdowns) ---
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
    const langSelector = document.getElementById('lang-selector'),
        fontButtons = document.querySelectorAll('.font-size-btn'),
        root = document.documentElement,
        districtSelect = document.getElementById('district-select'),
        villageSelect = document.getElementById('village-select'),
        locationStatus = document.getElementById('location-status'),
        mainCropSelect = document.getElementById('main-crop'),
        soilTypeSelect = document.getElementById('soil-type'),
        filterButtons = document.querySelectorAll('.filter-btn'),
        schemeContainer = document.getElementById('schemes-container'),
        sendBtn = document.getElementById('send-btn'),
        userInput = document.getElementById('user-input'),
        chatBox = document.getElementById('chat-box');

    let currentLang = 'en';

    // --- LANGUAGE & FONT ---
    const translations = {
        en: { chatPlaceholder: "Type a message...", chatGreeting: "Hello! I am Krishi Sakhi. How can I assist you today?", selectVillage: "Select Village", selectVillageFirst: "Select a district first" },
        ml: { chatPlaceholder: "ഒരു സന്ദേശം ടൈപ്പ് ചെയ്യുക...", chatGreeting: "നമസ്കാരം! ഞാൻ കൃഷി സഖി. നിങ്ങൾക്ക് എന്ത് സഹായമാണ് വേണ്ടത്?", selectVillage: "ഗ്രാമം തിരഞ്ഞെടുക്കുക", selectVillageFirst: "ആദ്യം ഒരു ജില്ല തിരഞ്ഞെടുക്കുക" }
    };

    const setLanguage = (lang) => {
        currentLang = lang;
        userInput.placeholder = translations[lang].chatPlaceholder;
        chatBox.innerHTML = '';
        addMessage(translations[lang].chatGreeting, 'assistant');
    };

    const setFontSize = (size) => {
        fontButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.font-size-btn[data-size="${size}"]`).classList.add('active');
        root.style.fontSize = size === 'small' ? '14px' : size === 'medium' ? '16px' : '18px';
    };

    // --- VILLAGE POPULATION ---
    const populateVillages = (district) => {
        villageSelect.innerHTML = `<option value="">${translations[currentLang].selectVillage}</option>`;
        if (district && locationData[district]) {
            locationData[district].villages.forEach(village => {
                const option = document.createElement('option');
                option.value = village.toLowerCase().replace(' ', '-');
                option.textContent = village;
                villageSelect.appendChild(option);
            });
            villageSelect.disabled = false;
        } else {
            villageSelect.innerHTML = `<option value="">${translations[currentLang].selectVillageFirst}</option>`;
            villageSelect.disabled = true;
        }
    };

    // --- CHAT MESSAGES ---
    const addMessage = (text, sender) => {
        const messageContainer = document.createElement('div');
        messageContainer.className = `message ${sender}-message`;
        const messageBubble = document.createElement('div');
        messageBubble.innerHTML = `<p>${text}</p><span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;
        messageContainer.appendChild(messageBubble);
        chatBox.appendChild(messageContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    // --- CHAT HANDLER (connects to backend) ---
    const handleSendMessage = async () => {
        const text = userInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        userInput.value = '';

        try {
            const res = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });
            const data = await res.json();
            addMessage(data.reply, 'assistant');
        } catch (err) {
            addMessage("⚠️ Error connecting to server.", 'assistant');
        }
    };

    // --- FARMER PROFILE HANDLER ---
    document.getElementById('farmer-profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const profile = {
            name: document.getElementById('farmer-name').value,
            district: districtSelect.value,
            village: villageSelect.value,
            landSize: document.getElementById('land-size').value,
            crop: mainCropSelect.value,
            soil: soilTypeSelect.value
        };

        try {
            const res = await fetch("http://localhost:5000/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile)
            });
            const data = await res.json();
            alert(data.message);
        } catch (err) {
            alert("Error saving profile: " + err.message);
        }
    });

    // --- LOAD SCHEMES FROM BACKEND ---
    const loadSchemes = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/schemes");
            const schemes = await res.json();

            schemeContainer.innerHTML = '';
            schemes.forEach(s => {
                const card = document.createElement('div');
                card.className = "scheme-card";
                card.setAttribute("data-category", s.category);
                card.innerHTML = `
                    <h3>${s.title}</h3>
                    <p>${s.description}</p>
                    <p><strong>Eligibility:</strong> ${s.eligibility}</p>
                    <a href="${s.link}" target="_blank">Learn More & Apply</a>
                `;
                schemeContainer.appendChild(card);
            });
        } catch (err) {
            schemeContainer.innerHTML = "<p>⚠️ Failed to load schemes.</p>";
        }
    };

    // --- EVENT LISTENERS ---
    langSelector.addEventListener('change', (e) => setLanguage(e.target.value));
    fontButtons.forEach(btn => btn.addEventListener('click', () => setFontSize(btn.getAttribute('data-size'))));
    filterButtons.forEach(btn => btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.scheme-card').forEach(card => {
            card.style.display = (filter === 'all' || card.getAttribute('data-category') === filter) ? 'block' : 'none';
        });
    }));
    sendBtn.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => (e.key === 'Enter') && handleSendMessage());
    districtSelect.addEventListener('change', () => populateVillages(districtSelect.value));

    // --- INITIALIZE ---
    Object.keys(locationData).forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });
    setLanguage(langSelector.value);
    setFontSize('medium');
    loadSchemes();
});
