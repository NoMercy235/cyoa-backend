const router = require('express').Router();
const controller = require('./story.controller');

router.get('/', controller.get);
router.post('/', controller.create);
router.get('/checkIfCanPublish/:id', controller.checkIfStoryCanPublish);
router.put('/:id/publish', controller.publishStory);
router.get('/:id', controller.getOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
