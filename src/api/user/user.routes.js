const router = require('express').Router();
const controller = require('./user.controller');

router.get('/', controller.get);
router.post('/', controller.create);
router.post('/profilePicture', controller.uploadProfilePicture);
router.get('/getUserWithToken', controller.getUserWithToken);
router.get('/:email', controller.getOne);
router.put('/:email', controller.update);
router.delete('/:email', controller.remove);

module.exports = router;
