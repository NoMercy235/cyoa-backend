const MODEL_NAMES = require('./model-names');
const STORY = MODEL_NAMES.story;
const USER = MODEL_NAMES.user;
const MODEL = MODEL_NAMES.collection;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },

        author: { type: String, ref: USER, required: true },
        stories: [{ type: mongoose.Schema.Types.ObjectId, ref: STORY }],
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

schema.statics.getAllowedFilters = function () {
    return ['name'];
};

schema.statics.getAllowedSort = function () {
    return ['name'];
};

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
