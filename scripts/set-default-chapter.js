let mongoose = require('mongoose');

let Sequence = require('../src/models/sequence').model;
let config = require('../src/config');

// Overriding the deprecated "Promise" module of mongoose.
// For more information see: https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useMongoClient: true, keepAlive: false });

(async function (){
    try {
        const sequences = await Sequence.find({}).exec();
        await Promise.all(
            sequences.map(async seq => {
                if (seq.chapter === null || seq.chapter === undefined) {
                    seq.chapter = '';
                    return seq.save();
                }
            })
        );
        seedComplete();
    } catch (e) {
        seedFailed(e);
    }
})();

function seedComplete() {
    console.log('======================================');
    console.log('Sequence have default value on chapter');
    console.log('======================================');
    process.exit(0);
}

function seedFailed(err) {
    console.error(err);
    process.exit(1);
}
