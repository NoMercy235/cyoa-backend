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

function registerUserConnectionSocket (socket) {
    handleUserConnected();
    socket.emit(
        SocketEvents.UsersOnline,
        { onlineUsers: store.users.online },
    );
    socket.broadcast.emit(
        SocketEvents.UsersOnline,
        { onlineUsers: store.users.online },
    );

    socket.on(SocketEvents.Disconnect, handleUserDisconnected);
}

module.exports = registerUserConnectionSocket;
