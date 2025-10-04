import express, { urlencoded } from "express";
import authRoutes from "./routes/AuthRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

// Start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});