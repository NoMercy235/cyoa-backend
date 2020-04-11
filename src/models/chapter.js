const { handleUniqueError } = require('./utils');
const MODEL_NAMES = require('./model-names');

const STORY = MODEL_NAMES.chapter;
const SEQUENCE = MODEL_NAMES.sequence;
const USER = MODEL_NAMES.user;
const MODEL = MODEL_NAMES.chapter;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },

        author: { type: String, ref: USER, required: true },
        story: { type: String, ref: STORY, required: true },
        sequences: [{ type: mongoose.Schema.Types.ObjectId, ref: SEQUENCE }],
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        usePushEach: true,
    }
);

schema.index({ name: 1, story: 1, author: 1 }, { unique: true });

schema.post('save', handleUniqueError(['name']));

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
