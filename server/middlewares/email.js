var nodemailer = require('nodemailer'),
    config = require('../config');

module.exports = sendEmail;

function sendEmail(emailInfo) {
    nodemailer.createTransport(config.email).sendMail(emailInfo, function(error) {
        if(error){
            console.log(error.response);
        }
    })
}