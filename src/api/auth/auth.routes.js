let router = require('express').Router();
let controller = require('./auth.controller');

router.get('/verifyEmail/:token', controller.verifyEmail);
router.get('/resendEmail/:email', controller.resendEmail);
router.get('/lostPassword/:email', controller.lostPasswordEmail);
router.put('/recoverPassword/:email/:token', controller.recoverPasswordRequest);
router.get('/checkToken', controller.checkToken);
router.post('/authenticate', controller.authenticate);
router.post('/register', controller.register);

module.exports = router;

