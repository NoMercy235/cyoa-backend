const MODEL_NAMES = require('./model-names');
const USER = MODEL_NAMES.user;
const COLLECTION = MODEL_NAMES.collection;
const MODEL = MODEL_NAMES.story;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        tags: { type: [String], required: true },

        author: { type: String, ref: USER, required: true },
        fromCollection: { type: String, ref: COLLECTION, default: '' },
        startSeq: { type: String },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

schema.index({ name: 1, author: 1 }, { unique: true });

schema.statics.getAllowedFilters = function () {
    return ['name', 'tags', 'author', 'fromCollection'];
};

schema.statics.getAllowedSort = function () {
    return ['name'];
};

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
