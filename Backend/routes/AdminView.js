import express from "express";
import addUser from "../controller/AdminView.js"
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/addUser", addUser)

export default router;