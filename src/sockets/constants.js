const SocketEvents = {
    Connection: 'connection',
    Disconnect: 'disconnect',
    UserOnline: 'USER_ONLINE',
    UserOffline: 'USER_OFFLINE',
    UsersOnline: 'USERS_ONLINE',

    NewSequenceRequest: 'NEW_SEQUENCE_REQUEST',
    UpdateSequenceRequest: 'UPDATE_SEQUENCE_REQUEST',
    DeleteSequenceRequest: 'DELETE_SEQUENCE_REQUEST',

    NewSequenceResponse: 'NEW_SEQUENCE_RESPONSE',
    UpdateSequenceResponse: 'UPDATE_SEQUENCE_RESPONSE',
    DeleteSequenceResponse: 'DELETE_SEQUENCE_RESPONSE',

    NewSequenceError: 'NEW_SEQUENCE_ERROR',
    UpdateSequenceError: 'UPDATE_SEQUENCE_ERROR',
    DeleteSequenceError: 'DELETE_SEQUENCE_ERROR',

    SaveOptionsRequest: 'SAVE_OPTIONS_REQUEST',
    SaveOptionsResponse: 'SAVE_OPTIONS_RESPONSE',
    SaveOptionsError: 'SAVE_OPTIONS_ERROR',

    DeleteOptionsRequest: 'DELETE_OPTIONS_REQUEST',
    DeleteOptionsResponse: 'DELETE_OPTIONS_RESPONSE',
    DeleteOptionsError: 'DELETE_OPTIONS_ERROR',
};

module.exports = {
    SocketEvents,
};
