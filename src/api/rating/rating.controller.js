const BaseController = require('../common/base.controller');
const Rating = require('../../models/rating').model;
const constants = require('../common/constants');

const findByCb = function ({ params: { userId, storyId } }) {
    return { user: userId, story: storyId };
};

const ratingCtrl = new BaseController(Rating, findByCb);

ratingCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_UPDATE].push(async (req) => {
    await checkOwner(req);
});

async function checkOwner(req) {
    const rating = await Rating.findOne({ _id: req.params.id }).exec();
    if (rating.user !== req.user._id.toString()) {
        throw { message: constants.ERROR_MESSAGES.resourceNotOwned };
    }
}

async function setRating (req) {
    const { userId, storyId } = req.params;
    const { rating } = req.body;

    const query = { user: userId, story: storyId };
    let ratingObj = await Rating.findOne(query);

    if (!ratingObj) {
       ratingObj = new Rating({
           rating,
           user: userId,
           story: storyId,
       });
    } else {
        ratingObj.rating = rating;
    }

    await ratingObj.save();
    return ratingObj;
}

module.exports = {
    get: ratingCtrl.get(),
    getOne: ratingCtrl.getOne(),
    create: ratingCtrl.create(),
    update: ratingCtrl.createCustomHandler(setRating),
    remove: ratingCtrl.remove(),
};
