const router = require('express').Router();
const controller = require('./rating.controller');
const { isOwner } = require('../common/base.middleware');
const Rating = require('../../models/rating').model;

const isRatingOwner = isOwner(
    Rating,
    (req) => ({ _id: req.params.id }),
    'user',
)

router.get('/:userId/:storyId', controller.getOne);
router.put('/:userId/:storyId', controller.update);
router.put('/:userId/:storyId/:id', isRatingOwner, controller.update);
router.delete('/:id', isRatingOwner, controller.remove);

module.exports = router;
