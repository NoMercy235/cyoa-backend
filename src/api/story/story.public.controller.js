const BaseController = require('../common/base.controller');
const Story = require('../../models/story').model;
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


async function onQuickSearch (req) {
    const {
        quickSearch,
        sort = Story.getDefaultSort(),
    } = req.query;
    const searchQuery = { $regex: new RegExp(`.*${quickSearch}.*`, 'i') };
    return await Story
        .find({
            $or: [
                { name: searchQuery },
                { shortDescription: searchQuery },
                { longDescription: searchQuery },
                { authorShort: searchQuery },
            ],
        })
        .sort({ [sort.field]: sort.order })
        .exec();
}

module.exports = {
    getQuick: storyCtrl.createCustomHandler(onQuickSearch),
    get: storyCtrl.get(),
    getOne: storyCtrl.getOne(),
};
