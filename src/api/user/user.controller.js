const base64Img = require('base64-img');

const BaseController = require('../common/base.controller');
const Story = require('../../models/story').model;
const User = require('../../models/user').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { email: req.params.email }
};

const userController = new BaseController(User, findByCb);

userController.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET].push(async (req, query) => {
    query = query.select('-password');
    return query;
});

userController.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_UPDATE].push(async (req, body, query) => {
    delete body.isActive;
    delete body.isAdmin;
    delete body.isEmailVerified;
    query = query.select('-password');
    return query
});

userController.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_UPDATE].push(async (req, item) => {
    const stories = await Story.find({ author: item._id });
    await Promise.all(
        stories.map(story => {
            story.authorShort = `${item.firstName} ${item.lastName}`;
            return story.save();
        })
    )
});

function getUserWithToken (req, res) {
    res.json(req.user);
}

async function uploadProfilePicture (req) {
    const {
        user,
        body: { profile },
    } = req;

    const path = base64Img.imgSync(
        profile,
        constants.UPLOAD_PATHS.Profile,
        user._id,
    );

    const dbUser = await User.findOne({ _id: user._id });
    dbUser.profilePicture = path.split('/').pop();
    await dbUser.save();
}

module.exports = {
    get: userController.get(),
    getOne: userController.getOne(),
    create: userController.create(),
    update: userController.update(),
    remove: userController.remove(),
    getUserWithToken: getUserWithToken,
    uploadProfilePicture: userController.createCustomHandler(uploadProfilePicture),
};
