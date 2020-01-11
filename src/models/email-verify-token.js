const MODEL_NAMES = require('./model-names');
const USER = MODEL_NAMES.user;
const MODEL = MODEL_NAMES.emailVerifyToken;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        token: { type: String, required: true },
        email: { type: String, required: true },
        redirectUrl: { type: String, required: true },

        user: { type: String, ref: USER, required: true },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
