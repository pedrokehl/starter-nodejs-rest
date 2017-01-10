const tokenService = require('../services/token');

function validateRequest(req, res, next) {
  tokenService.validateToken(req)
      .then(next)
      .catch(next);
}

function validateAndRefresh(req, res, next) {
  tokenService.validateToken(req).then(() => {
    res.header('authorization', tokenService.createToken({ username: req.decoded.username }));
    next();
  }).catch(next);
}

module.exports = {
  validateAndRefresh,
  validateRequest
};
