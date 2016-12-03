const nodemailer = require('nodemailer');
const config = require('../config');

function sendMail(emailInfo) {
    nodemailer.createTransport(config.email).sendMail(emailInfo, (error) => {
        if (error) {
            console.error(error.response);
        }
    });
}

module.exports = sendMail;
