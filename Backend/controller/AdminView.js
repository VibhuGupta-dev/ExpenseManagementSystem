import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import { sendResetPasswordEmail } from "../utils/EmailService.js";

// Add new user
export default async function addUser (req, res){
  try {
    const { name, role, managerId, email, country } = req.body;

    // Validation
    if (!name || !email || !role || !country) {
      return res.status(400).json({ success: false, message: "Name, email, role, and country are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    // Random password generate
    const plainPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    // Create new user
    const newUser = new User({
      Fullname: name,
      email: email.toLowerCase(),
      role,
      manager: managerId || null,
      country,
      password: plainPassword
    });

    await newUser.save();

    // Send password via email
    try {
      await sendResetPasswordEmail({ email, Fullname: name, newPassword: plainPassword });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Optionally: continue or rollback user creation
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
};
