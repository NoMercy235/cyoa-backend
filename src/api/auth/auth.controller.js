let jwt = require('jsonwebtoken');
let User = require('../../models/user').model;
let config = require('../../config');
let constants = require('../common/constants');

let controller = {};

controller.authenticate = (req, res) => {
    User.findOne({
        email: req.body.email,
    }, (err, user) => {
        if (err) throw err;
        if (!user || !user.comparePassword(req.body.password)) {
            res.status(constants.HTTP_CODES.UNAUTHORIZED).json({ message: 'Authentication failed. Username or password are incorrect' });
        } else if (user) {
            const token = jwt.sign(
                { _id: user._id, email: user.email },
                config.secret,
                { expiresIn: constants.TOKEN_EXPIRE_TIME }
            );

            res.status(constants.HTTP_CODES.OK).json({
                user: user.safeToSend(true),
                token: token,
            });
        }
    });
};

controller.register = (req, res) => {
    const user = User(req.body);
    user.save((err) => {
        if (err) {
            res.status(constants.HTTP_CODES.BAD_REQUEST).json(err);
        } else {
            const token = jwt.sign(
                { _id: user._id,  email: user.email },
                config.secret,
                { expiresIn: constants.TOKEN_EXPIRE_TIME }
            );

            res.status(constants.HTTP_CODES.OK).json({
                user: user.safeToSend(true),
                token: token,
            });
        }
    });
};

controller.checkToken = (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        res.sendStatus(constants.HTTP_CODES.UNAUTHORIZED);
        return;
    }
    const prefix = 'Bearer ';
    jwt.verify(token.replace(prefix, ''), config.secret, (err) => {
        if (err) {
            res.sendStatus(constants.HTTP_CODES.UNAUTHORIZED);
            return;
        }
        res.sendStatus(constants.HTTP_CODES.OK);
    });
};

module.exports = controller;
