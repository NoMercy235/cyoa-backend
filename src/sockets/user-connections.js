const { SocketEvents } = require('./constants');
const { logInfo } = require('../models/utils');

const store = {
    onlineUsers: [],
};

const getOnlineUsers = () =>
    store.onlineUsers.filter(({ instances }) => instances).length;

const findUserIndex = (localId) => {
    return store.onlineUsers.findIndex(({ id }) => {
        return id === localId
    });
};

const sendToSelf = (socket) => {
    socket.emit(
        SocketEvents.UsersOnline,
        { onlineUsers: getOnlineUsers() },
    );
};

const sendToAll = (socket) => {
    sendToSelf(socket);
    socket.broadcast.emit(
        SocketEvents.UsersOnline,
        { onlineUsers: getOnlineUsers() },
    );
};

const handleUserConnected = (socket) => {
    const exist = findUserIndex(socket.__INSTANCE_USER_ID);
    if (exist > -1) {
        store.onlineUsers[exist].instances ++;
        sendToSelf(socket);
        return;
    }
    logInfo(`User(${socket.__INSTANCE_USER_ID}) is online`);
    store.onlineUsers.push({
        id: socket.__INSTANCE_USER_ID,
        instances: 1,
    });
    sendToAll(socket);
};

const handleUserDisconnected = socket => () => {
    const tmpId = socket.__INSTANCE_USER_ID;
    const exist = findUserIndex(socket.__INSTANCE_USER_ID);
    socket.__INSTANCE_USER_ID = undefined;
    if (!store.onlineUsers[exist]) return;

    store.onlineUsers[exist].instances --;
    if (store.onlineUsers[exist].instances === 0) {
        logInfo(`User(${tmpId}) is offline`);
        sendToAll(socket);
    }
};

function registerUserConnectionSocket (socket) {
    socket.on(SocketEvents.UserOnline, (id) => {
        socket.__INSTANCE_USER_ID = id;
        handleUserConnected(socket);
    });
    socket.on(SocketEvents.UserOffline, handleUserDisconnected(socket));
    sendToSelf(socket);

    socket.on(SocketEvents.Disconnect, handleUserDisconnected(socket));
}

module.exports = registerUserConnectionSocket;
