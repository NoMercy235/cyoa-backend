const { isStoryPublished } = require('../story/story.middleware');
const { isOwner } = require('../common/base.middleware');
const Story = require('../../models/story').model;
const Sequence = require('../../models/sequence').model;

const isStoryPublishedForSequence = (findByCb) => {
    return async (req, res, next) => {
        const sequence = await Sequence.findOne(findByCb(req));
        await isStoryPublished(
            () => ({ _id: sequence.story }),
        )(req, res, next);
    };
};

const isSequenceOwner = (findByCb) => {
    return async (req, res, next) => {
        const sequence = await Sequence.findOne(findByCb(req));
        await isOwner(
            Story,
            () => ({ _id: sequence.story }),
            'author',
        )(req, res, next);
    };
};

module.exports = {
    isSequenceOwner,
    isStoryPublishedForSequence,
};
