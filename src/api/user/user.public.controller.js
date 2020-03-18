const base64Img = require('base64-img');

const BaseController = require('../common/base.controller');
const Story = require('../../models/story').model;
const User = require('../../models/user').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { email: req.params.email }
};

const userCtrl = new BaseController(User, findByCb);

async function getUserOverview ({ params: { id: userId } }) {
    const user = await User.findOne({ _id: userId }).exec();
    const storiesWritten = await Story.count({
        author: userId,
        published: true,
    });
    return {
        user: user.safeToSend(),
        storiesWritten
    }
}

async function getProfilePicture (req) {
    const user = await User.findOne({ _id: req.params.id });
    const path = `${constants.UPLOAD_PATHS.Profile}/${user.profilePicture}`;
    try {
        const img = base64Img.base64Sync(path);
        return {
            profile: img,
        };
    } catch (e) {
        throw { status: constants.HTTP_CODES.NOT_FOUND };
    }
}

module.exports = {
    getUserOverview: userCtrl.createCustomHandler(getUserOverview),
    getProfilePicture: userCtrl.createCustomHandler(getProfilePicture),
};
