import express from "express";
import {
  getPendingExpenses,
  updateExpenseStatus,
  getAllExpenses
} from "../controller/ManagerView.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

// Only managers/admins should access these routes (optional role check middleware can be added)
router.get("/pending", getPendingExpenses);
router.put("/update/:expenseId", updateExpenseStatus);
router.get("/all", getAllExpenses);

export default router;
