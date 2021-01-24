console.warn('Do not use this for production database!');

const mongoose = require('mongoose');

const User = require('../src/models/user').model;
const Tag = require('../src/models/tag').model;
const config = require('../src/config');

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

const adminEmail = 'admin@tta.com';

async function addAdmin() {
    const user = await User.find({ email: adminEmail });
    if (user) {
        console.log('Admin already exists');
        return;
    }

    const admin = new User({
        firstName: 'admin',
        lastName: 'tta',
        email: adminEmail,
        password: '123456',
        isAdmin: true,
        isActive: true,
    });
    try {
        await admin.save();
        console.log('Admin user added successfully');
    } catch (e) {
        seedFailed(e)
    }
}

(async function (){
    await addAdmin();

    const promises = ['Action', 'Adventure', 'Fantasy', 'Drama', 'Mystery', 'Thriller', 'Horror'].map(tagName => {
        const tag = new Tag({ name: tagName });
        return tag.save();
    });
    await Promise.all(promises);

    seedComplete();
})();


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
