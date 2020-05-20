const BaseController = require('./base.controller');
const constants = require('./constants');

const isOwner = (Resource, findByCb, propToCheck) => {
    return async (req, res, next) => {
        const resource = await Resource.findOne(findByCb(req));

        if (!resource) {
            const err = { status: constants.HTTP_CODES.NOT_FOUND };
            BaseController.onError(err, res);
            return;
        }

        if (resource[propToCheck] !== req.user._id.toString()) {
            const err = {
                status: constants.HTTP_CODES.FORBIDDEN,
                message: constants.ERROR_MESSAGES.resourceNotOwned,
            };
            BaseController.onError(err, res);
            return;
        }
        next();
    };
};

module.exports = {
    isOwner,
};
