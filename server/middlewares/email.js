const nodemailer = require('nodemailer');
const config = require('../config');
const fs = require('fs');

const templates = [];

function getTemplate(templateName) {
  return templates.find(element => element.filename === templateName);
}

function setTemplate(folder, filename, transporter) {
  fs.readFile(folder + filename, 'utf8', (errFile, data) => {
    const templateSender = transporter.templateSender(
            { html: data },
            { from: '"Starter NODE.js REST" <starter.nodejs.rest@gmail.com>' }
        );

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
      console.error(error.response);
    }
  });
}

module.exports = {
  init,
  sendMail
};
