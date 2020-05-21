const router = require('express').Router();
const controller = require('./collection.controller');
const { isOwner } = require('../common/base.middleware');
const User = require('../../models/user').model;

const isCollectionOwner = isOwner(
    User,
    (req) => ({ _id: req.user._id.toString() }),
    'author',
)

router.get('/', controller.get);
router.post('/', controller.create);
router.get('/:id', isCollectionOwner, controller.getOne);
router.put('/:id', isCollectionOwner, controller.update);
router.delete('/:id', isCollectionOwner, controller.remove);

module.exports = router;
