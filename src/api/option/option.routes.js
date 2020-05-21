const router = require('express').Router();
const controller = require('./option.controller');
const { isOwner } = require('../common/base.middleware');
const { isSequenceOwner, isStoryPublishedForSequence } = require('./option.middleware');
const Story = require('../../models/story').model;

const isStoryOwner = isOwner(
    Story,
    (req) => ({ _id: req.params.story }),
    'author',
);

const findByCb = (req) => ({ _id: req.params.sequence });

router.post(
    '/many/:sequence',
    isSequenceOwner(findByCb),
    isStoryPublishedForSequence(findByCb),
    controller.createMany,
);
router.get(
    '/story/:story',
    isStoryOwner,
    controller.getAllStoryOptions,
);
router.get(
    '/:sequence',
    isSequenceOwner(findByCb),
    controller.get,
);
router.post(
    '/:sequence',
    isSequenceOwner(findByCb),
    isStoryPublishedForSequence(findByCb),
    controller.create,
);
router.get(
    '/:sequence/:id',
    isSequenceOwner(findByCb),
    controller.getOne,
);
router.put(
    '/:sequence/:id',
    isSequenceOwner(findByCb),
    isStoryPublishedForSequence(findByCb),
    controller.update,
);
router.delete(
    '/:sequence/:id',
    isSequenceOwner(findByCb),
    isStoryPublishedForSequence(findByCb),
    controller.remove,
);

module.exports = router;
