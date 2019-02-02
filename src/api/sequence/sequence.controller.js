const BaseController = require('../common/base.controller');
const Sequence = require('../../models/sequence').model;
const Story = require('../../models/story').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { _id: req.params.id };
};

const sequenceCtrl = new BaseController(Sequence, findByCb);

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET].push((req, query) => {
    query = query.find({ story: req.params.story });
    return query;
});

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_CREATE].push(async (req, item) => {
    const story = await Story.findOne({ _id: req.params.story }).exec();
    if (story.author !== req.user._id.toString()) {
        return Promise.reject({ error: "Trying to create a sequence for a story you don't own." });
    }
    item.story = req.params.story;
});

module.exports = {
    get: sequenceCtrl.get(),
    getOne: sequenceCtrl.getOne(),
    create: sequenceCtrl.create(),
    update: sequenceCtrl.update(),
    remove: sequenceCtrl.remove(),
};
