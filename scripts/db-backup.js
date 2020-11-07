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

const MODELS_PATH = path.join(__dirname, '..', 'src', 'models');
const BACKUP_PATH = path.join(__dirname, 'backup');
const BACKUP_FOLDER = path.join(BACKUP_PATH, utils.getCurrentDate());

if (!fs.existsSync(BACKUP_PATH)){
    fs.mkdirSync(BACKUP_PATH);
}
if (!fs.existsSync(BACKUP_FOLDER)) {
    fs.mkdirSync(BACKUP_FOLDER);
}

function writeBackUp(modelName, docs) {
    return new Promise((resolve) => {
        const resource = modelName.split('.')[0];
        const resourcePath = path.join(BACKUP_FOLDER, `${resource}.json`);
        fs.writeFileSync(resourcePath, JSON.stringify(docs), { flag: 'w' });
        console.log('Backup completed for: ' + resource);
        resolve();
    });
}

(async function() {
    let models = {};

    const modelsNames = fs.readdirSync(MODELS_PATH);

    for (let modelName of modelsNames) {
        models[modelName] = require(path.join(MODELS_PATH, modelName));

        if (!models[modelName].model) {
            console.log('Skipped file: ' + modelName);
            continue;
        }

        const docs = await models[modelName].model.find({}).exec();
        await writeBackUp(modelName, docs);
    }

    console.log('Backup finished!');
    process.exit(0);
})();
