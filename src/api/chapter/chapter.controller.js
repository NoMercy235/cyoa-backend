const BaseController = require('../common/base.controller');
const Chapter = require('../../models/chapter').model;
const Story = require('../../models/story').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { _id: req.params.id };
};

const chaptersCtrl = new BaseController(Chapter, findByCb);

chaptersCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_CREATE].push((req, item) => {
    item.author = req.user._id;
    item.story = req.params.story;
});

chaptersCtrl.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_CREATE].push(async (res, item) => {
    const story = await Story.findOne({ _id: item.story }).exec();
    story.chapters.push(item._id);
    await story.save();
});

chaptersCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET].push((req, query) => {
    query = query
        .find({ author: req.user._id })
        .find({ story: req.params.story })
        .populate(['subChapters']);
    return query;
});

module.exports = {
    get: chaptersCtrl.get(),
    getOne: chaptersCtrl.getOne(),
    create: chaptersCtrl.create(),
    update: chaptersCtrl.update(),
    remove: chaptersCtrl.remove(),
};
