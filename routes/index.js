const router = require('express').Router();
const auth = require('../middlewares/auth');

router.use('/', require('./users'));
router.use('/', require('./movies'));
router.use('*', auth, require('./pageNotFound'));

module.exports = router;
