const {Resend} = require("resend");
const { HttpException } = require("../exceptions/exception");

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

async function sendEmail(emails, subject, html) {
    resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ["itsvuong0806@gmail.com"],
        subject: subject,
        html: html,
    }).then(data => {
        console.log(data);
    })
        .catch(error => { throw error })
}

module.exports = sendEmail;