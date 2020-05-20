const router = require('express').Router();
const controller = require('./rating.controller');
const { isOwner } = require('./rating.middleware');

router.get('/:userId/:storyId', controller.getOne);
router.put('/:userId/:storyId', controller.update);
router.put('/:userId/:storyId/:id', isOwner, controller.update);
router.delete('/:id', isOwner, controller.remove);

module.exports = router;
