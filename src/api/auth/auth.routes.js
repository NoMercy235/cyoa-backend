let router = require('express').Router();
let controller = require('./auth.controller');

router.get('/checkToken', controller.checkToken);
router.post('/authenticate', controller.authenticate);
router.post('/register', controller.register);

module.exports = router;

