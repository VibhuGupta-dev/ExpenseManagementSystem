import Joi from "joi";
import userModel from "../models/UserSchema.js";
import generateToken from "../utils/GenerateToken.js";
import cors from "cors";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../utils/EmailService.js";

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Validation schemas
const signupSchema = Joi.object({
  Fullname: Joi.string().required().messages({
    "string.empty": "Full name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),
  country: Joi.string().required().messages({
    "string.empty": "Country is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),
});

// Function to generate a random 6-digit password
const generateRandom6DigitPassword = () => {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, 6);
};

// Signup user (only one admin allowed)
export const signupUser = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { Fullname, email, password, country } = req.body;

    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    // Generate random 6-digit password if not provided (for initial admin setup)
    const finalPassword = password || generateRandom6DigitPassword();

    // Create admin user
    const user = new userModel({
      Fullname,
      email,
      password: finalPassword, // Will be hashed by pre-save hook
      country,
      role: "admin",
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    });

    await user.save();

    // Send new password via email if it was generated
    if (!password) {
      await sendResetPasswordEmail({ email, Fullname, newPassword: finalPassword });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
      path: "/",
    });

    return res.status(201).json({
      success: true,
      message: password ? "Admin registered successfully" : "Admin registered successfully, password sent to email",
      user: {
        id: user._id,
        Fullname: user.Fullname,
        email: user.email,
        country: user.country,
        isEmailVerified: user.isEmailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
      },
      token,
    });
  } catch (error) {
    console.error("Error in signupUser:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user || user.role !== "admin") {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        Fullname: user.Fullname,
        email: user.email,
        role:user.role,
        country: user.country,
        isEmailVerified: user.isEmailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
      },
      token,
    });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Logout user
export const logout = (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      expires: new Date(0),
      path: "/",
    });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = req.user; // From authMiddleware
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        Fullname: user.Fullname,
        email: user.email,
        country: user.country,
        isEmailVerified: user.isEmailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Forgot password - Generate and send new 6-digit password
export const forgotPassword = async (req, res) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { email } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user || user.role !== "admin") {
      return res.status(400).json({ success: false, message: "Email not found or not an admin" });
    }

    // Generate new random 6-digit password
    const newPassword = generateRandom6DigitPassword();

    // Update user's password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    // Send new password via email
    try {
      await sendResetPasswordEmail({ email, Fullname: user.Fullname, newPassword });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({ success: false, message: "Failed to send new password email" });
    }

    return res.status(200).json({ success: true, message: "New password sent to your email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};