'use strict';
const   nodemailer = require('nodemailer'),
        config = require('../config');

module.exports = sendMail;

function sendMail(emailInfo) {
    nodemailer.createTransport(config.email).sendMail(emailInfo, (error) => {
        if(error){
            console.log(error.response);
        }
    })
}