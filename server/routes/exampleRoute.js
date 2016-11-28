module.exports = (app) => {
    let exampleController = app.controllers.exampleController;
    app.routes.get('/protected', app.token.validateAndRefresh, exampleController.protected);
    app.routes.get('/unprotected', exampleController.unprotected);
};