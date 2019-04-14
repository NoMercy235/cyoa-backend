const router = require('express').Router();
const controller = require('./chapter.public.controller');

router.get('/:story', controller.get);
router.get('/:story/:id', controller.getOne);

module.exports = router;
