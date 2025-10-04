import express from "express";
import addUser from "../controller/AdminView.js";
import getUsers from "../controller/AdminView.js";
import updateUser from "../controller/AdminView.js";
import deleteUser from "../controller/AdminView.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes with admin middleware
router.use(authMiddleware);

// CRUD Operations
router.post("/addUser", addUser);
router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;