require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const { errorsHandler } = require('./middlewares/errorsHandler');
const limiter = require('./middlewares/limiter');

const { PORT = 3000, NODE_ENV, MONGO_URL } = process.env;
const app = express();

const allowedCors = [
  'https://aliiat.diplom.nomoredomains.club',
  'http://aliiat.diplom.nomoredomains.club',
  'http://localhost:3000',
];

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use((req, res, next) => {
  cors({
    origin: allowedCors,
    credentials: true,
  });
  next();
});

app.use(limiter);

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
