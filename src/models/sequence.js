const { handleUniqueError } = require('./utils');
const MODEL_NAMES = require('./model-names');

const STORY = MODEL_NAMES.story;
const OPTION = MODEL_NAMES.option;
const CHAPTER = MODEL_NAMES.chapter;
const MODEL = MODEL_NAMES.sequence;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        content: { type: String, required: true },
        isEnding: { type: Boolean, default: false },
        scenePic: { type: String, default: null },
        hasScenePic: { type: Boolean },
        order: { type: Number, default: 0 },
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },

        story: { type: String, ref: STORY },
        chapter: { type: String, ref: CHAPTER, default: '' },
        options: [{ type: String, ref: OPTION, default: [] }],
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        usePushEach: true,
    }
);

schema.index({ name: 1, story: 1 }, { unique: true });

schema.post('save', handleUniqueError(['name']));

schema.statics.getAllowedFilters = function () {
    return ['name', 'story', 'chapter', 'isEnding'];
};

schema.statics.getAllowedSort = function () {
    return ['name', 'order'];
};

schema.statics.ignoreFieldsInList = [];

schema.statics.findLastInOrder = function () {
    return this.findOne({}).sort('-order');
};

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
