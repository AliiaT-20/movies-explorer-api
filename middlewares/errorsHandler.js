const errorsHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  return res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  // eslint-disable-next-line no-unreachable
  next();
};

module.exports = { errorsHandler };
