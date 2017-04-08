const getProtected = (req, res, next) => {
  res.setResponse({ message: 'Great! You have access for this protected endpoint' });
  next();
};

const getUnprotected = (req, res, next) => {
  res.setResponse({ message: 'You have free access for this endpoint' });
  next();
};

module.exports = {
  getProtected,
  getUnprotected,
};
