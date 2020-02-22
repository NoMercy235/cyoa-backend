const BaseController = require('../common/base.controller');
const Story = require('../../models/story').model;
const User = require('../../models/user').model;

const findByCb = function (req) {
    return { email: req.params.email }
};

const userCtrl = new BaseController(User, findByCb);

async function getUserOverview (req) {
    const storiesWritten = await Story.count({ author: req.params.id }).exec();
    return {
        storiesWritten
    }
}

module.exports = {
    getUserOverview: userCtrl.createCustomHandler(getUserOverview),
};
