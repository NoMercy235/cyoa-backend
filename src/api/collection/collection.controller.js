const BaseController = require('../common/base.controller');
const Collection = require('../../models/collection').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { _id: req.params.id };
};

const storyCtrl = new BaseController(Collection, findByCb);

storyCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_CREATE].push((req, item) => {
    item.author = req.user._id;
});

storyCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET_ONE].push((req, query) => {
    query.populate({ path: 'stories', select: ['_id', 'name', 'author', 'description', 'tags'] });
});

module.exports = {
    get: storyCtrl.get(),
    getOne: storyCtrl.getOne(),
    create: storyCtrl.create(),
    update: storyCtrl.update(),
    remove: storyCtrl.remove(),
};