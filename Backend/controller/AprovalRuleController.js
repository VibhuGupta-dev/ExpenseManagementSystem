import ApprovalRule from "../models/ApprovalRuleSchema.js";

// Create new approval rule (POST)
export const createApprovalRule = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can create approval rules" });
    }

    const { description, approvers, minApprovalPercentage } = req.body;

    // Validation
    if (!description || !approvers || approvers.length === 0 || !minApprovalPercentage) {
      return res.status(400).json({ success: false, message: "Description, approvers, and minApprovalPercentage are required" });
    }

    if (minApprovalPercentage < 81) {
      return res.status(400).json({ success: false, message: "Minimum approval percentage must be above 80%" });
    }

    const newRule = new ApprovalRule({
      description,
      approvers, // Array of User IDs in sequence order
      minApprovalPercentage,
      createdBy: req.user._id // Admin ID
    });

    await newRule.save();

    res.status(201).json({ success: true, message: "Approval rule created", rule: newRule });
  } catch (error) {
    console.error("Error creating approval rule:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all approval rules (GET)
export const getAllApprovalRules = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can view approval rules" });
    }

    const rules = await ApprovalRule.find().populate("approvers", "Fullname email role").populate("createdBy", "Fullname email");

    res.status(200).json({ success: true, rules });
  } catch (error) {
    console.error("Error fetching approval rules:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update approval rule (PUT)
export const updateApprovalRule = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can update approval rules" });
    }

    const { id } = req.params;
    const { description, approvers, minApprovalPercentage } = req.body;

    const rule = await ApprovalRule.findById(id);
    if (!rule) {
      return res.status(404).json({ success: false, message: "Approval rule not found" });
    }

    // Update fields if provided
    if (description) rule.description = description;
    if (approvers) rule.approvers = approvers;
    if (minApprovalPercentage) {
      if (minApprovalPercentage < 81) {
        return res.status(400).json({ success: false, message: "Minimum approval percentage must be above 80%" });
      }
      rule.minApprovalPercentage = minApprovalPercentage;
    }

    await rule.save();

    res.status(200).json({ success: true, message: "Approval rule updated", rule });
  } catch (error) {
    console.error("Error updating approval rule:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete approval rule (DELETE)
export const deleteApprovalRule = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can delete approval rules" });
    }

    const { id } = req.params;

    const rule = await ApprovalRule.findByIdAndDelete(id);
    if (!rule) {
      return res.status(404).json({ success: false, message: "Approval rule not found" });
    }

    res.status(200).json({ success: true, message: "Approval rule deleted" });
  } catch (error) {
    console.error("Error deleting approval rule:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};