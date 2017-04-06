const logger = require('../services/logger')

function first(req, res, next) {
  req.start = new Date()

  res.setResponse = (json, status = 200) => {
    req.used = true;
    res.content = {
      json,
      status
    }
  }
  next()
}

function last(req, res) {
  if (!req.used) {
    res.status(404)
  }
  else {
    res.status(res.content.status)
    res.json(res.content.json)
    logger.saveRequest(req, res)
  }
  res.end()
}

module.exports = {
  first,
  last
}
