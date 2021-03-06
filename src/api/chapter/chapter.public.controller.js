const BaseController = require('../common/base.controller');
const Chapter = require('../../models/chapter').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { _id: req.params.id };
};

const chaptersCtrl = new BaseController(Chapter, findByCb);

chaptersCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET].push((req, query) => {
    query = query.find({ story: req.params.story });
    return query;
});

module.exports = {
    get: chaptersCtrl.get(),
    getOne: chaptersCtrl.getOne(),
};
