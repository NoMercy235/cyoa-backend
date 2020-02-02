const path = require('path');
const fs = require('fs');
const { email: emailConfig, lostPasswordTokenExpiry } = require('../../../src/config');

const template = fs.readFileSync(
    path.join(__dirname, 'forgot-password-template.html')
).toString();

const resetPasswordTokens = {};

setInterval(() => {
    console.log('Clearing lost password tokens...');
    const now = new Date().getTime();
    let noOfClears = 0;
    Object.entries(resetPasswordTokens).forEach(([key, value]) => {
        if ((now - value.time) > lostPasswordTokenExpiry) {
            delete resetPasswordTokens[key];
            noOfClears ++;
        }
    });
    console.log(`Cleared ${noOfClears} tokens`);
}, lostPasswordTokenExpiry);

function parseTemplate({ destination, token }) {
    const url = `${emailConfig.redirectHost}/recover/${destination}/${token}`;
    return template
        .replace('{{url}}', url);
}

const sendForgotPasswordEmail = sendEmail => options => {
    const mailOptions = {
        from: `${emailConfig.from} <${emailConfig.email}>`,
        to: options.destination,
        subject: 'Password reset',
        html: parseTemplate(options),
    };
    sendEmail(mailOptions);
    console.log(`Email verification sent to: ${options.destination}`);
    resetPasswordTokens[options.destination] = {
        token: options.token,
        time: new Date().getTime(),
    }
};

module.exports = {
    sendForgotPasswordEmail,
    resetPasswordTokens,
};
