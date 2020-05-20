const Rating = require('../../models/rating').model;
const BaseController = require('../common/base.controller');
const constants = require('../common/constants');

const isOwner = async (req, res, next) => {
    const rating = await Rating.findOne({ _id: req.params.id }).exec();

    if (!rating) {
        const err = { status: constants.HTTP_CODES.NOT_FOUND };
        BaseController.onError(err, res);
        return;
    }

    if (rating.user !== req.user._id.toString()) {
        const err = { message: constants.ERROR_MESSAGES.resourceNotOwned };
        BaseController.onError(err, res);
        return;
    }
    next();
};

module.exports = {
    isOwner,
};
