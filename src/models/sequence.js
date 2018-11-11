const MODEL_NAMES = require('./model-names');
const STORY = MODEL_NAMES.story;
const MODEL = MODEL_NAMES.sequence;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        content: { type: String, required: true },

        story: { type: String, ref: STORY },
        prevSeq: { type: String, ref: MODEL },
        nextSeq: { type: String, ref: MODEL },
        consequence: {
            type: {
                health: Number,
                mana: Number,
                gold: Number,
                luck: Number,
            },
            default: {
                health: 100,
                mana: 100,
                gold: 0,
                luck: 0,
            },
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

schema.index({ name: 1, story: 1 }, { unique: true });


schema.statics.getAllowedFilters = function () {
    return ['name', 'story'];
};

schema.statics.getAllowedSort = function () {
    return ['name'];
};

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
