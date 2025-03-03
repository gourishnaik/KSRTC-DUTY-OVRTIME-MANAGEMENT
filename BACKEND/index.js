const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ksrtc')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define a Mongoose schema
const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }
}, { strict: false });

const User = mongoose.model("User", UserSchema);

// Get all users
app.get("/api/KsrtcOtdata", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Get user by ID
app.get("/api/KsrtcOtdata/:id", async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (user) res.json(user);
        else res.status(404).json({ message: "User not found" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
});

app.delete("/api/KsrtcOtdata/deleteDuty", async (req, res) => {
    const { id, key } = req.body;

    try {
        const user = await User.findOne({ id });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user[key]) return res.status(404).json({ message: "Duty not found" });

        user.set(key, undefined);
        await user.save();

        res.status(200).json({ message: "Duty deleted successfully", updatedData: user });
    } catch (error) {
        res.status(500).json({ message: "Error deleting duty" });
    }
});

// Add new duty
app.post("/api/KsrtcOtdata/Newduty", async (req, res) => {
    const { id, duty } = req.body;

    try {
        const user = await User.findOne({ id });
        if (!user) return res.status(404).json({ message: "User not found" });

        const nextKey = Object.keys(user.toObject()).filter(key => key !== "_id" && key !== "id").length + 1;
        user.set(nextKey.toString(), duty);

        await user.save();
        res.status(200).json({ message: "Duty added successfully", updatedData: user });
    } catch (error) {
        res.status(500).json({ message: "Error adding duty" });
    }
});

// Create new employee
app.post("/api/createEmployee", async (req, res) => {
    const { id, ...duties } = req.body;

    try {
        const existingEmployee = await User.findOne({ id });
        if (existingEmployee) return res.status(400).json({ message: "Employee ID already exists" });

        const newUser = new User({ id, ...duties });
        await newUser.save();

        res.status(201).json({ message: "Employee created successfully", newId: id });
    } catch (error) {
        res.status(500).json({ message: "Error creating employee" });
    }
});

// Update user data
app.put("/api/KsrtcOtdata/updateData", async (req, res) => {
    const { id, ...updatedData } = req.body;

    try {
        const user = await User.findOneAndUpdate({ id }, updatedData, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Data updated successfully", updatedData: user });
    } catch (error) {
        res.status(500).json({ message: "Error updating data" });
    }
});

// Reset data (retain only IDs)
app.post("/api/KsrtcOtdata/resetData", async (req, res) => {
    try {
        await User.updateMany({}, { $unset: { "1": "", "2": "" } });
        res.status(200).json({ message: "Data reset successfully, retaining only IDs" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting data" });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
