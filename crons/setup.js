const cron = require('node-cron');
const mongoose = require('mongoose');

const Story = require('../src/models/story').model;
const Rating = require('../src/models/rating').model;
const config = require('../src/config');

// Overriding the deprecated "Promise" module of mongoose.
// For more information see: https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useMongoClient: true, keepAlive: false });

cron.schedule('0 * * * *', async () => {
    console.log('Running cronjob');
    const stories = await Story.find();

    await Promise.all(
        stories.map(async story => {
            const ratings = await Rating.find({ story: story._id });

            if (!ratings.length) return ;

            const avg = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
            story.rating = +(avg.toFixed(2));
            story.ratingTimes = ratings.length;

            return story.save();
        })
    );
});
