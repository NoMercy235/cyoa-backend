let router = require('express').Router();
let controller = require('./auth.controller');

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)

// TODO: route middleware to verify a token

router.post('/authenticate', controller.authenticate);
router.post('/register', controller.register);

module.exports = router;

