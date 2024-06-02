const nodemailer = require('nodemailer');
dotenv = require("dotenv").config();

module.exports = async (email, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASSWORD,
            }
        });

        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: subject,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error(error);
        console.log('Email not sent');
    }
}