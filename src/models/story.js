const MODEL_NAMES = require('./model-names');
const USER = MODEL_NAMES.user;
const MODEL = MODEL_NAMES.story;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        name: { type: String, required: true, index: { unique: true } },
        description: { type: String, required: true },
        tags: { type: [String], required: true },

        author: { type: String, ref: USER, required: true },
        // startSeq: { type: [String], required: true },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

schema.statics.getAllowedFilters = function () {
    return ['name', 'tags', 'author'];
};

schema.statics.getAllowedSort = function () {
    return ['name'];
};

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
