const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const MongoError = require('../errors/mongo-err');
const ValidationError = require('../errors/validation-err');
const AuthError = require('../errors/auth-err');
const CastError = require('../errors/cast-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.send({
      data: {
        name: user.name,
        email: user.email,
      },
    }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'MongoError' && err.code === 11000) {
        const error = new MongoError('Пользователь с таким e-mail уже существует');
        next(error);
      } else if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданны некорректные данные пользователя');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      const error = new AuthError('Невозможно авторизоваться');
      next(error);
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Вы не авторизованы'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new CastError('Пользователь с указанным _id не найден');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name: name.toString(), about: email.toString() })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданны некорректные данные пользователя');
        next(error);
      } else if (err.name === 'CastError') {
        const error = new CastError('Пользователь с указанным _id не найден');
        next(error);
      } else if (err.name === 'TypeError') {
        const error = new ForbiddenError('Вы можете обновить только свои данные');
        next(error);
      } else {
        next(err);
      }
    });
};
