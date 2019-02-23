const BaseController = require('../common/base.controller');
const Sequence = require('../../models/sequence').model;
const Story = require('../../models/story').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { _id: req.params.id };
};

const sequenceCtrl = new BaseController(Sequence, findByCb);

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET].push((req, query) => {
    query = query.find({ story: req.params.story }).populate(['options']);
    return query;
});

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET_ONE].push((req, query) => {
    query = query.findOne({ story: req.params.story }).populate(['options']);
    return query;
});

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_CREATE].push(async (req, item) => {
    await checkAuthor(req);
    item.story = req.params.story;
    item.hasScenePic = !!item.scenePic;
});

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_UPDATE].push(async (req) => {
    await checkAuthor(req);
});

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_UPDATE].push(async (req, item) => {
    item.hasScenePic = !!item.scenePic;
    item.save();
});

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_REMOVE].push(async (req) => {
    await checkAuthor(req);
});

async function checkAuthor(req) {
    const story = await Story.findOne({ _id: req.params.story }).exec();
    if (story.author !== req.user._id.toString()) {
        throw { message: constants.ERROR_MESSAGES.resourceNotOwned }
    }
}

module.exports = {
    get: sequenceCtrl.get(),
    getOne: sequenceCtrl.getOne(),
    create: sequenceCtrl.create(),
    update: sequenceCtrl.update(),
    remove: sequenceCtrl.remove(),
};
