const config = require('../../config')
const fs = require('fs')
const nodemailer = require('nodemailer')
const logger = require('./logger')

let clientIsValid = false

const transporter = nodemailer.createTransport(config.email)

const init = () => {
  transporter.verify((error, success) => {
    if (error) {
      clientIsValid = false
      logger.error('fail to collect mail server，retry after 1 hour', error);
      setTimeout(init, 1000 * 60 * 60)
    } else {
      clientIsValid = true
      logger.info('collect to mail server successful')
    }
  })
}

const sendMail = mailOptions => {
  if (!clientIsValid) {
    logger.error('fail to collect mail server, cannot send the mail')
    return false
  }
  mailOptions.from = '"Void Four👻" <tigaly@qq.com>'

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return logger.error(error)
    logger.info('Message %s sent: %s', info.messageId, info.response)
  })
}


module.exports = {
  init,
  sendMail
}
