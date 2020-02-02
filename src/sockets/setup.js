const registerUserConnectionSocket = require('./user-connections');

const handleSocket = socket => {
    registerUserConnectionSocket(socket);
};

module.exports = {
    handleSocket,
};
