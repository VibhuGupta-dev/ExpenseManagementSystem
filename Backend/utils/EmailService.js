import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email server connection failed:", error);
  } else {
    console.log("Email server is ready:", success);
  }
});

export const sendResetPasswordEmail = async ({ email, Fullname, newPassword }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // ✅ must match Gmail account
    to: email,
    subject: "Your New Admin Password",
    html: `<p>Dear ${Fullname},</p>
           <p>Your new admin password is: <strong>${newPassword}</strong>. 
           Please log in and change it for security.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};
