const { SocketEvents } = require('./constants');

const store = {
    users: {
        online: 0,
    },
};

const handleUserConnected = () => {
    store.users.online ++;
};

const handleUserDisconnected = () => {
    store.users.online --;
};

const handleSocket = socket => {
    handleUserConnected();
    socket.emit(
        SocketEvents.SendUsersOnline,
        { onlineUsers: store.users.online },
    );
    socket.broadcast.emit(
        SocketEvents.SendUsersOnline,
        { onlineUsers: store.users.online },
    );

    socket.on(SocketEvents.Disconnect, handleUserDisconnected);
};

module.exports = {
    handleSocket,
};
