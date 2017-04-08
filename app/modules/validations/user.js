const q = require('q');

const validateRequired = (userToValidate) => {
  if (!userToValidate || !userToValidate.username || !userToValidate.password) {
    return q.reject({ status: 400, content: 'You must send the username and the password' });
  }
  return q.resolve(userToValidate.username);
};

const validateToInsert = (user) => {
  if (user) {
    return q.reject({ status: 400, content: 'A user with that username already exists' });
  }
  return q.resolve();
};

const validateToLogin = (user) => {
  if (!user) {
    return q.reject({ status: 401, content: 'User not found' });
  }
  return q.resolve(user);
};

module.exports = {
  validateRequired,
  validateToInsert,
  validateToLogin,
};
