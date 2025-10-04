import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import { sendResetPasswordEmail } from "../utils/EmailService.js";

// Add new user
export default async function addUser(req, res) {
  try {
    const { name, role, managerId, email, country } = req.body;

    // Validation
    if (!name || !email || !role || !country) {
      return res.status(400).json({ success: false, message: "Name, email, role, and country are required" });
    }

    // Ensure only admin can add users (already checked by middleware, but good to verify)
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can add users" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    // Generate random password
    const plainPassword = Math.random().toString(36).slice(-8); // 8-character random string
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    // Create new user with employee role
    const newUser = new User({
      Fullname: name,
      email: email.toLowerCase(),
      role: role || "employee", // Default to employee if not specified
      manager: managerId || null,
      country,
      password: hashedPassword, // Store hashed password
    });

    await newUser.save();

    // Send password via email
    try {
      await sendResetPasswordEmail({ email: newUser.email, Fullname: newUser.Fullname, newPassword: plainPassword });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Optionally roll back user creation or notify admin
      return res.status(500).json({ success: false, message: "User created but failed to send email" });
    }

    res.status(201).json({
      success: true,
      message: "User created & password sent via email!",
      user: {
        id: newUser._id,
        name: newUser.Fullname,
        email: newUser.email,
        role: newUser.role,
        manager: newUser.manager,
        country: newUser.country,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Get all users
export async function getUsers(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can view users" });
    }

    const users = await User.find().select("-password"); // Exclude password from response
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Update user
export async function updateUser(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can update users" });
    }

    const { id } = req.params;
    const { name, role, managerId, email, country } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update fields if provided
    if (name) user.Fullname = name;
    if (email) user.email = email.toLowerCase();
    if (role) user.role = role;
    if (managerId) user.manager = managerId;
    if (country) user.country = country;

    await user.save();
    res.status(200).json({ success: true, message: "User updated", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Delete user
export async function deleteUser(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can delete users" });
    }

    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}