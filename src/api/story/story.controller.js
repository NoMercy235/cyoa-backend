const BaseController = require('../common/base.controller');
const Story = require('../../models/story').model;
const Sequence = require('../../models/sequence').model;
const Player = require('../../models/player').model;
const constants = require('../common/constants');

const findByCb = function (req) {
    return { _id: req.params.id };
};

const storyCtrl = new BaseController(Story, findByCb);

storyCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_CREATE].push((req, item) => {
    const { user } = req;
    item.author = user._id;
    item.authorShort = `${user.firstName} ${user.lastName}`;
});

storyCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET].push((req, query) => {
    query.find({ author: req.user._id });
    return query;
});

storyCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET_ONE].push((req, query) => {
    query.populate({ path: 'author', select: [ 'email', 'firstName', 'lastName' ] });
});

storyCtrl.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_UPDATE].push(async (req, item) => {
    await checkAuthor(req);
    delete item.published;
});

async function checkAuthor(req) {
    const story = await Story.findOne({ _id: req.params.id }).exec();
    if (story.author !== req.user._id.toString()) {
        throw { message: constants.ERROR_MESSAGES.resourceNotOwned };
    }
}

async function publishStory (req) {
    await checkAuthor(req);

    const storyId = req.params.id;
    const published = req.body.published;
    const story = await Story.findOne({ _id: storyId });

    if (published) {
        await checkIfStoryCanPublish(story);
    } else {
        await Player.deleteMany({ story: storyId });
    }

    story.published = published;
    await story.save();
    return story;
}

async function checkIfStoryCanPublishRoute (req) {
    const storyId = req.params.id;
    const story = await Story.findOne({ _id: storyId });
    await checkIfStoryCanPublish(story);
}


async function checkIfStoryCanPublish (story) {
    let errorMessages = {};

    if (!story.startSeq) {
        errorMessages[constants.ERROR_CODES.noStartSeq] = true;
    } else if (!(await checkRouteFromStartSeqToAnyEndSeq(story.startSeq))) {
        errorMessages[constants.ERROR_CODES.noRouteToEndSeq] = true;
    }

    const endSequences = await Sequence.find({
        story: story._id,
        isEnding: true,
    });

    if (!endSequences.length) {
        errorMessages[constants.ERROR_CODES.noEndSeq] = true;
    }


    if (Object.keys(errorMessages).length) {
        throw {
            status: constants.HTTP_CODES.BAD_REQUEST,
            message: errorMessages,
        };
    }
}

async function getSequenceById (id) {
    return await Sequence
        .findOne({ _id: id })
        .select('-scenePic')
        .populate(['options']);
}

function getUnvisitedSequences (sequences) {
    return Object.keys(sequences);
}

function getFirstUnvisitedSequence (sequences) {
    return getUnvisitedSequences(sequences).find(seqId => !sequences[seqId]);
}

async function checkRouteFromStartSeqToAnyEndSeq (startSeqId) {
    const seq = await getSequenceById(startSeqId);
    /**
     * All properties will be ids of sequences.
     * They will be initially set to false to mark that they have not been visited except
     * for the startSeqId which is the point from where we start.
     */
    const sequences = {
        startSeqId: true,
    };
    (seq.options || []).forEach(o => {
        sequences[o.nextSeq] = false;
    });

    while (getUnvisitedSequences(sequences).length) {
        const lastSeqId = getFirstUnvisitedSequence(sequences);
        if (!lastSeqId) {
            return false;
        }

        const seq = await getSequenceById(lastSeqId);

        if (seq.isEnding) {
            return true;
        }

        /**
         * For each now option, we check if it leads to an unknown sequence and,
         * if it does, we add that to our sequences object and mark it as unvisited.
         */
        seq.options.forEach(o => {
            if (!sequences[o.nextSeq]) {
                sequences[o.nextSeq] = false;
            }
        });

        // Mark the current sequence as visited
        sequences[lastSeqId] = true;
    }
    return false;
}

module.exports = {
    get: storyCtrl.get(),
    getOne: storyCtrl.getOne(),
    create: storyCtrl.create(),
    update: storyCtrl.update(),
    remove: storyCtrl.remove(),
    publishStory: storyCtrl.createCustomHandler(publishStory),
    checkIfStoryCanPublish: storyCtrl.createCustomHandler(checkIfStoryCanPublishRoute),
};
