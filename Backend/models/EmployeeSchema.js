import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["employee", "manager", "admin"],
      default: "employee",
    },
    department: {
      type: String,
      default: "General",
    },
    // optional fields
    phone: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password match method
employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const EmployeeModel = mongoose.model("Employee", employeeSchema);

export default EmployeeModel;
