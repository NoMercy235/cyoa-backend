console.warn('Do not use this for production database!');

const mongoose = require('mongoose');

const User = require('../../src/models/user').model;
const Tag = require('../../src/models/tag').model;
const Collection = require('../../src/models/collection').model;
const Story = require('../../src/models/story').model;
const Attribute = require('../../src/models/attribute').model;
const Chapter = require('../../src/models/chapter').model;
const Sequence = require('../../src/models/sequence').model;
const Option = require('../../src/models/option').model;
const config = require('../../src/config');

const aManNamedStanley = {
    sequences: require ('./sequences/a-man-named-stanley'),
    options: require ('./options/a-man-named-stanley'),
};
const notToday = {
    sequences:  require('./sequences/not-today'),
};

// Overriding the deprecated "Promise" module of mongoose.
// For more information see: https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useMongoClient: true, keepAlive: false });

const adminEmail = 'admin@tta.com';

async function createCollection (currentUser) {
    const collection = new Collection({
        name: `The Stanley Parable`,
        description: 'The story of Stanley. A simple worker.',
        author: currentUser._id,
    });
    await collection.save();
    return collection;
}

async function createStory (currentUser, collection) {
    const tags = (
        await Tag.find({}).exec()
    ).filter(t => {
        return ['Psychological'].includes(t.name);
    });


    const longDescription = `Stanley is just your ordinary man. He has a family, a workplace and follows a well-established routine every day. Although his actions seem repetitive, he is content with his life. Stanley feels happy.

One day, some change of events will make Stanley step out of his comfort zone and take the grip of his own fate. Will he be able to cope with the truth he discovers? Or the new state in which Stanley find himself will overtake him and end his life?

That's for you to decide. Take Stanley's fate into your own hands as you guide him towards a new experience - for the good or bad of it.`;

    const story = new Story({
        name: `The Stanley Parable`,
        shortDescription: 'The story of a completely ordinary man named Stanley.',
        longDescription: longDescription,
        authorShort: `${currentUser.firstName} ${currentUser.lastName}`,
        published: true,
        // coverPic: '',
        author: currentUser._id,
        fromCollection: collection._id,
        tags: tags.map(t => t._id),
        tagsName: tags.map(t => t.name),
    });
    await story.save();
    return story;
}

async function createAttributes (story) {
    const attribute = new Attribute({
        name: 'Health',
        isImportant: true,
        startValue: 100,
        story: story._id,
    });
    return attribute.save();
}

const sequences = [
    ...aManNamedStanley.sequences,
    ...notToday.sequences,
];

const options = {
    aManNamedStanley: aManNamedStanley.options,
};

async function createSequences (currentUser, story) {
    return await Promise.all(
        sequences.map(async (s, i) => {
            const sequence = new Sequence({
                name: s.name,
                content: s.content,
                author: currentUser._id,
                order: i,
                isEnding: !!s.isEnding,
                story: story._id,
            });

            return sequence.save();
        })
    );
}

async function createOptions (story, dbSequences) {
    return Promise.all(
        dbSequences.map(dbSeq => {
            const mySeq = sequences.find(s => s.name === dbSeq.name);
            const myOpts = options[mySeq.id];

            return Promise.all((myOpts || []).map(async (o) => {
                const nextSeq = dbSequences.find(dbS => dbS.name === (
                    sequences.find(s => s.id === o.nextSeq).name
                ));

                const option = new Option({
                    action: o.action,
                    story: story._id,
                    sequence: dbSeq._id,
                    nextSeq: nextSeq._id,
                    consequences: o.consequences,
                });

                dbSeq.options.push(option._id);
                await dbSeq.save();

                return option.save();
            }))
        })
    )
}

(async function generateStory(){
    const currentUser = await User.findOne({ email: adminEmail }).exec();

    if(!currentUser) {
        seedFailed(`User with email '${adminEmail}' not found`)
    }

    const collection = await createCollection(currentUser);
    const story = await createStory(currentUser, collection);
    const attributes = await createAttributes(story);

    const sequences = await createSequences(currentUser, story);

    story.startSeq = sequences[0].id;
    await story.save();

    // await createStartSeq(story, sequences[0]);
    // await createEndingSeq(sequences[sequences.length - 1]);
    //
    const options = await createOptions(story, sequences);

    seedComplete({
        collection,
        story,
        attributes,
        // chapters,
        sequences,
        options,
    })
})();

function seedComplete ({
    collection,
    story,
    attributes,
    // chapters,
    sequences,
    // options,
}) {
    const seqDisplay = sequences.map(s => s.length).join(', ');

    console.log('Seed complete');
    console.log(`Collection: ${collection.name} | ${collection._id}`);
    console.log(`Story: ${story.name} | ${story._id}`);
    console.log(`Attributes: ${attributes.length}`);
    // console.log(`Chapters: ${chapters.length}`);
    console.log(`Sequences: ${seqDisplay}`);
    console.log(`Options: they are there`);
    process.exit(0);
}

function seedFailed (reason) {
    console.error(reason);
    process.exit(1);
}

function randomString(length = 5) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function randomDigit() {
    return Math.floor(Math.random() * 10);
}

function randomNumber(max = 100, min = 0) {
    return Math.floor(Math.random() * max) + min;
}

function randomWord(max = 10, min = 0) {
    return randomString(randomNumber(max, min) + 1);
}

function randomBoolean() {
    return randomDigit() % 2 === 0;
}

function lowerRandomBoolean(chance) {
    return randomNumber(chance) === 0;
}

function randomText (length) {
    if (!length) length = randomNumber() + 1;
    return new Array(length)
        .fill(0)
        .map(() => randomWord())
        .join(' ');
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