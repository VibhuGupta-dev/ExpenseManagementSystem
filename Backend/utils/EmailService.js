import nodemailer from "nodemailer";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Test function to verify connection
  export const testEmailConnection = async () => {
    try {
      console.log("Testing email connection with user:", process.env.EMAIL_USER);
      console.log("Password (masked):", process.env.EMAIL_PASS.substring(0, 4) + "****");
      let info = await transporter.verify();
      console.log("Email server is ready:", info);
      return true;
    } catch (error) {
      console.error("Email connection test failed:", error);
      throw error;
    }
  };

  export const sendResetPasswordEmail = async ({ email, Fullname, newPassword }) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your New Admin Password",
      html: `<p>Dear ${Fullname},</p><p>Your new admin password is: <strong>${newPassword}</strong>. Please log in and change it for security.</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  };