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

        story: { type: String, ref: STORY },
        chapter: { type: String, ref: CHAPTER, default: '' },
        options: [{ type: String, ref: OPTION }],
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        usePushEach: true,
    }
);

schema.index({ name: 1, story: 1 }, { unique: true });


schema.statics.getAllowedFilters = function () {
    return ['name', 'story', 'chapter'];
};

schema.statics.getAllowedSort = function () {
    return ['name', 'order'];
};

schema.statics.ignoreFieldsInList = ['scenePic'];

schema.statics.findLastInOrder = function () {
    return this.findOne({}).sort('-order');
};

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
