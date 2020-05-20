const router = require('express').Router();
const controller = require('./option.controller');
const { isOwner } = require('../common/base.middleware');
const Story = require('../../models/story').model;
const Sequence = require('../../models/sequence').model;
const { isStoryPublished } = require('../story/story.middleware');

const findByCb = (req) => ({ _id: req.params.story });

const isStoryOwner = isOwner(
    Story,
    findByCb,
    'story',
);

const isSequenceOwner = isOwner(
    Sequence,
    (req) => ({ _id: req.params.sequence }),
    'story',
);


router.post(
    '/many/:sequence',
    isSequenceOwner,
    isStoryPublished(findByCb),
    controller.createMany,
);
router.get(
    '/story/:story',
    isStoryOwner,
    controller.getAllStoryOptions,
);
router.get(
    '/:sequence',
    isSequenceOwner,
    controller.get,
);
router.post(
    '/:sequence',
    isSequenceOwner,
    isStoryPublished(findByCb),
    controller.create,
);
router.get(
    '/:sequence/:id',
    isSequenceOwner,
    controller.getOne,
);
router.put(
    '/:sequence/:id',
    isSequenceOwner,
    isStoryPublished(findByCb),
    controller.update,
);
router.delete(
    '/:sequence/:id',
    isSequenceOwner,
    isStoryPublished(findByCb),
    controller.remove,
);

module.exports = router;
