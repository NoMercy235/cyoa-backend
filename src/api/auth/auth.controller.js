const jwt = require('jsonwebtoken');
const User = require('../../models/user').model;
const EmailVerifyToken = require('../../models/email-verify-token').model;
const config = require('../../config');
const constants = require('../common/constants');
const {
    sendEmailVerifyEmail,
    sendForgotPasswordEmail,
    resetPasswordTokens
} = require('../../../scripts/email-sender/email-sender');

const generateToken = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const generateEmailVerifyToken = async (req, user) => {
    const emailVerifyToken = new EmailVerifyToken({
        token: generateToken(),
        email: user.email,
        user: user._id,
        redirectUrl: req.get('referer'),
    });
    await emailVerifyToken.save();
    return emailVerifyToken;
};

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

const register = async (req, res) => {
    const { email, firstName, lastName } = req.body;

    const user = User(req.body);
    try {
        await user.save();
        res.status(constants.HTTP_CODES.OK).json({
            user: user.safeToSend(true)
        });
        const emailVerifyToken = await generateEmailVerifyToken(req, user);

        await sendEmailVerifyEmail({
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

const lostPasswordEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const passwordToken = await generateToken();

        await sendForgotPasswordEmail({
            token: passwordToken,
            destination: email
        });
        res.sendStatus(constants.HTTP_CODES.OK);
    } catch (err) {
        res.status(constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json(err);
    }

};

const recoverPasswordRequest = async (req, res) => {
    const { email, token } = req.params;
    const { password } = req.body;

    try {
        const storedToken = resetPasswordTokens[email];

        if (!storedToken || (storedToken.token !== token)) {
            res.status(constants.HTTP_CODES.BAD_REQUEST).json({
                message: constants.ERROR_MESSAGES.tokenExpired,
            });
            return
        }

        const user = await User.findOne({ email });
        user.password = password;
        await user.save();

        res.status(constants.HTTP_CODES.OK).json({
            user: user.safeToSend(true),
            token: signJwtToken(user),
        });
    } catch (err) {
        console.log(err);
        res.status(constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json(err);
    }

};

module.exports = {
    authenticate,
    register,
    checkToken,
    verifyEmail,
    lostPasswordEmail,
    recoverPasswordRequest,
};
