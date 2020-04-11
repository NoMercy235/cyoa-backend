const BaseController = require('../common/base.controller');
const Attribute = require('../../models/attribute').model;
const Story = require('../../models/story').model;
const Option = require('../../models/option').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { _id: req.params.id };
};

const sequenceCtrl = new BaseController(Attribute, findByCb);

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET].push((req, query) => {
    query = query.find({ story: req.params.story });
    return query;
});

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET_ONE].push(async (req, query) => {
    await checkAuthor(req);
    query = query.populate([
        { path: 'linkedEnding', select: ['_id', 'name'] },
    ]);
    return query;
});

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_CREATE].push(async (req, item) => {
    await checkAuthor(req);
    item.story = req.params.story;
});

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_UPDATE].push(async (req) => {
    await checkAuthor(req);
    const newName = req.body.name;

    await updateOptions(req, (attr, o) => {
        o.consequences
            .filter(({ attribute }) => attribute === attr.name)
            .forEach(requirement => requirement.attribute = newName);
        o.requirements
            .filter(({ attribute }) => attribute === attr.name)
            .forEach(requirement => requirement.attribute = newName);
        return o.save();
    });
});

sequenceCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_REMOVE].push(async (req) => {
    await checkAuthor(req);
    await updateOptions(req, (attr, o) => {
        o.consequences = o.consequences.filter(({ attribute }) => attribute === attr.name);
        o.requirements = o.requirements.filter(({ attribute }) => attribute === attr.name);
        return o.save();
    });
});

async function updateOptions (req, updateCb) {
    const storyId = req.params.story;
    const attrId = req.params.id;

    const attr = await Attribute.findOne({ _id: attrId });

    const options = await Option.find({ story: storyId });
    await Promise.all(
        options.map(o => updateCb(attr, o)),
    );
}

async function checkAuthor(req) {
    const story = await Story.findOne({ _id: req.params.story }).exec();
    if (story.author !== req.user._id.toString()) {
        throw { message: constants.ERROR_MESSAGES.resourceNotOwned };
    }
}

module.exports = {
    get: sequenceCtrl.get(),
    getOne: sequenceCtrl.getOne(),
    create: sequenceCtrl.create(),
    update: sequenceCtrl.update(),
    remove: sequenceCtrl.remove(),
};
