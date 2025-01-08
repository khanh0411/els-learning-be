const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
// Tạo transporter - chứa thông tin SMTP của Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Email của bạn
    pass: process.env.PASSWORD          // Mật khẩu tài khoản Gmail
  }
});



const sendEmail = async (sendTo, url, name, subject) => {
  const mailOptions = {
    from: 'KLearnPro Team',
    to: sendTo,
    subject: subject,
    text: 'Đây là nội dung email dạng văn bản.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      text-align: center;
      margin-bottom: 20px;
    }
    .email-header img {
      max-width: 150px;
    }
    .email-content {
      padding: 10px 0;
    }
    .email-footer {
      text-align: center;
      margin-top: 20px;
      font-size: 0.8em;
      color: #666666;
    }
    .button {
      display: inline-block;
      background-color: #007BFF;
      color: #ffffff;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 1em;
    }
    .button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="email-content">
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. You can reset your password by clicking the button below:</p>
      <p style="text-align: center;">
        <a href="${url}" class="button">Reset Password</a>
      </p>
      <p>If you did not request a password reset, please ignore this email or reply to let us know.</p>
      <p>Best regards,</p>
      <p>The KLearnPro Team</p>
    </div>
    <div class="email-footer">
      <p>&copy; 2025 KLearnPro. All rights reserved.</p>
      <p>This is an automated email. Please do not reply to this address.</p>
    </div>
  </div>
</body>
</html>`
  };

  console.log(mailOptions.html)
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        
        resolve(info.response);
      }
    });
  });
};
module.exports = sendEmail;

