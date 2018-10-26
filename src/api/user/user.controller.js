let BaseController = require('../common/base.controller');
let User = require('../../models/user').model;

const findByCb = function (req) {
    return { email: req.params.email }
};

const userController = new BaseController(User, findByCb);

function getUserWithToken (req, res) {
    res.json(req.user);
}

module.exports = {
    get: userController.get(),
    getOne: userController.getOne(),
    create: userController.create(),
    update: userController.update(),
    remove: userController.remove(),
    getUserWithToken: getUserWithToken,
};