let mongoose = require('mongoose');

let Tag = require('../src/models/tag').model;
let config = require('../src/config');

// Overriding the deprecated "Promise" module of mongoose.
// For more information see: https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useMongoClient: true, keepAlive: false });

const tags = [
    'Adventure',
    'Drama',
    'Fantasy',
    'Horror',
    'Mystery',
    'Psychological',
    'Romance',
    'Science Fiction',
];
Tag.find({}).exec().then(async data => {
    if (!data || !data.length) {
        for (let tag of tags) {
            const dbTag = new Tag({ name: tag });
            await dbTag.save();
        }
        console.log('Tags added successfully');
        seedComplete();
    } else {
        console.log('Tags already exists');
        seedComplete();
    }
}).catch(seedFailed);

function seedComplete() {
    console.log('===================================');
    console.log('        Tags seed complete         ');
    console.log('===================================');
    process.exit(0);
}

function seedFailed(err) {
    console.error(err);
    process.exit(1);
}
