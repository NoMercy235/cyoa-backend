const MODEL_NAMES = require('./model-names');
const STORY = MODEL_NAMES.story;
const MODEL = MODEL_NAMES.attribute;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        startValue: { type: Number, default: 0 },

        story: { type: String, ref: STORY },
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
    return { name: att.name, value: att.startValue };
};

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
