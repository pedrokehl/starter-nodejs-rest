module.exports = function (app) {
    const exampleController = app.controllers.exampleController;
    app.routes.get('/protected', app.validateToken, exampleController.protected);
    app.routes.get('/unprotected', exampleController.unprotected);
};