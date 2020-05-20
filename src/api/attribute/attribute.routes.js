const router = require('express').Router();
const controller = require('./attribute.controller');
const { isOwner } = require('../common/base.middleware');
const Story = require('../../models/story').model;
const { isStoryPublished } = require('../story/story.middleware');

const findByCb = (req) => ({ _id: req.params.story });

const isStoryOwner = isOwner(
    Story,
    findByCb,
    'story',
);

router.get(
    '/:story',
    isStoryOwner,
    controller.get,
);
router.post(
    '/:story',
    isStoryOwner,
    controller.create,
);
router.get(
    '/:story/:id',
    isStoryOwner,
    controller.getOne,
);
router.put(
    '/:story/:id',
    isStoryOwner,
    isStoryPublished(findByCb),
    controller.update,
);
router.delete(
    '/:story/:id',
    isStoryOwner,
    isStoryPublished(findByCb),
    controller.remove,
);

module.exports = router;
