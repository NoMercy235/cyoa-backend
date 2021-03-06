console.warn('Do not use this for production database!');

const mongoose = require('mongoose');

const Collection = require('../../src/models/collection').model;
const Story = require('../../src/models/story').model;
const Attribute = require('../../src/models/attribute').model;
const Chapter = require('../../src/models/chapter').model;
const Sequence = require('../../src/models/sequence').model;
const Option = require('../../src/models/option').model;
const config = require('../../src/config');

// Overriding the deprecated "Promise" module of mongoose.
// For more information see: https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;
mongoose.connect(
    config.database,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        keepAlive: false,
    },
);


(async function generateStory(){
    await Collection.deleteMany({ name: /The Stanley Parable/i }).exec();
    const stories = await Story.find({ name: /The Stanley Parable/i }).exec();
    await Story.deleteMany({ name: /The Stanley Parable/i }).exec();

    await Promise.all(
        stories.map(story => {
            return Attribute.deleteMany({ story: story._id });
        })
    );

    await Promise.all(
        stories.map(story => {
            return Chapter.deleteMany({ story: story._id }).exec()
        })
    );

    await Promise.all(
        stories.map(story => {
            return Sequence.deleteMany({ story: story._id }).exec()
        })
    );

    await Promise.all(
        stories.map(story => {
            return Option.deleteMany({ story: story._id.toString() }).exec()
        })
    );

    completed();
})();

function completed () {
    console.log('Database cleaned');
    process.exit(0);
}
