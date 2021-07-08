const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserInfo, updateUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/users/me', auth, getUserInfo);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = router;
