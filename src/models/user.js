const bcrypt = require('bcrypt');
const MODEL_NAMES = require('./model-names');
const MODEL = MODEL_NAMES.user;

const SALT_WORK_FACTOR = 10;

const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        description: { type: String, default: '' },
        profilePicture: { type: String, default: '' },
        isAdmin: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        isEmailVerified: { type: Boolean, default: false },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

schema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        this.password = bcrypt.hashSync(this.password, SALT_WORK_FACTOR);
        next();
    } catch (err) {
        next(err);
    }
});

schema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

schema.methods.safeToSend = function (withArrays = false) {
    let result = {};
    Object.keys(schema.paths).forEach((key) => {
        if (!withArrays && Array.isArray(this[key])) return;
        result[key] = this[key];
    });
    delete result.password;
    delete result.__v;
    return result;
};

schema.statics.updateFields = function (fields) {
    // Deleting the password to prevent updating the hash on user update.
    // There will be a separate API call for password update.
    if (fields['password']) delete fields['password'];

    // TODO: check how to ignore fields which shouldn't be updated
    if (fields['email']) delete fields['email'];

    return fields;
};

schema.path('email').validate({
    validator: function (value) {
        return new Promise(resolve => {
            if (this._id) resolve();
            this.model(MODEL).count({ email: value }, (err, count) => {
                if (err) {
                    return resolve(err);
                }
                resolve(!count);
            });
        });
    },
    message: 'Email already exists',
});

schema.path('password').validate(function (value) {
    return value && value.length >= 6;
}, 'Password must be have at least 6 characters');

module.exports = {
    model: mongoose.model(MODEL, schema),
    key: MODEL,
};
