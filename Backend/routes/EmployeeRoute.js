import express from "express";
import { getProfile, getExpenses, submitExpense, upload } from "../controllers/EmployeeView.js";
import authenticateToken from "../middlewares/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/profile", getProfile);
router.get("/expenses", getExpenses);

// Submit expense with receipt
router.post("/expenses", upload.single("receipt"), submitExpense);

export default router;
