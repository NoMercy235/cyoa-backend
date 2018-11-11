const MODEL_NAMES = require('./model-names');
const USER = MODEL_NAMES.user;
const MODEL = MODEL_NAMES.story;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        name: { type: String, required: true, index: { unique: true } },
        description: { type: String, required: true },
        tags: { type: [String], required: true },

        author: { type: String, ref: USER },
        // startSeq: { type: [String], required: true },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

schema.statics.getAllowedFilters = function () {
    return ['title', '_creator', 'categories', 'scores', 'created_at'];
};

schema.statics.getAllowedSort = function () {
    return ['title', 'scores', 'created_at'];
};

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
