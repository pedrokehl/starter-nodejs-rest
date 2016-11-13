module.exports = function (app) {
    const validateToken = app.controllers.authentication.validateToken;
    const exampleController = app.controllers.exampleController;

    app.routes.get('/protected', validateToken, exampleController.protected);
    app.routes.get('/unprotected', exampleController.unprotected);
};