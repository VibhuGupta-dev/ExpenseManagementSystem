import ExpenseModel from "../models/ExpenseSchema.js";
import EmployeeModel from "../models/EmployeeSchema.js";
import multer from "multer";
import path from "path";

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/receipts"); // Ensure this folder exists
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
    const expenses = await ExpenseModel.find({ employee: req.user.id })
      .sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Submit new expense with draft status
export const submitExpense = async (req, res) => {
  try {
    const { name, description, billDate, category, paidBy, remarks, amount } = req.body;
    const employee = await EmployeeModel.findById(req.user.id);

    if (!name || !description || !billDate || !category || !paidBy || !amount) {
      return res.status(400).json({ message: "All fields except remarks are required" });
    }

    const newExpense = new ExpenseModel({
      employee: req.user.id,
      name: employee.Fullname, // Use employee's full name
      description,
      billDate: new Date(billDate),
      category,
      paidBy,
      remarks,
      amount: parseFloat(amount),
      receipt: req.file ? req.file.path : null,
      status: "Draft" // Initial status
    });

    await newExpense.save();
    res.status(201).json({ message: "Expense saved as draft", expense: newExpense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Submit draft to pending (separate endpoint)
export const submitToPending = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expense = await ExpenseModel.findOne({ _id: expenseId, employee: req.user.id, status: "Draft" });

    if (!expense) {
      return res.status(404).json({ message: "Draft expense not found or not authorized" });
    }

    expense.status = "Pending";
    await expense.save();
    res.json({ message: "Expense submitted for approval", expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};