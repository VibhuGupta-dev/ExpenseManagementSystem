import express, { urlencoded } from "express";
  import authRoutes from "./routes/AuthRoutes.js";
  import addUser from "./routes/AdminView.js";
  import employeeRoutes from "./routes/EmployeeRoute.js";
  import managerRoutes from "./routes/ManagerRoute.js";
  import { config } from "dotenv";
  import connectDB from "./config/mongoose-connection.js";
  import cookieParser from "cookie-parser";
  import cors from "cors";
  

  // Load environment variables
  config();
  console.log("Loaded Environment Variables:");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS (masked):", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 4) + "" : "undefined");
  console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

  const app = express();

  // Connect to MongoDB
  connectDB();

  // Test email connection
  

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", addUser);
  app.use("/api/employee", employeeRoutes);
  app.use("/api/manager", managerRoutes);


  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  });

  // Handle 404
  app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} at ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}`);
  });