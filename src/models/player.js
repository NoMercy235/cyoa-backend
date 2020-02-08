const { generateId } = require('./utils');
const MODEL_NAMES = require('./model-names');
const STORY = MODEL_NAMES.story;
const SEQUENCE = MODEL_NAMES.sequence;
const MODEL = MODEL_NAMES.player;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        id: { type: String },
        player: { type: String, required: true },
        lastStorySequence: { type: String, ref: SEQUENCE, required: true },

        story: { type: String, ref: STORY, required: true },
        attributes: { type: Array },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

schema.index({ story: 1, player: 1 }, { unique: true });

schema.pre('save', generateId(MODEL));

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
