const tokenService = require('../services/token');

const validateRequest = (req, res, next) => {
  tokenService.validateToken(req)
    .then(next)
    .catch(next);
};

const validateAndRefresh = (req, res, next) => {
  tokenService.validateToken(req).then(() => {
    res.header('authorization', tokenService.createToken({ username: req.decoded.username }));
    next();
  }).catch(next);
};

module.exports = {
  validateAndRefresh,
  validateRequest,
};
