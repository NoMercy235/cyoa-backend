const jwt = require('jsonwebtoken');
const User = require('../../models/user').model;
const { model: Log, LogType } = require('../../models/log');
const EmailVerifyToken = require('../../models/email-verify-token').model;
const config = require('../../config');
const constants = require('../common/constants');
const {
    sendEmailVerifyEmail,
    sendForgotPasswordEmail,
    resetPasswordTokens,
} = require('../../../scripts/email-sender/email-sender');
const {
    logError,
    logInfo,
} = require('../../models/utils');

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

const logUnknownError = (e) => {
    console.log(e);
    logError(e.message || 'Unknown Error', JSON.stringify(e));
};

const authenticate = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.comparePassword(req.body.password)) {
            sendUnauthorized(res);
            return ;
        }

        if (!user.isEmailVerified) {
            res
                .status(constants.HTTP_CODES.FORBIDDEN)
                .json({
                    [constants.ERROR_CODES.emailNotVerified]: true,
                    message: 'Email not verified',
                });
            return;
        }

        const log = Log({
            type: LogType.Info,
            message: `User ${email} has logged in`,
        });
        log.save();

        res.status(constants.HTTP_CODES.OK).json({
            user: user.safeToSend(true),
            token: signJwtToken(user),
        });
    } catch (e) {
        logUnknownError(e);
        sendUnauthorized(res);
    }
};

const sendConfirmationEmail = async (req, user) => {
    const { email, firstName, lastName } = user;
    const emailVerifyToken = await generateEmailVerifyToken(req, user);

    await sendEmailVerifyEmail({
        token: emailVerifyToken.token,
        destination: email,
        name: firstName || lastName
            ? `${firstName} ${lastName}`.trim()
            : email,
    });
};

const register = async (req, res) => {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(constants.HTTP_CODES.CONFLICT).json({
            message: 'Email is already registered',
        });
        return ;
    }

    const user = User(req.body);
    try {
        await user.save();
        sendConfirmationEmail(req, user);
        res.status(constants.HTTP_CODES.OK).json({
            user: user.safeToSend(true),
        });
        logInfo(`User ${user.email} has registered`);
    } catch (e) {
        logUnknownError(e);
        res.status(constants.HTTP_CODES.BAD_REQUEST).json(e);
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
            token: signJwtToken(user),
        });
    } catch (e) {
        logUnknownError(e);
        sendUnauthorized(res);
    }
};

const resendEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            sendUnauthorized(res);
            return;
        }
        await sendConfirmationEmail(req, user);
        res.sendStatus(constants.HTTP_CODES.OK);
    } catch (e) {
        logUnknownError(e);
        res.status(constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json(e);
    }
};

const lostPasswordEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const passwordToken = await generateToken();

        await sendForgotPasswordEmail({
            token: passwordToken,
            destination: email,
        });
        res.sendStatus(constants.HTTP_CODES.OK);
    } catch (e) {
        res.status(constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json(e);
        logUnknownError(e);
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
        logInfo(`User ${user.email} has recovered their password`);

        res.status(constants.HTTP_CODES.OK).json({
            user: user.safeToSend(true),
            token: signJwtToken(user),
        });
    } catch (e) {
        logUnknownError(e);
        res.status(constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json(e);
    }

};

module.exports = {
    authenticate,
    register,
    checkToken,
    verifyEmail,
    resendEmail,
    lostPasswordEmail,
    recoverPasswordRequest,
};
