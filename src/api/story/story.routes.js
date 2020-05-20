const router = require('express').Router();
const controller = require('./story.controller');
const { isOwner } = require('../common/base.middleware');
const Story = require('../../models/story').model;

const isStoryOwner = isOwner(
    Story,
    (req) => ({ _id: req.params.id }),
    'author',
);

router.get('/', controller.get);
router.post('/', controller.create);
router.get('/checkIfCanPublish/:id', isStoryOwner, controller.checkIfStoryCanPublish);
router.put('/:id/publish', isStoryOwner, controller.publishStory);
router.get('/:id', controller.getOne);
router.put('/:id', isStoryOwner, controller.update);
router.delete('/:id', isStoryOwner, controller.remove);

module.exports = router;
