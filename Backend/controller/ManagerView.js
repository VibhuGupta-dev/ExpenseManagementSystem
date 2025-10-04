import ExpenseModel from "../models/ExpenseSchema.js";

// Get all pending expenses for manager
export const getPendingExpenses = async (req, res) => {
  try {
    const expenses = await ExpenseModel.find({ status: "Pending" })
      .populate("employee", "Fullname email department");
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve or reject an expense
export const updateExpenseStatus = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { status, comments } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const expense = await ExpenseModel.findById(expenseId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // Check if manager is authorized (e.g., based on approval rules or hierarchy)
    // This is a basic check; enhance with approval rules logic if needed
    expense.status = status === "Approved" ? "Completed" : "Rejected";
    expense.manager = req.user.id;
    expense.approvalDate = new Date();
    expense.comments = comments || "";
    await expense.save();

    res.json({ message: `Expense ${status.toLowerCase()} successfully`, expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all expenses (for history)
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await ExpenseModel.find()
      .populate("employee", "Fullname email department")
      .populate("manager", "Fullname email");
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};