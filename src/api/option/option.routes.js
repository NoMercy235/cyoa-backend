const router = require('express').Router();
const controller = require('./option.controller');

router.post('/many/:sequence', controller.createMany);
router.get('/story/:story', controller.getAllStoryOptions);
router.get('/:sequence', controller.get);
router.post('/:sequence', controller.create);
router.get('/:sequence/:id', controller.getOne);
router.put('/:sequence/:id', controller.update);
router.delete('/:sequence/:id', controller.remove);

module.exports = router;
