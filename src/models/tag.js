const MODEL_NAMES = require('./model-names');
const MODEL = MODEL_NAMES.tag;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    },
);

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
