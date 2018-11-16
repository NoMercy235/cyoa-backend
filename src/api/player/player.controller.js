const BaseController = require('../common/base.controller');
const Attribute = require('../../models/attribute').model;
const Player = require('../../models/player').model;

const findByCb = function (req) {
    return { _id: req.params.id };
};

const playerCtrl = new BaseController(Player, findByCb);

async function getOrCreate (req) {
    const query = { user: req.user._id, story: req.params.story };
    let player = await Player.findOne(query).exec();
    if (!player) {
        const attributes = await Attribute.find({ story: req.params.story });

        player = new Player({
            user: req.user._id,
            story: req.params.story,
            attributes: attributes.map(Attribute.forPlayer),
        });
        await player.save();
    }
    return player;
}



module.exports = {
    getOrCreate: playerCtrl.createCustomHandler(getOrCreate),
    get: playerCtrl.get(),
    getOne: playerCtrl.getOne(),
    create: playerCtrl.create(),
    update: playerCtrl.update(),
    remove: playerCtrl.remove(),
};
