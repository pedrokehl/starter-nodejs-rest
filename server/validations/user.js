function validateRequired(userToValidate) {
    if (!userToValidate || !userToValidate.username || !userToValidate.password) {
        return Promise.reject({ status: 400, content: 'You must send the username and the password' });
    }

    return Promise.resolve(userToValidate);
}

function validateToLogin(user) {
    if (!user) {
        return Promise.reject({ status: 401, content: 'User not found' });
    }
    return Promise.resolve(user);
}

module.exports = {
    validateRequired,
    validateToLogin
};
