const BaseController = require('../common/base.controller');
const Attribute = require('../../models/attribute').model;
const Player = require('../../models/player').model;
const Story = require('../../models/story').model;

const findByCb = function (req) {
    return { _id: req.params.id };
};

const makeRandomId = function () {
    return Math.random().toString().substring(2);
};

const playerCtrl = new BaseController(Player, findByCb);

async function getOrCreate (req) {
    const player = req.user ? req.user._id : (req.query.playerId || makeRandomId());
    const query = { player, story: req.params.story };

    let playerObj = await Player.findOne(query).exec();

    if (!playerObj) {
        const story = await Story.findOne({ _id: req.params.story });
        const attributes = await Attribute.find({ story: req.params.story });

        playerObj = new Player({
            player,
            story: story._id,
            lastStorySequence: story.startSeq,
            attributes: attributes.map(Attribute.forPlayer),
        });
        await playerObj.save();
    }
    return playerObj;
}

async function updateAttributes (req) {
    const query = { _id: req.params.id };
    const player = await Player.findOne(query).exec();
    const newAttributes = req.body;

    player.attributes.forEach((att, index) => {
        const newAtt = newAttributes.find(a => a.name === att.name);
        if (newAtt) {
            att.value = newAtt.value;
        }
        player.attributes.set(index, att);
    });
    await player.save();
    return player;
}

module.exports = {
    getOrCreate: playerCtrl.createCustomHandler(getOrCreate),
    updateAttributes: playerCtrl.createCustomHandler(updateAttributes),
    get: playerCtrl.get(),
    getOne: playerCtrl.getOne(),
    create: playerCtrl.create(),
    update: playerCtrl.update(),
    remove: playerCtrl.remove(),
};
