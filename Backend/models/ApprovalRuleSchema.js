import mongoose from "mongoose";

const approvalRuleSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  approvers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // References managers or other approvers in sequence order
  }],
  minApprovalPercentage: {
    type: Number,
    required: true,
    min: 81 // Must be above 80%
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true // Admin who created the rule
  }
}, {
  timestamps: true
});

export default mongoose.model("ApprovalRule", approvalRuleSchema);