const BaseController = require('../common/base.controller');
const Chapter = require('../../models/chapter').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { _id: req.params.id };
};

const chaptersCtrl = new BaseController(Chapter, findByCb);

chaptersCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_CREATE].push((req, item) => {
    item.author = req.user._id;
});

chaptersCtrl.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_CREATE].push(async (res, item) => {
    if (item.parentChapter) {
        const parentChapter = await getChapter(item.parentChapter);
        parentChapter.subChapters.push(item._id);
        await parentChapter.save();
    }
});

chaptersCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET].push((req, query) => {
    query = query
        .find({ author: req.user._id })
        .populate(['subChapters']);
    return query;
});

chaptersCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET_ONE].push((req, query) => {
    query.populate(['subChapters']);
});

chaptersCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_UPDATE].push(async (req, item) => {
    await checkAuthor(req, item);

    // On update, check to see if the parentChapter has changed.
    const dbChapter = await getChapter(item._id);
    if (item.parentChapter === dbChapter.parentChapter) return;

    // If it did, remove it from the subChapters list of parentChapter.
    const oldParentChapter = await getChapter(dbChapter.parentChapter);
    oldParentChapter.subChapters = oldParentChapter.subChapters.filter(chapterId => {
        return chapterId.toString() !== item._id;
    });
    await oldParentChapter.save();

    // And add it to the new parentChapter's list
    const newParentChapter = await getChapter(item.parentChapter);
    newParentChapter.subChapters.push(item._id);
    await newParentChapter.save();
});

chaptersCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_REMOVE].push(async (req, item) => {
    await checkAuthor(req, item);
});

async function checkAuthor(req, item) {
    if (item.author === req.user._id) {
        throw { message: constants.ERROR_MESSAGES.resourceNotOwned };
    }
}

async function getChapter(id) {
    return await Chapter.findOne({ _id: id }).exec();
}

module.exports = {
    get: chaptersCtrl.get(),
    getOne: chaptersCtrl.getOne(),
    create: chaptersCtrl.create(),
    update: chaptersCtrl.update(),
    remove: chaptersCtrl.remove(),
};