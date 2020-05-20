const router = require('express').Router();
const controller = require('./sequence.controller');
const { isOwner } = require('../common/base.middleware');
const Story = require('../../models/story').model;

const isStoryOwner = isOwner(
    Story,
    (req) => ({ _id: req.params.story }),
    'author',
);

router.put('/:story/updateOrder', isStoryOwner, controller.updateOrder);
router.get('/:story', isStoryOwner, controller.get);
router.post('/:story', isStoryOwner, controller.create);
router.get('/:story/:id', isStoryOwner, controller.getOne);
router.put('/:story/:id', isStoryOwner, controller.update);
router.delete('/:story/:id', isStoryOwner, controller.remove);

module.exports = router;
