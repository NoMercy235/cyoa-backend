const BaseController = require('../common/base.controller');
const Story = require('../../models/tag').model;

const findByCb = function (req) {
    return { _id: req.params.id };
};

const tagCtrl = new BaseController(Story, findByCb);

module.exports = {
    get: tagCtrl.get(),
};
