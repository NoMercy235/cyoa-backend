const jwt = require('jsonwebtoken');
const User = require('../../models/user').model;
const EmailVerifyToken = require('../../models/email-verify-token').model;
const config = require('../../config');
const constants = require('../common/constants');
const sendEmail = require('../../../scripts/email-sender/email-sender');

const sendUnauthorized = (res) => {
    res
        .status(constants.HTTP_CODES.UNAUTHORIZED)
        .json({
            message: 'Authentication failed. Username or password are incorrect',
        });
};

const signJwtToken = (user) => {
    return jwt.sign(
        { _id: user._id, email: user.email },
        config.secret,
        { expiresIn: constants.TOKEN_EXPIRE_TIME }
    );
};

const authenticate = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.comparePassword(req.body.password) || !user.isEmailVerified) {
            sendUnauthorized(res);
            return ;
        }

        res.status(constants.HTTP_CODES.OK).json({
            user: user.safeToSend(true),
            token: signJwtToken(user),
        });
    } catch (e) {
        sendUnauthorized(res);
    }
};

const generateEmailVerifyToken = async (req, user) => {
    const emailVerifyToken = new EmailVerifyToken({
        token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        email: user.email,
        user: user._id,
        redirectUrl: req.get('referer'),
    });
    await emailVerifyToken.save();
    return emailVerifyToken;
};

const register = async (req, res) => {
    const { email, firstName, lastName } = req.body;

    const user = User(req.body);
    try {
        await user.save();
        res.status(constants.HTTP_CODES.OK).json({
            user: user.safeToSend(true)
        });
        const emailVerifyToken = await generateEmailVerifyToken(req, user);

        await sendEmail({
            token: emailVerifyToken.token,
            destination: email,
            name: firstName || lastName
                ? `${firstName} ${lastName}`.trim()
                : email,
        });
    } catch (err) {
        res.status(constants.HTTP_CODES.BAD_REQUEST).json(err);
    }
};

const checkToken = (req, res) => {
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

const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const emailVerifyToken = await EmailVerifyToken.findOne({ token });
        const user = await User.findOne({ _id: emailVerifyToken.user });
        user.isEmailVerified = true;
        await user.save();

        res.status(constants.HTTP_CODES.OK).json({
            emailVerifyToken,
            user,
            token: signJwtToken(user)
        });
    } catch (e) {
        console.log(e);
        sendUnauthorized(res);
    }

};

module.exports = {
    authenticate,
    register,
    checkToken,
    verifyEmail,
};
