module.exports = function (app) {
    var exampleController = app.controllers.exampleController;
    app.routes.get('/protected', app.token.validateAndRefresh, exampleController.protected);
    app.routes.get('/unprotected', exampleController.unprotected);
};