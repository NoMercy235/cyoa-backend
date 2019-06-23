const BaseController = require('../common/base.controller');
const Story = require('../../models/story').model;
const Sequence = require('../../models/sequence').model;
const Option = require('../../models/option').model;
const constants = require('../common/constants');

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
    await checkStory(req);
    query = query.populate([
        { path: 'nextSeq', select: ['_id', 'name'] },
    ]);
    return query;
});


optionCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_CREATE].push(async (req, item) => {
    await checkStory(req);
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
    await checkStory(req);
});

optionCtrl.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_UPDATE].push(async (req, item) => {
    item.nextSeq = await getNextSeq(item);
});

optionCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_REMOVE].push(async (req) => {
    await checkStory(req);
});

optionCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_CREATE_MANY].push(async (req, items) => {
    await checkStory(req);
    items.forEach(item => {
        item.sequence = req.params.sequence;
    });
});

optionCtrl.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_CREATE_MANY].push(async (res, items) => {
    const sequence = await Sequence.findOne({ _id: res.req.params.sequence }).exec();
    sequence.options = items.map(i => i._id);
    await sequence.save();
});

async function checkStory(req) {
    const sequence = await Sequence.findOne({ _id: req.params.sequence }).exec();
    const story = await Story.findOne({ _id: sequence.story }).exec();
    if (story.author !== req.user._id.toString()) {
        throw { message: constants.ERROR_MESSAGES.resourceNotOwned };
    }
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
};
