import express from "express";
import { createApprovalRule, getAllApprovalRules, updateApprovalRule, deleteApprovalRule } from "../controller/AprovalRuleController.js"; // Fixed typo
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes with admin middleware
router.use(authMiddleware);

// CRUD Routes
router.post("/rules", createApprovalRule);
router.get("/rules", getAllApprovalRules);
router.put("/rules/:id", updateApprovalRule);
router.delete("/rules/:id", deleteApprovalRule);

export default router;