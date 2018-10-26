const router = require('express').Router();
const controller = require('./user.controller');

router.get('/', controller.get);
router.post('/', controller.create);
router.get('/get_user_with_token', controller.getUserWithToken);
router.get('/:email', controller.getOne);
router.put('/:email', controller.update);
router.delete('/:email', controller.remove);

module.exports = router;
