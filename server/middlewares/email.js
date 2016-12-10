const nodemailer = require('nodemailer');
const config = require('../config');
const fs = require('fs');

const templates = [];

function getTemplate(templateName) {
  return templates.find(element => element.filename === templateName);
}

function init() {
  const templatesFolder = './server/templates/';
  const filename = 'recoveryEmail';

  const transporter = nodemailer.createTransport(config.email);

  fs.readFile(templatesFolder + filename + '.html', 'utf8', (err, data) => {
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

function sendMail(emailConfig, emailData, templateName) {
  getTemplate(templateName).templateSender(emailConfig, emailData, (error) => {
    if (error) {
      console.error(error.response);
    }
  });
}

module.exports = {
  getTemplate,
  init,
  sendMail
};
