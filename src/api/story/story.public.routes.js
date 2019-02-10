const router = require('express').Router();
const controller = require('./story.public.controller');

router.get('/', controller.get);
router.get('/:id', controller.getOne);

module.exports = router;
