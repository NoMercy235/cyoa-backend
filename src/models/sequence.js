const MODEL_NAMES = require('./model-names');
const STORY = MODEL_NAMES.story;
const OPTION = MODEL_NAMES.option;
const MODEL = MODEL_NAMES.sequence;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        content: { type: String, required: true },
        isEnding: { type: Boolean, default: false },

        story: { type: String, ref: STORY },
        options: { type: [String], ref: OPTION },
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
