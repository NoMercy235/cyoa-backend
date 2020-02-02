module.exports = {
    secret: 'secret',
    database: 'mongodb://url',
    email: {
        redirectHost: 'http://redirectLocation',
        service: 'serviceProvider',
        port: 11111,
        from: 'from',
        email: 'fromEmail',
        password: 'somePassword',
    },
    lostPasswordTokenExpiry: 60 * 1000, // 60 seconds
};
