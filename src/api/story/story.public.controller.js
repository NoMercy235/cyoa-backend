const BaseController = require('../common/base.controller');
const Story = require('../../models/story').model;
const Sequence = require('../../models/sequence').model;
const Option = require('../../models/option').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { _id: req.params.id };
};

const storyCtrl = new BaseController(Story, findByCb);

storyCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET].push((req, query) => {
    query.find({ published: true });
});

storyCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET_ONE].push((req, query) => {
    query
        .findOne({ published: true })
        .populate({
            path: 'startSeq',
            select: [ 'name', 'content', 'isEnding' ],
            populate: {
                path: 'options',
                select: [ 'action', 'consequences', 'nextSeq' ],
            },
        });
});

async function onQuickSearch (req, res, baseCtrl) {
    const {
        quickSearch,
        sort = Story.getDefaultSort(),
    } = req.query;
    const searchQuery = { $regex: new RegExp(`.*${quickSearch}.*`, 'i') };
    const query = Story
        .find({
            published: true,
            $or: [
                { name: searchQuery },
                { shortDescription: searchQuery },
                { longDescription: searchQuery },
                { authorShort: searchQuery },
            ],
        })
        .sort({ [sort.field]: sort.order });
    return req.query.pagination
        ? await baseCtrl.filter.applyPagination(req.query.pagination, query)
        : await query.exec();
}

async function offlineStory (req) {
    const { id: storyId } = req.params;
    let result = {};
    result.story = await Story.findOne({ _id: storyId }).exec();

    if (!result.story) {
        throw {
            status: constants.HTTP_CODES.NOT_FOUND,
            message: 'Resource not found',
        };
    }

    if (!result.story.isAvailableOffline) {
        throw {
            status: constants.HTTP_CODES.BAD_REQUEST,
            message: 'Story not available offline',
        };
    }

    result.sequences = await Sequence.find({ story: storyId }).exec();
    result.options = await Option.find({ story: storyId }).exec();

    return result;
}

module.exports = {
    getQuick: storyCtrl.createCustomHandler(onQuickSearch),
    get: storyCtrl.get(),
    getOne: storyCtrl.getOne(),
    offlineStory: storyCtrl.createCustomHandler(offlineStory),
};
