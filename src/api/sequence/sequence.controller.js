const BaseController = require('../common/base.controller');
const Sequence = require('../../models/sequence').model;
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
    item.story = req.params.story;
    item.hasScenePic = !!item.scenePic;
    const lastSeqInOrder = await Sequence.findLastInOrder();
    item.order = lastSeqInOrder ? lastSeqInOrder.order + 1 : 0;
});

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_UPDATE].push(async (req, item) => {
    item.hasScenePic = !!item.scenePic;
    await item.save();
    await item.populate(['options']).execPopulate();
    delete item.scenePic;
});

const updateOrder = async (req) => {
    const { seqId, ahead } = req.body;
    const seqOrder = ahead ? 1 : -1;

    const seq = await Sequence.findOne({ _id: seqId });
    const adjacentSeq = await Sequence.findOne({ story: seq.story, order: seq.order + seqOrder });

    const tmp = seq.order;
    seq.order = adjacentSeq.order;
    adjacentSeq.order = tmp;

    return await Promise.all([
        seq.save(),
        adjacentSeq.save(),
    ]);
};

module.exports = {
    get: sequenceCtrl.get(),
    getOne: sequenceCtrl.getOne(),
    create: sequenceCtrl.create(),
    update: sequenceCtrl.update(),
    remove: sequenceCtrl.remove(),
    updateOrder: sequenceCtrl.createCustomHandler(updateOrder),
};
