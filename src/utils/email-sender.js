// const {Resend} = require("resend");
// const { HttpException } = require("../exceptions/exception");

// const resendApiKey = process.env.RESEND_API_KEY;
// const resend = new Resend(resendApiKey);

// async function sendEmail(emails, subject, html) {
//     resend.emails.send({
//         from: 'Acme <onboarding@resend.dev>',
//         to: ["itsvuong0806@gmail.com"],
//         subject: subject,
//         html: html,
//     }).then(data => {
//         console.log(data);
//     })
//         .catch(error => { throw error })
// }
//====================================================================
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_APP_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const sendEmail = async (receiverEmail, subject, content) => {
    try {
        const options = {
            from: "TESTING <vendtech@gmail.com>", // sender address
            to: receiverEmail,
            subject: subject,
            html: content
        }

        const info = await transporter.sendMail(options);
        return info;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = sendEmail;