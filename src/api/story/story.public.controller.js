const BaseController = require('../common/base.controller');
const Story = require('../../models/story').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { _id: req.params.id };
};

const storyCtrl = new BaseController(Story, findByCb);

storyCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET_ONE].push((req, query) => {
    query.populate({ path: 'author', select: [ 'email', 'firstName', 'lastName' ] });
});

module.exports = {
    get: storyCtrl.get(),
    getOne: storyCtrl.getOne(),
};
