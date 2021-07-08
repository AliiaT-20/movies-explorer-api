const Movie = require('../models/movie');
const ValidationError = require('../errors/validation-err');
const CastError = require('../errors/cast-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданны некорректные данные фильма');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findOneAndRemove({ movieId: req.params.movieId })
    .then((movie) => {
      if (movie === null) {
        throw new CastError('Фильм с указанным _id не найден');
      } else if (movie.owner !== req.user._id) {
        throw new ForbiddenError('Вы можете удалить только свой фильм');
      } else {
        res.send({ data: movie });
      }
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        const error = new CastError('Карточка с указанным _id не найдена');
        next(error);
      } else {
        next(err);
      }
    });
};
