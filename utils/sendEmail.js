const nodemailer = require('nodemailer');
dotenv = require("dotenv").config();

module.exports = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: 'process.env.SMTP_USER',
                pass: 'process.env.SMTP_PASS'
            }
        });

        const mailOptions = {
            from: 'process.env.SMTP_USER',
            to: email,
            subject: subject,
            text: text
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error(error);
        console.log('Email not sent');
    }
}