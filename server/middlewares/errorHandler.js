function errorHandler(err, req, res, next) {
  if (!err.status) {
    console.error(err);
    err = { status: 500 };
  }
  res.status(err.status);
  res.json(err).end();
}

module.exports = errorHandler;
