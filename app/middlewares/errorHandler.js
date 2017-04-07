const logger = require('../services/logger')

const errorHandler = (err, req, res, next) => {
  if (!err.status) {
    logger.error({type: 'Internal Error', error: err})
    err = {
      content: 'Internal error',
      status: 500
    }
  }
  res.setResponse(err, err.status)
  next()
}

module.exports = errorHandler
