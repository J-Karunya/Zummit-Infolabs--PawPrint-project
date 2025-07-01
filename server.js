require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sendOTP, verifyOTP } = require("./otp"); // Import OTP functions

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to send OTP
app.post("/send-otp", async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ message: "Phone number is required!" });
        }

        await sendOTP(phone);
        res.json({ message: "OTP sent successfully!" });
    } catch (error) {
        console.error("🚨 Error sending OTP:", error);
        res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
});

// Route to verify OTP
app.post("/verify-otp", async (req, res) => {
    try {
        console.log("📌 Debug: Received data:", req.body); // Debugging log

        const { phone, otp } = req.body;

        // Check if both phone and OTP are provided
        if (!phone || !otp) {
            return res.status(400).json({ message: "Phone number and OTP are required!" });
        }

        const result = await verifyOTP(phone, otp);

        if (result.success) {
            res.json({ message: result.message });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error("🚨 Error verifying OTP:", error);
        res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
