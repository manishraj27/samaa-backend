const nodemailer = require('nodemailer');

module.exports = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: 'manish027rajsinha@gmail.com',
                pass: 'bkan jkjg zemw wmto'
            }
        });

        const mailOptions = {
            from: 'manish027rajsinha@gmail.com',
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