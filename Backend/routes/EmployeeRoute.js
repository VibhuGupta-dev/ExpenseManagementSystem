import express from "express";
import { getProfile, getExpenses, submitExpense, submitToPending, upload } from "../controller/EmployeeView.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/profile", getProfile);
router.get("/expenses", getExpenses);

// Submit expense with receipt (draft)
router.post("/expenses", upload.single("receipt"), submitExpense);

// Submit draft to pending
router.put("/expenses/:expenseId/submit", submitToPending);

export default router;