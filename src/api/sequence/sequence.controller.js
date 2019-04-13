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
    const lastSeqInOrder = await Sequence.findLastInOrder();
    item.order = lastSeqInOrder ? lastSeqInOrder.order + 1 : 0;
});

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_UPDATE].push(async (req) => {
    await checkAuthor(req);
});

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_UPDATE].push(async (req, item) => {
    item.hasScenePic = !!item.scenePic;
    await item.save();
    await item.populate(['options']).execPopulate();
    delete item.scenePic;
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

const updateOrder = async (req, res) => {
    const sequences = [];
    try {
        await checkAuthor(req);
        await Promise.all(req.body.map(async seq => {
            const dbSeq = await Sequence.findOne({ _id: seq._id });
            dbSeq.order = seq.order;
            sequences.push(dbSeq);
            return dbSeq.save();
        }));
        res.json(sequences);
    } catch (err) {
        console.error(err);
        res.status(constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json(err);
    }
};

module.exports = {
    get: sequenceCtrl.get(),
    getOne: sequenceCtrl.getOne(),
    create: sequenceCtrl.create(),
    update: sequenceCtrl.update(),
    remove: sequenceCtrl.remove(),
    updateOrder: updateOrder,
};
