const Movie = require('../models/movie');
const ValidationError = require('../errors/validation-err');

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
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie === null) {
        throw new ValidationError('Фильм с указанным _id не найден');
      }
      return Movie.findByIdAndRemove(req.params.movieId)
        .then((item) => res.send({ data: item }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError('Фильм с указанным _id не найден');
        next(error);
      } else {
        next(err);
      }
    });
};
