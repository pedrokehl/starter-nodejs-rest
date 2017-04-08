const nodemailer = require('nodemailer');
const logger = require('./logger');
const config = require('../../config');

let clientIsValid = false;

const transporter = nodemailer.createTransport(config.email);

const init = () => {
  transporter.verify((error) => {
    if (error) {
      clientIsValid = false;
      logger.error(`fail to collect mail server，retry after 1 hour', ${error}`);
      setTimeout(init, 1000 * 60 * 60);
    } else {
      clientIsValid = true;
      logger.info('collect to mail server successful');
    }
  });
};

function sendMail(mailOptions) {
  if (!clientIsValid) {
    logger.error('fail to collect mail server, cannot send the mail');
    return false;
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return logger.error(error);
    return logger.info(`Message ${info.messageId} sent: ${info.response}`);
  });
  return true;
}


module.exports = {
  init,
  sendMail,
};
