let mongoose = require('mongoose');

let Story = require('../src/models/story').model;
let Sequence = require('../src/models/sequence').model;
let config = require('../src/config');

// Overriding the deprecated "Promise" module of mongoose.
// For more information see: https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useMongoClient: true, keepAlive: false });

(async function (){
    try {
        const stories = await Story.find({}).exec();
        await Promise.all(stories.map(async story => {
            const sequences = await Sequence.find({ story: story._id }).exec();
            let order = 1;
            console.group(story.name);
            const promises = Promise.all(sequences.map(async seq => {
                seq.order = order;
                console.log(seq.name + ' : ' + order);
                order += 1;
                return seq.save();
            }));
            console.groupEnd();
            return promises;
        }));
        seedComplete();
    } catch (e) {
        seedFailed(e);
    }
})();

function seedComplete() {
    console.log('===================================');
    console.log('   Sequence order fill completed   ');
    console.log('===================================');
    process.exit(0);
}

function seedFailed(err) {
    console.error(err);
    process.exit(1);
}
