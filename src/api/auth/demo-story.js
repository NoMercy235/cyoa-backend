const Story = require('../../models/story').model;
const Sequence = require('../../models/sequence').model;
const Attribute = require('../../models/attribute').model;
const Option = require('../../models/option').model;
const Tag = require('../../models/tag').model;

async function createStory (user) {
    const tag = await Tag.findOne({});

    const story = new Story({
        name: `This is your first demo story`,
        shortDescription: 'Inside, you have some examples for how a story should look like',
        longDescription: 'Feel free to explore and modify the existing content, or just create a new story by yourself',
        authorShort: `${user.firstName} ${user.lastName}`,
        published: false,
        // coverPic: '',
        author: user._id,
        tags: [tag._id],
        tagsName: tag.name,
    });

    await story.save();
    return story;
}

async function createSequences (user, story) {
    const promises = [
        {
            name: 'Starting sequence',
            content: 'This is the first part of the story that will be shown to the player. From here on, they may continue using the paths that you set',
            x: 129,
            y:143,
        },
        {
            name: 'Story content',
            content: 'You will be able to add as many sequences as you like to tell your story. The player will navigate through them based on the decisions they make.',
            x: 256,
            y: 143,
        },
        {
            name: 'Option 1',
            content: 'You have reached this place by picking the first option.',
            x: 387,
            y: 84,
        },
        {
            name: 'Option 2',
            content: 'You have reached this place by picking the second option.',
            x: 387,
            y: 215,
        },
        {
            name: 'Ending',
            content: 'You have reached the ending.',
            isEnding: true,
            x: 608,
            y: 143,
        },
        {
            name: 'Death by Hit points',
            content: 'You met your demise sooner than expected',
            isEnding: true,
            x: 608,
            y: 248,
        },
    ].map((sequence, index) => {
        return {
            ...sequence,
            author: user._id,
            story: story._id,
            order: index,
        }
    }).map(sequence => {
        const dbSeq = new Sequence(sequence);
        return dbSeq.save();
    });
    return await Promise.all(promises);
}

async function createAttributes (story, hpLinkedSequence) {
    const promises = [
        {
            name: 'Hit points',
            description: 'This is your character\'s HP. It is set as an important attribute, because the player will lose the story if the value reaches 0. When this happens, the linked ending which will be shown to the player.',
            isImportant: true,
            startValue: 100,
            story: story._id,
            linkedEnding: hpLinkedSequence,
        },
        {
            name: 'Money',
            description: 'This is your character\'s currency. Since it is not an important attribute, the value may reach 0 and still allow the player to continue reading.',
            isImportant: false,
            startValue: 30,
            story: story._id,
        },
    ].map(attribute => {
        const dbAttribute = new Attribute(attribute);
        return dbAttribute.save();
    });
    return await Promise.all(promises);
}

async function createOptions (story, seqArr, attributes) {
    const promises = [
        {
            action: 'Continue',
            sequence: seqArr[0]._id,
            nextSeq: seqArr[1]._id,
        },
        {
            action: 'Go to option 1',
            sequence: seqArr[1]._id,
            nextSeq: seqArr[2]._id,
        },
        {
            action: 'Go to option 2',
            sequence: seqArr[1]._id,
            nextSeq: seqArr[3]._id,
        },
        {
            action: 'Lose 100 Hit points and reach the "Death by Hit points" ending',
            sequence: seqArr[1]._id,
            nextSeq: seqArr[3]._id,
            consequences: [{ attribute: attributes[0].name, changeValue: -100 }],
        },
        {
            action: 'Go to end from option 1',
            sequence: seqArr[2]._id,
            nextSeq: seqArr[4]._id,
        },
        {
            action: 'Go to end from option 2',
            sequence: seqArr[3]._id,
            nextSeq: seqArr[4]._id,
        },
    ].map(option => {
        return {
            ...option,
            story: story._id,
        };
    }).map(async option => {
        const dbOption = new Option(option);
        await dbOption.save();
        const seq = await Sequence.findOne({ _id: dbOption.sequence });
        seq.options.push(dbOption._id);
        await seq.save();
    });
    return await Promise.all(promises);
}

async function createStoryForUser(user) {
    const story = await createStory(user);
    const sequences = await createSequences(user, story);
    story.startSeq = sequences[0]._id;
    await story.save();
    const attributes = await createAttributes(story, sequences[5]._id);
    await createOptions(story, sequences, attributes);
}

module.exports = {
    createStoryForUser,
};
