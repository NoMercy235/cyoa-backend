const { handleUniqueError } = require('./utils');
const MODEL_NAMES = require('./model-names');

const USER = MODEL_NAMES.user;
const STORY = MODEL_NAMES.story;
const MODEL = MODEL_NAMES.rating;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        rating: { type: Number, default: 0 },

        story: { type: String, ref: STORY, required: true },
        user: { type: String, ref: USER, required: true },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        usePushEach: true,
    }
);

schema.index({ story: 1, user: 1 }, { unique: true });

schema.post('save', handleUniqueError({ story: true }));

schema.statics.ignoreFieldsInList = [];

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
