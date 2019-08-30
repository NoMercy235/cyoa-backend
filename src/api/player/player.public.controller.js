const BaseController = require('../common/base.controller');
const Attribute = require('../../models/attribute').model;
const Player = require('../../models/player').model;
const Story = require('../../models/story').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { _id: req.params.id };
};

const playerCtrl = new BaseController(Player, findByCb);

function checkOwnership (req, playerObj) {
    const base64User = Buffer.from(req.headers.authorization.split('.')[1], 'base64');
    const user = JSON.parse(base64User.toString());

    if (playerObj.player !== user._id) {
        throw { message: constants.ERROR_MESSAGES.resourceNotOwned };
    }
}

async function setPlayerForStory (req) {
    const playerObj = await Player.findOne({ player: req.params.player, story: req.params.story });

    checkOwnership(req, playerObj);

    playerObj.lastStorySequence = req.body.lastStorySequence;
    playerObj.attributes = req.body.attributes;

    await playerObj.save();

    return playerObj;
}

async function getOrCreate (req) {
    const player = req.query.playerId;
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

        story.readTimes ++;

        await Promise.all([
            playerObj.save(),
            story.save(),
        ]);
    }
    return playerObj;
}

async function updateAttributes (req) {
    const query = { _id: req.params.id };
    const player = await Player.findOne(query).exec();

    player.lastStorySequence = req.body.lastStorySequence;
    const newAttributes = req.body.attributes || [];

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
    setPlayerForStory: playerCtrl.createCustomHandler(setPlayerForStory),
    getOrCreate: playerCtrl.createCustomHandler(getOrCreate),
    updateAttributes: playerCtrl.createCustomHandler(updateAttributes),
    get: playerCtrl.get(),
    getOne: playerCtrl.getOne(),
    create: playerCtrl.create(),
    update: playerCtrl.update(),
    remove: playerCtrl.remove(),
};
