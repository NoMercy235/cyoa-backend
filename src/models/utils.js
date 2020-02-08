const { ERROR_CODES, HTTP_CODES } = require('../api/common/constants');

function handleUniqueError (body) {
    return (err, doc, next) => {
        if (err.name === ERROR_CODES.mongoError && err.code === ERROR_CODES.DUPLICATE_VALUE) {
            next({ status: HTTP_CODES.CONFLICT, body });
        } else {
            next(err);
        }
    };
}

module.exports = {
    handleUniqueError,
};
