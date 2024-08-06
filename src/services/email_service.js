// emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or any other email service you use
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587, secure: false,
//   auth: {
//     user: `${process.env.Slug_Project_Gmail_User}`,
//     pass: `${process.env.Slug_Project_Gmail_Pass}`,
//   },
// });

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Failed to send email: ' + error.message);
  }
};

module.exports = sendEmail;