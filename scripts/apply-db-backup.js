const mongoose = require('mongoose');
const config = require('../src/config');
const utils = require('./script-utils');
const fs = require('fs');
const path = require('path');

// Overriding the deprecated "Promise" module of mongoose.
// For more information see: https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;
// Providing the 'useMongoClient' property to get rid of the deprecated message.
mongoose.connect(
    config.database,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        keepAlive: false,
    },
);

const BACKUP_PATH = getBackupBath();
const MODELS_PATH = path.join(__dirname, '..', 'src', 'models');

function getBackupBath() {
    const arg = process.argv[2];
    if (arg) {
        if (arg.startsWith('/')) {
            return arg;
        } else {
            return path.join(process.cwd(), arg);
        }
    } else {
        return path.join(__dirname, 'backup', utils.getCurrentDate());
    }
}

function noExt(name) {
    return name.split('.')[0];

}

function toJsExt(jsonName) {
    return `${noExt(jsonName)}.js`;
}

(async function() {
    const modelsNames = fs.readdirSync(BACKUP_PATH);

    for (let modelName of modelsNames) {
        const modelPath = path.join(BACKUP_PATH, modelName);
        const docs = JSON.parse(fs.readFileSync(modelPath));
        const model = require(path.join(MODELS_PATH, toJsExt(modelName))).model;

        await model.remove({});
        try {
            await model.insertMany(docs);
            console.log(`Applied backup for: ${noExt(modelName)} (inserted ${docs.length} docs)`);
        } catch (e) {
            console.warn(`Could not insert all ${noExt(modelName)} at once... Trying one by one`);
            let inserted = 0;
            for (let doc of docs) {
                try {
                    const dbDoc = new model(doc);
                    await dbDoc.save();
                    inserted ++;
                } catch (err) {
                    console.warn(`Could not insert ${doc._id} (${noExt(modelName)}) because:`)
                    console.warn(err);
                }

            }
            console.log(`Applied PARTIAL backup for ${noExt(modelName)}. Inserted ${inserted}. Failed ${docs.length - inserted}`);
        }
    }

    console.log('Successfully applied the backup!');
    process.exit(0);
})();
