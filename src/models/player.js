const MODEL_NAMES = require('./model-names');
const STORY = MODEL_NAMES.story;
const USER = MODEL_NAMES.user;
const MODEL = MODEL_NAMES.player;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        story: { type: String, ref: STORY },
        user: { type: String, ref: USER },
        attributes: { type: [{ name: String, value: Number, _id: false }] },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

schema.index({ story: 1, user: 1 }, { unique: true });


module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
