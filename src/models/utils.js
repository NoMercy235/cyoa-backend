const { ERROR_CODES, HTTP_CODES } = require('../api/common/constants');
const { model: Log, LogType } = require('./log');

function handleUniqueError (body) {
    return (err, doc, next) => {
        if (err.name === ERROR_CODES.mongoError && err.code === ERROR_CODES.DUPLICATE_VALUE) {
            next({ status: HTTP_CODES.CONFLICT, body });
        } else {
            next(err);
        }
    };
}

function logMessage (type) {
    return (message, extra = undefined) => {
        const log = Log({
            type,
            message,
            extra,
        });
        return log.save();
    };
}

module.exports = {
    handleUniqueError,
    logError: logMessage(LogType.Error),
    logInfo: logMessage(LogType.Info),
};
