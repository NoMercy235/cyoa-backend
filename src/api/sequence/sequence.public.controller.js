const BaseController = require('../common/base.controller');
const Sequence = require('../../models/sequence').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { _id: req.params.id };
};

const sequenceCtrl = new BaseController(Sequence, findByCb);

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET_ONE].push((req, query) => {
    query = query.findOne({ story: req.params.story }).populate(['options']);
    return query;
});

module.exports = {
    getOne: sequenceCtrl.getOne(),
};
