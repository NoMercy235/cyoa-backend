const router = require('express').Router();
const controller = require('./sequence.controller');

router.get('/:story/:id', controller.getOne);

module.exports = router;
