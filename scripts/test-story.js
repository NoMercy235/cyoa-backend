console.warn('Do not use this for production database!');

const mongoose = require('mongoose');
const faker = require('faker');

const User = require('../src/models/user').model;
const Tag = require('../src/models/tag').model;
const Collection = require('../src/models/collection').model;
const Story = require('../src/models/story').model;
const Attribute = require('../src/models/attribute').model;
const Chapter = require('../src/models/chapter').model;
const Sequence = require('../src/models/sequence').model;
const Option = require('../src/models/option').model;
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

async function createCollection (currentUser) {
    const collection = new Collection({
        name: `Test collection - ${faker.lorem.words()}`,
        description: 'test description',
        author: currentUser._id,
    });
    await collection.save();
    return collection;
}

async function createStory (currentUser, collection) {
    const tags = await Tag.find({}).exec();

    const story = new Story({
        name: `Test story - ${faker.lorem.words()}`,
        shortDescription: faker.lorem.paragraph(),
        longDescription: faker.lorem.paragraphs(),
        authorShort: `${currentUser.firstName} ${currentUser.lastName}`,
        published: true,
        // coverPic: '',
        author: currentUser._id,
        fromCollection: collection._id,
        tags: tags.map(t => t._id),
        tagsName: tags.map(t => t.name),
    });

    collection.stories.push(story._id);
    await collection.save();
    await story.save();
    return story;
}

async function createAttributes (story) {
    return await Promise.all(
        new Array(randomDigit() + 1)
            .fill(0)
            .map(async () => {
                const attribute = new Attribute({
                    name: faker.lorem.word(),
                    isImportant: faker.random.boolean(),
                    startValue: faker.random.number(100),
                    story: story._id,
                });
                return attribute.save();
            })
    );
}

async function createChapters (currentUser, story) {
    const promises = Promise.all(
        new Array(randomDigit() + 1)
            .fill(0)
            .map(async () => {
                const chapter = new Chapter({
                    name: faker.lorem.word(),
                    author: currentUser._id,
                    story: story._id,
                });
                story.chapters.push(chapter._id);
                return chapter.save();
            })
    );
    await story.save();
    const chapters = await promises;
    return chapters;
}

async function createSequences (currentUser, story, chapter) {
    const promises = Promise.all(
        new Array(randomDigit() + 1)
            .fill(0)
            .map(async (i) => {
                const sequence = new Sequence({
                    name: faker.lorem.words(),
                    content: faker.lorem.paragraphs(),
                    // isEnding: lowerRandomBoolean(10),
                    author: currentUser._id,
                    order: i,
                    story: story._id,
                    chapter: chapter._id,
                });
                chapter.sequences.push(sequence._id);
                return sequence.save();
            })
    );

    await chapter.save();
    const sequences = await promises;
    return sequences;
}

async function createStartSeq (story, sequences) {
    const seq = sequences[0];
    story.startSeq = seq._id;
    await story.save();
}

async function createEndingSeq (sequences) {
    const seq = sequences[sequences.length - 1];
    seq.isEnding = true;
    await seq.save();
}

async function createOptions (story, seqArr, attributes) {
    return Promise.all(seqArr.map(seqRow => {
        return Promise.all(
            seqRow.map(sequence => {
                return Promise.all(new Array(randomDigit() + 1)
                    .fill(0)
                    .map(async () => {
                        const option = new Option({
                            action: faker.lorem.words(),
                            story: story._id,
                            sequence: sequence._id,
                            nextSeq: randomElFromArr(seqRow)._id,
                            consequences: createConsequences(attributes),
                        });
                        sequence.options.push(option._id);
                        await sequence.save();
                        return await option.save();
                    }))
            })
        )
    }));
}

function createConsequences (attributes, nr) {
    if (!nr) nr = randomNumber(5, 1);
    return new Array(nr).fill(0).map(() => {
        const attr = randomElFromArr(attributes);
        return {
            attribute: attr.name,
            changeValue: randomNumber(100),
        };
    })
}

(async function generateStory(){
    const currentUser = await User.findOne({ email: adminEmail }).exec();

    if(!currentUser) {
        seedFailed(`User with email '${adminEmail}' not found`)
    }

    const collection = await createCollection(currentUser);
    const story = await createStory(currentUser, collection);
    const attributes = await createAttributes(story);
    const chapters = await createChapters(currentUser, story);

    const sequences = await Promise.all(
        chapters.map(chapter => {
            return createSequences(currentUser, story, chapter)
        }),
    );

    await createStartSeq(story, sequences[0]);
    await createEndingSeq(sequences[sequences.length - 1]);

    const options = await createOptions(story, sequences, attributes);

    const dbOptions = await Option.find({}).exec();

    // These have to be updated like this because of an issue in the createOptions method.
    // It looks like async await does not wait for all the promises there, and there are too many
    // save operations fired at once. This leads to mongo creating the same id for two different
    // resources, and this messes up the app.
    await Promise.all(dbOptions.map(async o => {
        const seq = await Sequence.findOne({ _id: o.sequence }).exec();
        // Fix because sometimes this fails for whatever reason
        if (!seq) return;
        seq.options.push(o._id);
        return seq.save();
    }));

    seedComplete({
        collection,
        story,
        attributes,
        chapters,
        sequences,
        options,
    })
})();

function seedComplete ({
    collection,
    story,
    attributes,
    chapters,
    sequences,
    options,
}) {
    const seqDisplay = sequences.map(s => s.length).join(', ');

    console.log('Seed complete');
    console.log(`Collection: ${collection.name} | ${collection._id}`);
    console.log(`Story: ${story.name} | ${story._id}`);
    console.log(`Attributes: ${attributes.length}`);
    console.log(`Chapters: ${chapters.length}`);
    console.log(`Sequences: ${seqDisplay}`);
    console.log(`Options: they are there`);
    process.exit(0);
}

function seedFailed (reason) {
    console.error(reason);
    process.exit(1);
}

function randomDigit() {
    return Math.floor(Math.random() * 10);
}

function randomNumber(max = 100, min = 0) {
    return Math.floor(Math.random() * max) + min;
}

function randomElFromArr (arr) {
    let pos = randomNumber(arr.length - 1);
    pos = pos < 0
        ? 0
        : (
            pos >= arr.length
                ? arr.length - 1
                : pos
        );
    return arr[pos];
}
