const   nodemailer = require('nodemailer'),
        config = require('../config');

module.exports = sendEmail;

function sendEmail(emailInfo) {
    nodemailer.createTransport(config.email).sendMail(emailInfo, (error) => {
        if(error){
            console.log(error.response);
        }
    })
}