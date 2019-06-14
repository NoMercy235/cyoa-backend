const MODEL_NAMES = require('./model-names');
const STORY = MODEL_NAMES.story;
const SEQUENCE = MODEL_NAMES.sequence;
const MODEL = MODEL_NAMES.attribute;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        isImportant: { type: Boolean, default: false },
        description: { type: String },
        startValue: { type: Number, default: 0 },

        story: { type: String, ref: STORY },
        linkedEnding: { type: String, ref: SEQUENCE },
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

schema.statics.forPlayer = function (att) {
    return {
        name: att.name,
        value: att.startValue,
        isImportant: att.isImportant,
        linkedEnding: att.linkedEnding,
        colorScheme: { background: 'white', text: 'black' },
    };
};

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
