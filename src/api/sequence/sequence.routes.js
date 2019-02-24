const router = require('express').Router();
const controller = require('./sequence.controller');

router.put('/:story/updateOrder', controller.updateOrder);
router.get('/:story', controller.get);
router.post('/:story', controller.create);
router.get('/:story/:id', controller.getOne);
router.put('/:story/:id', controller.update);
router.delete('/:story/:id', controller.remove);

module.exports = router;
