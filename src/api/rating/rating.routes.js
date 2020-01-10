const router = require('express').Router();
const controller = require('./rating.controller');

router.get('/:userId/:storyId', controller.getOne);
router.put('/:userId/:storyId', controller.update);
router.put('/:userId/:storyId/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
