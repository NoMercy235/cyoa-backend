const BaseController = require('../common/base.controller');
const User = require('../../models/user').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { email: req.params.email }
};

const userController = new BaseController(User, findByCb);

userController.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_UPDATE].push(async (req, body, query) => {
    await checkPermission(req);
    delete body.isActive;
    delete body.isAdmin;
    delete body.isEmailVerified;
    query = query.select('-password');
    return query
});

function getUserWithToken (req, res) {
    res.json(req.user);
}

async function checkPermission (req) {
    const user = await User.findOne({ email: req.params.email }).exec();
    if (user._id.toString() !== req.user._id.toString()) {
        throw { message: constants.ERROR_MESSAGES.resourceNotOwned };
    }
}

module.exports = {
    get: userController.get(),
    getOne: userController.getOne(),
    create: userController.create(),
    update: userController.update(),
    remove: userController.remove(),
    getUserWithToken: getUserWithToken,
};
