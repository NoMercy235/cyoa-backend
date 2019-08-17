const { handleUniqueError } = require('./utils');
const { ERROR_MESSAGES } = require('../api/common/constants');
const MODEL_NAMES = require('./model-names');

const CHAPTER = MODEL_NAMES.chapter;
const STORY = MODEL_NAMES.chapter;
const SEQUENCE = MODEL_NAMES.sequence;
const USER = MODEL_NAMES.user;
const MODEL = MODEL_NAMES.chapter;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },

        author: { type: String, ref: USER, required: true },
        story: { type: String, ref: STORY, required: true },
        parentChapter: { type: String, ref: CHAPTER, default: '' },
        sequences: [{ type: mongoose.Schema.Types.ObjectId, ref: SEQUENCE }],
        subChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: CHAPTER, default: [] }],
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        usePushEach: true,
    }
);

schema.post('save', handleUniqueError({ message: ERROR_MESSAGES.nameNotUnique }));

schema.statics.getAllowedFilters = function () {
    return ['name', 'parentChapter'];
};

schema.statics.getAllowedSort = function () {
    return ['name'];
};

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
