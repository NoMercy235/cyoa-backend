module.exports = {
    routes: {
        auth: { prefix: '/auth', routes: require('./auth/auth.routes') },
        user: { prefix: '/api/user', routes: require('./user/user.routes') },
        story: { prefix: '/api/story', routes: require('./story/story.routes') },
    },
};
