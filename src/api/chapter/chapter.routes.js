const router = require('express').Router();
const controller = require('./chapter.controller');
const { isOwner } = require('../common/base.middleware');
const Story = require('../../models/story').model;

const findByCb = (req) => ({ _id: req.params.story });

const isStoryOwner = isOwner(
    Story,
    findByCb,
    'author',
);

router.get('/:story', isStoryOwner, controller.get);
router.post('/:story', isStoryOwner, controller.create);
router.get('/:story/:id', isStoryOwner, controller.getOne);
router.put('/:story/:id', isStoryOwner, controller.update);
router.delete('/:story/:id', isStoryOwner, controller.remove);

module.exports = router;
