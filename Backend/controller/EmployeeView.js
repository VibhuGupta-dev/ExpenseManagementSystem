import ExpenseModel from "../models/ExpenseSchema.js";
import EmployeeModel from "../models/EmployeeSchema.js";
import multer from "multer";
import path from "path";

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/receipts"); // make sure folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

// Get employee profile
export const getProfile = async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.user.id).select("-password");
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get employee expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await ExpenseModel.find({ employee: req.user.id });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Submit new expense with receipt
export const submitExpense = async (req, res) => {
  try {
    const { amount, description } = req.body;
    if (!req.file) return res.status(400).json({ message: "Receipt is required" });

    const newExpense = new ExpenseModel({
      employee: req.user.id,
      amount,
      description,
      receipt: req.file.path,
      status: "Pending",
    });

    await newExpense.save();
    res.status(201).json({ message: "Expense submitted successfully", expense: newExpense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
