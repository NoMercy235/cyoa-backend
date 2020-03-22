const BaseController = require('../common/base.controller');
const Story = require('../../models/story').model;
const Sequence = require('../../models/sequence').model;
const Option = require('../../models/option').model;
const constants = require('../common/constants');
const Filter = require('../common/filters.controller');

const filterManager = new Filter(Option);

const findByCb = function (req) {
    return { _id: req.params.id };
};

const optionCtrl = new BaseController(Option, findByCb);

optionCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET].push(async (req, query) => {
    query
        .find({ sequence: req.params.sequence })
        .populate(['nextSeq']);
});

optionCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET_ONE].push(async (req, query) => {
    await checkSequence(req);
    query = query.populate([
        { path: 'nextSeq', select: ['_id', 'name'] },
    ]);
    return query;
});


optionCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_CREATE].push(async (req, item) => {
    await checkSequence(req);
    item.sequence = req.params.sequence;
});

optionCtrl.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_CREATE].push(async (res, item) => {
    const [sequence, nextSeq ] = await Promise.all([
        Sequence.findOne({ _id: res.req.params.sequence }).exec(),
        getNextSeq(item),
    ]);
    // const sequence = await Sequence.findOne({ _id: res.req.params.sequence }).exec();
    sequence.options.push(item._id);
    await sequence.save();
    item.nextSeq = nextSeq;
});

optionCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_UPDATE].push(async (req) => {
    await checkSequence(req);
});

optionCtrl.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_UPDATE].push(async (req, item) => {
    item.nextSeq = await getNextSeq(item);
});

optionCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_REMOVE].push(async (req) => {
    await checkSequence(req);
});

optionCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_CREATE_MANY].push(async (req, items) => {
    await checkSequence(req);
    items.forEach(item => {
        item.sequence = req.params.sequence;
    });
});

optionCtrl.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_CREATE_MANY].push(async (res, items) => {
    const sequence = await Sequence.findOne({ _id: res.req.params.sequence }).exec();
    sequence.options = items.map(i => i._id);
    await sequence.save();
});

async function getAllStoryOptions (req) {
    const storyId = req.params.story;
    await checkStory(req, storyId);
    let query = Option.find({ story: storyId });
    query = filterManager.applySorting(req, query);
    return await query.exec();
}

async function checkStory (req, storyId) {
    const story = await Story.findOne({ _id: storyId }).exec();
    if (story.author !== req.user._id.toString()) {
        throw { message: constants.ERROR_MESSAGES.resourceNotOwned };
    }
}

async function checkSequence(req) {
    const sequence = await Sequence.findOne({ _id: req.params.sequence }).exec();
    await checkStory(req, sequence.story);
}

function getNextSeq (item) {
    return Sequence.findOne({ _id: item.nextSeq }).exec();
}

module.exports = {
    get: optionCtrl.get(),
    getOne: optionCtrl.getOne(),
    create: optionCtrl.create(),
    createMany: optionCtrl.createMany(),
    update: optionCtrl.update(),
    remove: optionCtrl.remove(),
    getAllStoryOptions: optionCtrl.createCustomHandler(getAllStoryOptions),
};
