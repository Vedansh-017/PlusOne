// controllers/authController.js
import UserModel from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * REGISTER USER → Send OTP
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Only allow nitj.ac.in emails
    if (!email.endsWith("@nitj.ac.in")) {
      return res.status(400).json({ message: "Only Email Id's with college Domain are allowed" });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    const expiry = new Date(Date.now() + 5 * 60 * 1000); // convert to Date


    // Create user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt: expiry
    });

    // Send OTP email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Your plusONE Registration OTP",
      text: `Hello ${name}, your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.status(201).json({success: true, message: "User registered. OTP sent to email." });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" }); // 400 instead of 404

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.verified) return res.status(400).json({ message: "Please verify your email first" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * VERIFY OTP → Issue JWT
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare OTP safely
    if (!user.otp || user.otp.toString().trim() !== otp.toString().trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (Date.now() > new Date(user.otpExpiresAt).getTime()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Clear OTP and mark verified
    user.otp = null;
    user.otpExpiresAt = null;
    user.verified = true;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("OTP verify error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

