const path = require('path');
const fs = require('fs');
const nodemailer = require("nodemailer");
const { email: emailConfig } = require('../../src/config');

const templatePath = path.join(__dirname, 'email-template.html');
const template = fs.readFileSync(templatePath).toString();

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

function parseSubject(options) {
    // TODO: parse subject
    return `Welcome to Rigamo, ${options.name}`;
}

function parseTemplate({ token }) {
    const url = `${emailConfig.redirectHost}/verify/${token}`;
    return template
        .replace('{{url}}', url);
}

async function sendEmail(options) {
    const mailOptions = {
        from: `${emailConfig.from} <${emailConfig.email}>`,
        to: options.destination,
        subject: parseSubject(options),
        html: parseTemplate(options),
    };
    console.log('Sending email...');
    try {
        await transport.sendMail(mailOptions);
        console.log(`Email verification sent to: ${options.destination}`);
        transport.close();
    } catch (e) {
        console.log(e);
    }
}

module.exports = sendEmail;
