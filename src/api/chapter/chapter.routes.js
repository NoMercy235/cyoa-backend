const router = require('express').Router();
const controller = require('./chapter.controller');

router.get('/', controller.get);
router.post('/', controller.create);
router.get('/:id', controller.getOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
