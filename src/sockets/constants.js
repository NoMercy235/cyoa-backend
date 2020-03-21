const SocketEvents = {
    Connection: 'connection',
    Disconnect: 'disconnect',
    UserOnline: 'USER_ONLINE',
    UserOffline: 'USER_OFFLINE',
    UsersOnline: 'USERS_ONLINE',

    NewSequenceRequest: 'NEW_SEQUENCE_REQUEST',
    UpdateSequenceRequest: 'UPDATE_SEQUENCE_REQUEST',
    DeleteSequenceRequest: 'DELETE_SEQUENCE_REQUEST',
    NewOptionRequest: 'NEW_OPTION_REQUEST',
    UpdateOptionRequest: 'UPDATE_OPTION_REQUEST',
    DeleteOptionRequest: 'DELETE_OPTION_REQUEST',

    NewSequenceResponse: 'NEW_SEQUENCE_RESPONSE',
    UpdateSequenceResponse: 'UPDATE_SEQUENCE_RESPONSE',
    DeleteSequenceResponse: 'DELETE_SEQUENCE_RESPONSE',
    NewOptionResponse: 'NEW_OPTION_RESPONSE',
    UpdateOptionResponse: 'UPDATE_OPTION_RESPONSE',
    DeleteOptionResponse: 'DELETE_OPTION_RESPONSE',

    NewSequenceError: 'NEW_SEQUENCE_ERROR',
    UpdateSequenceError: 'UPDATE_SEQUENCE_ERROR',
    DeleteSequenceError: 'DELETE_SEQUENCE_ERROR',
    NewOptionError: 'NEW_OPTION_ERROR',
    UpdateOptionError: 'UPDATE_OPTION_ERROR',
    DeleteOptionError: 'DELETE_OPTION_ERROR',
};

module.exports = {
    SocketEvents,
};
