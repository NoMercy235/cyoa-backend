const nodemailer = require("nodemailer");
const { email: emailConfig } = require('../../src/config');

const { sendEmailVerifyEmail } = require('./verify-email/verify-email');
const { resetPasswordTokens, sendForgotPasswordEmail } = require('./forgot-password/forgot-password');

const transport = nodemailer.createTransport({
    service: emailConfig.service,
    port: emailConfig.port,
    secure: false,
    requireTLS: true,
    tls: true,
    auth: {
        user: emailConfig.email,
        pass: emailConfig.password
    }
});

async function sendEmail(mailOptions) {
    console.log('Sending email...');
    try {
        await transport.sendMail(mailOptions);
        transport.close();
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    sendEmailVerifyEmail: sendEmailVerifyEmail(sendEmail),
    sendForgotPasswordEmail: sendForgotPasswordEmail(sendEmail),
    resetPasswordTokens
};
