const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходимо авторизоваться');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    const error = new AuthError('Необходимо авторизоваться');
    next(error);
  }
  req.user = payload;
  next();
};
