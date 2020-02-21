const { SocketEvents } = require('./constants');

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

const handleUserConnected = (socket) => {
    const exist = findUserIndex(socket.__INSTANCE_USER_ID);
    if (exist > -1) {
        store.onlineUsers[exist].instances ++;
        socket.emit(
            SocketEvents.UsersOnline,
            { onlineUsers: getOnlineUsers() },
        );
        return;
    }
    store.onlineUsers.push({
        id: socket.__INSTANCE_USER_ID,
        instances: 1,
    });
    socket.emit(
        SocketEvents.UsersOnline,
        { onlineUsers: getOnlineUsers() },
    );
    socket.broadcast.emit(
        SocketEvents.UsersOnline,
        { onlineUsers: getOnlineUsers() },
    );
};

const handleUserDisconnected = socket => () => {
    const exist = findUserIndex(socket.__INSTANCE_USER_ID);
    if (!store.onlineUsers[exist]) return;

    store.onlineUsers[exist].instances --;
    if (store.onlineUsers[exist].instances === 0) {
        // Could also remove the user from the array, if it gets too big
        socket.broadcast.emit(
            SocketEvents.UsersOnline,
            { onlineUsers: getOnlineUsers() },
        );
    }
};

function registerUserConnectionSocket (socket) {
    socket.on(SocketEvents.UserOnline, (id) => {
        socket.__INSTANCE_USER_ID = id;
        handleUserConnected(socket);
    });
    socket.emit(
        SocketEvents.UsersOnline,
        { onlineUsers: getOnlineUsers() },
    );

    socket.on(SocketEvents.Disconnect, handleUserDisconnected(socket));
}

module.exports = registerUserConnectionSocket;
