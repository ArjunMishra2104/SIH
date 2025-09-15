const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = [{username: "test", password: "123"}];

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if(user){
        res.json({ success: true, message: "Login Successfull"});
    } else{
        res.json({ success: false, message: "Invalid credentials"});
    }
});

app.post("/signup", (req, res) => {
    const { username, password } = req.body;
    const userExists = users.find((u) => u.username === username);

    if(userExists){
        return res.json({ success: false, message : "user already exists"});
    }

    users.push({username, password});
    res.json({ success: true, message : "Signup successful!"});
});

app.post("/change-password", (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === oldPassword
  );

  if (!user) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  user.password = newPassword;
  res.json({ success: true, message: "Password updated successfully!" });
});
app.post("/location", (req, res) => {
  const { username, latitude, longitude } = req.body;

  if (!username || !latitude || !longitude) {
    return res.json({ success: false, message: "Missing data" });
  }

  // For now, just log and return it (later you can store in DB)
  console.log(`Location of ${username}: ${latitude}, ${longitude}`);

  res.json({ 
    success: true, 
    message: "Location received successfully", 
    data: { username, latitude, longitude } 
  });
});
app.listen(5000, () => console.log("Server running on https://localhost:5000"));
