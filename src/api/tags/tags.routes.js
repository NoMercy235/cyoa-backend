const router = require('express').Router();
const controller = require('./tags.controller');

router.get('/', controller.get);

module.exports = router;
