module.exports = {
    routes: {
        auth: { prefix: '/auth', routes: require('./auth/auth.routes') },
        tag: { prefix: '/tag', routes: require('./tags/tags.routes') },

        pStory: { prefix: '/public/story', routes: require('./story/story.public.routes') },
        pSequence: { prefix: '/public/sequence', routes: require('./sequence/sequence.public.routes') },
        pPlayer: { prefix: '/public/player', routes: require('./player/player.public.routes') },
        pChapter: { prefix: '/public/chapter', routes: require('./chapter/chapter.public.routes') },

        user: { prefix: '/api/user', routes: require('./user/user.routes') },
        collection: { prefix: '/api/collection', routes: require('./collection/collection.routes') },
        story: { prefix: '/api/story', routes: require('./story/story.routes') },
        sequence: { prefix: '/api/sequence', routes: require('./sequence/sequence.routes') },
        option: { prefix: '/api/option', routes: require('./option/option.routes') },
        attribute: { prefix: '/api/attribute', routes: require('./attribute/attribute.routes') },
        chapter: { prefix: '/api/chapter', routes: require('./chapter/chapter.routes') },
        rating: { prefix: '/api/rating', routes: require('./rating/rating.routes') },
    },
};
