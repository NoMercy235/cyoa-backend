const { generateId } = require('./utils');
const MODEL_NAMES = require('./model-names');
const SEQUENCE = MODEL_NAMES.sequence;
const STORY = MODEL_NAMES.story;
const MODEL = MODEL_NAMES.option;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        id: { type: String },
        action: { type: String, required: true },

        story: { type: String, ref: STORY, required: true },
        sequence: { type: String, ref: SEQUENCE, required: true },
        nextSeq: { type: String, ref: SEQUENCE, required: true },
        consequences: {
            type: [{
                attribute: String,
                changeValue: Number,
                _id: false,
            }],
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

schema.pre('save', generateId(MODEL));

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
