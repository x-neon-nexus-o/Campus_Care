require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  try {
    const recipientEmail = process.argv[2];
    if (!recipientEmail) {
      console.error('Please provide a recipient email address.');
      console.log('Usage: node testEmail.js <recipient-email@example.com>');
      return;
    }
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'td240430@famt.ac.in', // Replace with a test email
      to: recipientEmail,
      subject: 'Test Email',
      text: 'This is a test email from Nodemailer.',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

testEmail();