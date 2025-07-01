const redis = require("redis");
const twilio = require("twilio");
require("dotenv").config();

// Initialize Redis Client
const redisClient = redis.createClient({
    socket: {
        host: "127.0.0.1",
        port: 6379
    }
});

redisClient.on("error", (err) => console.error("🚨 Redis Connection Error:", err));

redisClient.connect()
    .then(() => console.log("✅ Connected to Redis"))
    .catch(err => console.error("❌ Redis Connection Error:", err));

// Initialize Twilio
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// Function to send OTP
const sendOTP = async (phone) => {
    if (!phone) throw new Error("Phone number is required!");

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    // Store OTP in Redis (expires in 5 minutes)
    await redisClient.setEx(phone, 300, otp.toString());

    console.log(`📌 Debug: OTP for ${phone} is ${otp}`); // Debugging log

    return client.messages.create({
        body: `Your OTP is ${otp}`,
        from: twilioPhone,
        to: phone
    });
};

// Function to verify OTP
const verifyOTP = async (phone, otp) => {
    if (!phone || !otp) return { success: false, message: "Phone number and OTP are required!" };

    const storedOtp = await redisClient.get(phone);
    
    console.log(`📌 Debug: Retrieved OTP from Redis for ${phone}:`, storedOtp);
    console.log(`📌 Debug: Entered OTP:`, otp);

    if (!storedOtp) {
        console.log("🚨 OTP expired or not found!");
        return { success: false, message: "OTP expired or not found!" };
    }
    
    if (storedOtp.trim() !== otp.trim()) {
        console.log("🚨 Invalid OTP!");
        return { success: false, message: "Invalid OTP!" };
    }

    await redisClient.del(phone); // Delete OTP after successful verification
    console.log("✅ OTP Verified Successfully!");
    
    return { success: true, message: "OTP Verified Successfully!" };
};

module.exports = { sendOTP, verifyOTP };
