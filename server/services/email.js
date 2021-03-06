const config = require('../config');
const fs = require('fs');
const nodemailer = require('nodemailer');
const logger = require('./logger');

const templates = [];

function getTemplate(templateName) {
    return templates.find(element => element.filename === templateName);
}

function setTemplate(folder, filename, transporter) {
    fs.readFile(folder + filename, 'utf8', (errFile, data) => {
        const template = { html: data };
        const defaults = { from: '"Starter NODE.js REST" <starter.nodejs.rest@gmail.com>' };

        const templateSender = transporter.templateSender(template, defaults);

        templates.push({
            filename,
            templateSender
        });
    });
}

function init() {
    const templatesFolder = './server/templates/';
    const transporter = nodemailer.createTransport(config.email);

    fs.readdir(templatesFolder, (errDir, files) => {
        files.forEach((file) => {
            setTemplate(templatesFolder, file, transporter);
        });
    });
}

function sendMail(emailConfig, emailData, templateName) {
    getTemplate(templateName).templateSender(emailConfig, emailData, (error) => {
        if (error) {
            logger.error(error.response);
        }
    });
}

module.exports = {
    init,
    sendMail
};
