const registerUserConnectionSocket = require('./user-connections');
const registerWriteStorySocket = require('./write-story');

const handleSocket = socket => {
    registerUserConnectionSocket(socket);
    registerWriteStorySocket(socket);
};

module.exports = {
    handleSocket,
};
