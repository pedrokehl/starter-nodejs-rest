function validateRequired(userToValidate) {
    if (!userToValidate || !userToValidate.username || !userToValidate.password) {
        return Promise.reject({ status: 400, content: 'You must send the username and the password' });
    }

    return Promise.resolve(userToValidate.username);
}

function validateToInsert(user) {
    if (user) {
        return Promise.reject({ status: 400, content: 'A user with that username already exists' });
    }
    return Promise.resolve();
}

function validateToLogin(user) {
    if (!user) {
        return Promise.reject({ status: 401, content: 'User not found' });
    }
    return Promise.resolve(user);
}

module.exports = {
    validateRequired,
    validateToInsert,
    validateToLogin
};
