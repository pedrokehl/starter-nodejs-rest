module.exports = (app) => {
  const exampleController = app.controllers.exampleController;

  app.routes.get('/protected', app.token.validateAndRefresh, exampleController.getProtected);
  app.routes.get('/unprotected', exampleController.getUnprotected);
};
