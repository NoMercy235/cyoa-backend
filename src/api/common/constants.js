const path = require('path');

const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

const HTTP_TIMED_EVENTS = {
    BEFORE_GET: 'BEFORE_GET',
    AFTER_GET: 'AFTER_GET',
    BEFORE_GET_ONE: 'BEFORE_GET_ONE',
    AFTER_GET_ONE: 'AFTER_GET_ONE',
    BEFORE_CREATE: 'BEFORE_CREATE',
    AFTER_CREATE: 'AFTER_CREATE',
    BEFORE_CREATE_MANY: 'BEFORE_CREATE_MANY',
    AFTER_CREATE_MANY: 'AFTER_CREATE_MANY',
    BEFORE_UPDATE: 'BEFORE_UPDATE',
    AFTER_UPDATE: 'AFTER_UPDATE',
    BEFORE_REMOVE: 'BEFORE_REMOVE',
    AFTER_REMOVE: 'AFTER_REMOVE',
    BEFORE_CUSTOM_ACTION: 'BEFORE_CUSTOM_ACTION',
    AFTER_CUSTOM_ACTION: 'AFTER_CUSTOM_ACTION',
};

const HTTP_CODES = {
    OK: 200,
    CREATE: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
};

// Expire in one month
const TOKEN_EXPIRE_TIME = 60 * 60 * 24 * 30;

const ERROR_MESSAGES = {
    resourceNotOwned: 'You do not own this resource',
    tokenExpired: 'Token is no longer valid',
    cannotPerformActionOnPublishedStory: 'Cannot perform action on published story',
};

const ERROR_CODES = {
    noStartSeq: 'noStartSeq',
    noEndSeq: 'noEndSeq',
    noRouteToEndSeq: 'noRouteToEndSeq',
    mongoError: 'MongoError',
    DUPLICATE_VALUE: 11000,
};

const BASE_UPLOAD_PATH = path.join( process.cwd(), 'uploads');
const UPLOAD_PATHS = {
    Base: BASE_UPLOAD_PATH,
    Profile: path.join(BASE_UPLOAD_PATH, 'profile'),
};

module.exports = {
    HTTP_METHODS,
    HTTP_TIMED_EVENTS,
    HTTP_CODES,
    TOKEN_EXPIRE_TIME,
    ERROR_MESSAGES,
    ERROR_CODES,
    UPLOAD_PATHS,
};
