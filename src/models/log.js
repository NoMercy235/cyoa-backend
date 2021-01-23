const MODEL_NAMES = require('./model-names');

const MODEL = MODEL_NAMES.log;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        type: { type: String, required: true },
        message: { type: String, required: true },
        extra: { type: String },
    },
    {
        timestamps: { createdAt: 'created_at' },
    }
);

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
    LogType: {
        Info: 'INFO',
        Error: 'ERROR',
    },
};
