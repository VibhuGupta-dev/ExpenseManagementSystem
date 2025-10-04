import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetPasswordEmail = async ({ email, Fullname, newPassword }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your New Admin Password",
    html: `<p>Dear ${Fullname},</p><p>Your new admin password is: <strong>${newPassword}</strong>. Please log in and change it for security.</p>`,
  };

  await transporter.sendMail(mailOptions);
};