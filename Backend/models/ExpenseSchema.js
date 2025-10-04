import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  name: { type: String, required: true }, // Employee name
  description: { type: String, required: true },
  billDate: { type: Date, required: true },
  category: { type: String, required: true, enum: ["Travel", "Food", "Supplies", "Other"] },
  paidBy: { type: String, required: true },
  remarks: { type: String },
  amount: { type: Number, required: true, min: 0 },
  receipt: { type: String }, // Path to uploaded receipt
  status: {
    type: String,
    enum: ["Draft", "Pending", "Approved", "Rejected", "Completed"],
    default: "Draft"
  },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, // Manager who approved/rejected
  approvalDate: { type: Date },
  comments: { type: String }, // Manager's comments
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Expense", expenseSchema);