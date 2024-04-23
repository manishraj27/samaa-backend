const nodemailer = require('nodemailer');

module.exports = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: 'samaavibes@gmail.com',
                pass: 'aqfn syja obna qnhx'
            }
        });

        const mailOptions = {
            from: 'samaavibes@gmail.com',
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