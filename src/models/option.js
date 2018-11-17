const MODEL_NAMES = require('./model-names');
const SEQUENCE = MODEL_NAMES.sequence;
const MODEL = MODEL_NAMES.option;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        action: { type: String, required: true },

        sequence: { type: String, ref: SEQUENCE },
        nextSeq: { type: String, ref: SEQUENCE },
        consequence: {
            type: [{
                attrName: String,
                changeValue: Number,
                _id: false,
            }],
            required: true,
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
