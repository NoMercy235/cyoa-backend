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
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
};

const TOKEN_EXPIRE_TIME = 1440 * 60;

module.exports = {
    HTTP_METHODS: HTTP_METHODS,
    HTTP_TIMED_EVENTS: HTTP_TIMED_EVENTS,
    HTTP_CODES: HTTP_CODES,
    TOKEN_EXPIRE_TIME: TOKEN_EXPIRE_TIME,
};