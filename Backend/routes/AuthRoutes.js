import express from "express";
import { signupUser, loginUser, logout, getProfile, forgotPassword } from "../controllers/faltu.js"
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup route (only for admin)
router.post("/signup", signupUser);

// Login route
router.post("/login", loginUser);

// Logout route
router.post("/logout", logout);

// Get profile route (protected)
router.get("/profile", authMiddleware, getProfile);

// Forgot password route
router.post("/forgot-password", forgotPassword);

export default router;