const router = require('express').Router();
const controller = require('./story.controller');

router.get('/', controller.get);
router.post('/', controller.create);
router.get('/:email', controller.getOne);
router.put('/:email', controller.update);
router.delete('/:email', controller.remove);

module.exports = router;
