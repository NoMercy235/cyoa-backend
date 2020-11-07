const router = require('express').Router();
const controller = require('./collection.controller');
const { isOwner } = require('../common/base.middleware');
const Collection = require('../../models/collection').model;

const isCollectionOwner = isOwner(
    Collection,
    (req) => ({ author: req.user._id.toString() }),
    'author',
)

router.get('/', controller.get);
router.post('/', controller.create);
router.get('/:id', isCollectionOwner, controller.getOne);
router.put('/:id', isCollectionOwner, controller.update);
router.delete('/:id', isCollectionOwner, controller.remove);

module.exports = router;
