const BaseController = require('../common/base.controller');
const Rating = require('../../models/rating').model;

const findByCb = function ({ params: { userId, storyId } }) {
    return { user: userId, story: storyId };
};

const ratingCtrl = new BaseController(Rating, findByCb);

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

async function removeRating (req) {
    const { id } = req.params;
    return await Rating.findOneAndRemove({ _id: id });
}

module.exports = {
    get: ratingCtrl.get(),
    getOne: ratingCtrl.getOne(),
    create: ratingCtrl.create(),
    update: ratingCtrl.createCustomHandler(setRating),
    remove: ratingCtrl.createCustomHandler(removeRating),
};
