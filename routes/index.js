const router = require('express').Router();
const { celebrate, Joi, validator } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const {
  createUser, loginUser, getUserInfo, updateUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), loginUser);
router.get('/users/me', auth, getUserInfo);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), auth, updateUser);
router.get('/movies', auth, getMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле заполнено неккоректно');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле заполнено неккоректно');
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле заполнено неккоректно');
    }),
    movieId: Joi.number().required(),
  }),
}), auth, createMovie);
router.delete('/movies/movieId', celebrate({
  body: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), auth, deleteMovie);
router.use('*', auth, require('./pageNotFound'));

module.exports = router;
