const router = require('express').Router();
const controller = require('./story.public.controller');

router.get('/', controller.get);
router.get('/quick', controller.getQuick);
router.get('/offline/:id', controller.offlineStory);
router.get('/:id', controller.getOne);

module.exports = router;
