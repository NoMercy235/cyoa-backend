const router = require('express').Router();
const controller = require('./option.controller');
const { isOwner } = require('../common/base.middleware');
const Story = require('../../models/story').model;
const Sequence = require('../../models/sequence').model;

const isStoryOwner = isOwner(
    Story,
    (req) => ({ _id: req.params.story }),
    'author',
);

const isSequenceOwner = isOwner(
    Sequence,
    (req) => ({ _id: req.params.sequence }),
    'story',
);


router.post('/many/:sequence', isSequenceOwner, controller.createMany);
router.get('/story/:story', isStoryOwner, controller.getAllStoryOptions);
router.get('/:sequence', isSequenceOwner, controller.get);
router.post('/:sequence', isSequenceOwner, controller.create);
router.get('/:sequence/:id', isSequenceOwner, controller.getOne);
router.put('/:sequence/:id', isSequenceOwner, controller.update);
router.delete('/:sequence/:id', isSequenceOwner, controller.remove);

module.exports = router;
