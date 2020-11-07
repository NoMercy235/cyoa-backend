const BaseController = require('../common/base.controller');
const Collection = require('../../models/collection').model;
const Story = require('../../models/story').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { _id: req.params.id };
};

const collectionsCtrl = new BaseController(Collection, findByCb);

collectionsCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_CREATE].push((req, item) => {
    item.author = req.user._id;
});

collectionsCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET].push((req, query) => {
    query = query.find({ author: req.user._id });
    return query;
});

collectionsCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET_ONE].push((req, query) => {
    query.populate({ path: 'stories', select: ['_id', 'name', 'author', 'description', 'tags'] });
});

collectionsCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_REMOVE].push(async (req) => {
    const story = await Story.findOne({ fromCollection: req.params.id }).exec();
    if (story) {
        throw {
            status: constants.HTTP_CODES.BAD_REQUEST,
            message: 'Collection is not empty',
        };
    }
});

module.exports = {
    get: collectionsCtrl.get(),
    getOne: collectionsCtrl.getOne(),
    create: collectionsCtrl.create(),
    update: collectionsCtrl.update(),
    remove: collectionsCtrl.remove(),
};
