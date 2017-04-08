const url = require('url');
const crypt = require('../../services/crypt');
const email = require('../../services/email');
const tokenService = require('../../services/token');
const userRepository = require('../../modules/repositories/user');
const userValidation = require('../../modules/validations/user');

const checkReset = (req, res, next) => {
  userRepository.findByUsername(req.params.username)
    .then(userValidation.validateToLogin)
    .then(userFound => tokenService.validateToken(req, userFound.password))
    .then(() => {
      res.setResponse({ message: 'Check Reset successful', status: 200 });
      next();
    })
    .catch(next);
};

const forgot = (req, res, next) => {
  const user = { email: req.body.email };
  if (!user.email) {
    next({ status: 400, content: 'You must send the email' });
    return;
  }
  userRepository.findOne(user).then((userFound) => {
    if (!userFound) {
      next({ status: 400, content: 'The user is not found' });
      return;
    }
    const token = tokenService.createToken({ username: userFound.username }, 86400, userFound.password);
    const recoveryUrl = url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: `reset/${userFound.username}/${token}`,
    });
    const emailConfig = {
      from: '"Void Four👻" <tigaly@qq.com>',
      to: user.email,
      subject: '[Starter] - Recover your password',
      html: `<a href="${recoveryUrl}" target="_blank">Click here to recover your account.</a>`,
    };
    email.sendMail(emailConfig);
    res.setResponse({ message: 'Send reset mail successful', status: 200 });
    next();
  }).catch(next);
};

const login = (req, res, next) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };
  userValidation.validateRequired(user)
    .then(userRepository.findByUsername)
    .then(userValidation.validateToLogin)
    .then(userFound => crypt.compare(user.password, userFound.password))
    .then(() => {
      res.header('authorization', tokenService.createToken({ username: user.username }));
      res.setResponse({ message: 'login sucessful' , status: 200 });
      next();
    })
    .catch(next);
};

const register = (req, res, next) => {
  const user = req.body;
  userValidation.validateRequired(user)
    .then(userRepository.findByUsername)
    .then(userValidation.validateToInsert)
    .then(() => crypt.hash(user.password))
    .then((hash) => {
      user.password = hash;
      return userRepository.insert(user);
    })
    .then(() => {
      res.header('authorization', tokenService.createToken({ username: user.username }));
      res.setResponse({ message: 'user created', status: 201 });
      if (user.email) {
        const emailConfig = {
          from: '"Void Four👻" <tigaly@qq.com>',
          to: user.email,
          subject: `[Starter] - Welcome ${user.username}`,
          html: `<p>Welcome ${user.username}.</p>`,
        };
        email.sendMail(emailConfig);
      }
      next();
    })
    .catch(next);
};

const reset = (req, res, next) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  userValidation.validateRequired(user)
    .then(userRepository.findByUsername)
    .then(userValidation.validateToLogin)
    .then(userFound => tokenService.validateToken(req, userFound.password))
    .then(() => crypt.hash(user.password))
    .then(hashResult => userRepository.update({ username: user.username }, { password: hashResult }))
    .then(() => {
      res.setResponse();
      next();
    })
    .catch(next);
};

module.exports = {
  checkReset,
  forgot,
  login,
  register,
  reset,
};
