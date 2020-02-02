const path = require('path');
const fs = require('fs');
const { email: emailConfig } = require('../../../src/config');

const template = fs.readFileSync(
    path.join(__dirname, 'verify-email.html')
).toString();

function parseSubject(options) {
    // TODO: parse subject
    return `Welcome to Rigamo, ${options.name}`;
}

function parseTemplate({ token }) {
    const url = `${emailConfig.redirectHost}/verify/${token}`;
    return template
        .replace('{{url}}', url);
}

const sendEmailVerifyEmail = sendEmail => options => {
    const mailOptions = {
        from: `${emailConfig.from} <${emailConfig.email}>`,
        to: options.destination,
        subject: parseSubject(options),
        html: parseTemplate(options),
    };
    console.log(`Email verification sent to: ${options.destination}`);
    sendEmail(mailOptions);
};

module.exports = {
    sendEmailVerifyEmail
};
