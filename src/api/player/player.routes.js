const router = require('express').Router();
const controller = require('./player.controller');

router.get('/getOrCreate/:story', controller.getOrCreate);
router.put('/updateAttributes/:id', controller.updateAttributes);
router.get('/:id', controller.getOne);
router.delete('/:id', controller.remove);

module.exports = router;
