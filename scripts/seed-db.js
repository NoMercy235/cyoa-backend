console.warn('Do not use this for production database!');

let mongoose = require('mongoose');

let User = require('../src/models/user').model;
let config = require('../src/config');

// Overriding the deprecated "Promise" module of mongoose.
// For more information see: https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useMongoClient: true, keepAlive: false });

const adminEmail = 'admin@tta.com';

User.find({ email: adminEmail }).exec().then((data) => {
    if (!data || !data.length) {
        let admin = new User({
            firstName: 'admin',
            lastName: 'tta',
            email: adminEmail,
            password: '123456',
            isAdmin: true,
            isActive: true,
        });
        console.log('Admin user added successfully');
        admin.save().then(seedComplete).catch(seedFailed);
    } else {
        console.log('Admin already exists');
        seedComplete();
    }
}).catch(seedFailed);

function seedComplete() {
    console.log('===================================');
    console.log('            Seed complete          ');
    console.log('===================================');
    process.exit(0);
}

function seedFailed(err) {
    console.error(err);
    process.exit(1);
}
