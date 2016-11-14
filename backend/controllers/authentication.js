const   bcrypt = require('bcryptjs'),
        jwtValidation = require('../core/jwt'),
        userRepository = require('../repositories/user');

module.exports = {
    login: login,
    register: register
};

function login(req, res) {
    var user = req.body;

    if (!user.username || !user.password) {
        return res.status(400).send({
            errorMessage: "You must send the username and the password"
        });
    }

    userRepository.findOne(user).then(function(userFound) {
        if (!userFound) {
            res.status(400).send({
                errorMessage: 'User not found'
            });
        }
        else if (bcrypt.compareSync(user.password, userFound.password)) {
            res.status(200).send({
                token: jwtValidation.createToken(user.username)
            });
        }
        else {
            res.status(400).send({
                errorMessage: 'Invalid Password'
            });
        }
    });
}

function register(req, res) {
    var user = req.body;

    if (!user.username || !user.password) {
        return res.status(400).send({
            errorMessage: "You must send the username and the password"
        });
    }

    userRepository.findOne(user).then(function(result) {
        if(result) {
            return res.status(400).send({
                errorMessage: 'A user with that username already exists'
            });
        }

        user.password = bcrypt.hashSync(user.password, 5);

        userRepository.insert(user).then(function() {
            res.status(201).send({
                token: jwtValidation.createToken(user.username)
            });
        });
    });
}