const router = require('express').Router();
const controller = require('./user.controller');
const { isOwner } = require('../common/base.middleware');
const User = require('../../models/user').model;

const isUserOwner = isOwner(
    User,
    (req) => ({ _id: req.user._id.toString() }),
    '_id',
)

router.get('/', controller.get);
router.post('/', controller.create);
router.post('/profilePicture', controller.uploadProfilePicture);
router.get('/getUserWithToken', controller.getUserWithToken);
router.get('/:email', controller.getOne);
router.put('/:email', isUserOwner, controller.update);
router.delete('/:email', isUserOwner, controller.remove);

module.exports = router;
