const MODEL_NAMES = require('./model-names');
const USER = MODEL_NAMES.user;
const COLLECTION = MODEL_NAMES.collection;
const SEQUENCE = MODEL_NAMES.sequence;
const TAG = MODEL_NAMES.tag;
const MODEL = MODEL_NAMES.story;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        authorShort: { type: String },

        tags: [{ type: String, ref: TAG, required: true }],
        author: { type: String, ref: USER, required: true },
        fromCollection: { type: String, ref: COLLECTION, default: '' },
        startSeq: { type: String, ref: SEQUENCE },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

schema.index({ name: 1, author: 1 }, { unique: true });

schema.statics.getDefaultSort = () => {
    return { field: 'created_at', order: 'desc' };
};

schema.statics.getAllowedFilters = function () {
    return ['name', 'tags', 'author', 'fromCollection'];
};

schema.statics.getAllowedSort = function () {
    return ['name', 'created_at'];
};

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
