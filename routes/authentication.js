module.exports = function (app) {
    const authentication = app.controllers.authentication;
    app.routes.post('/login', authentication.login);
    app.routes.post('/register', authentication.register);
};