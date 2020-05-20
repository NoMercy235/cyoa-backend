const constants = require('../common/constants');
const Story = require('../../models/story').model;

const isStoryPublished = (findByCb) => {
    return async (req, res, next) => {
        const story = await Story.findOne(findByCb(req));
        if (story.published) {
            const err = {
                status: constants.HTTP_CODES.BAD_REQUEST,
                message: constants.ERROR_MESSAGES.cannotPerformActionOnPublishedStory,
            };
            BaseController.onError(err, res);
            return ;
        }
        next();
    };
};

module.exports = {
    isStoryPublished,
};
