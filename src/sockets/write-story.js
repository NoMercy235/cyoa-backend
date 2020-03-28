const Story = require('../models/story').model;
const Sequence = require('../models/sequence').model;
const Option = require('../models/option').model;
const { SocketEvents } = require('./constants');

const updateStoryStartSeq = async (storyId, startSeq) => {
    return await Story.findOneAndUpdate(
        { _id: storyId },
        { $set: { startSeq } },
        { new: true, runValidators: true },
    );
};
const handleNewSequence = socket => async ({ sequence, isStartSeq }) => {
    const dbSequence = new Sequence(sequence);
    dbSequence.hasScenePic = !!dbSequence.scenePic;
    const lastSeqInOrder = await Sequence.findLastInOrder();
    dbSequence.order = lastSeqInOrder ? lastSeqInOrder.order + 1 : 0;
    try {
        await dbSequence.save();
        socket.emit(
            SocketEvents.NewSequenceResponse,
            {
                sequence: dbSequence,
                ...(isStartSeq && { story: await updateStoryStartSeq(dbSequence.story, dbSequence._id) }),
            },
        );
    } catch (e) {
        console.log(e);
        socket.emit(
            SocketEvents.NewSequenceError,
            e,
        );
    }
};

const handleUpdateSequence = socket => async ({ sequence, isStartSeq }) => {
    const { _id: seqId, ...toUpdate } = sequence;
    try {
        const dbSequence = await Sequence.findOneAndUpdate(
            { _id: seqId },
            { $set: toUpdate },
            { new: true, runValidators: true },
        );
        socket.emit(
            SocketEvents.UpdateSequenceResponse,
            {
                sequence: dbSequence,
                ...(isStartSeq && { story: await updateStoryStartSeq(dbSequence.story, dbSequence._id) }),
            },
        );
    } catch (e) {
        console.log(e);
        socket.emit(
            SocketEvents.UpdateSequenceError,
            e,
        );
    }
};

const handleRemoveSequence = socket => async ({ storyId, sequenceId }) => {
    try {
        const dbSequence = await Sequence.findOneAndRemove(
            { _id: sequenceId },
        );
        await Option.deleteMany(
            {
                $or: [
                    { nextSeq: sequenceId },
                    { sequence: sequenceId },
                ]
            },
        );
        const story = await Story.findOne({ _id: storyId });
        socket.emit(
            SocketEvents.DeleteSequenceResponse,
            {
                sequence: dbSequence,
                ...((story.startSeq === sequenceId) && { story: await updateStoryStartSeq(storyId, '') }),
            },
        );
    } catch (e) {
        console.log(e);
        socket.emit(
            SocketEvents.DeleteSequenceError,
            e,
        );
    }
};

const handleSaveOptions = socket => async (options) => {
    try {
        const optionsToCreate = options.filter(o => !o._id);
        const optionsToUpdate = options.filter(o => !!o._id);

        const createOperations = optionsToCreate.map(o => {
            const { _id, ...metadata } = o;
            const dbOption = new Option(metadata);
            return dbOption.save();
        });

        const updateOperations = optionsToUpdate.map(o => {
            const { _id: optionId, ...toUpdate } = o;
            return Option.findOneAndUpdate(
                { _id: optionId },
                { $set: toUpdate },
                { new: true, runValidators: true },
            )
        });

        const created = await Promise.all(createOperations);
        const updated = await Promise.all(updateOperations);

        socket.emit(
            SocketEvents.SaveOptionsResponse,
            {
                created,
                updated,
            },
        );
    } catch (e) {
        console.log(e);
        socket.emit(
            SocketEvents.SaveOptionsError,
            e,
        );
    }
};

const handleDeleteOptions = socket => async (optionIds) => {
    try {
        await Option.deleteMany(
            { _id: { $in: optionIds } },
        );

        socket.emit(
            SocketEvents.DeleteOptionsResponse,
            optionIds,
        );
    } catch (e) {
        console.log(e);
        socket.emit(
            SocketEvents.DeleteOptionsError,
            e,
        );
    }
};

function registerWriteStorySocket (socket) {
    socket.on(SocketEvents.NewSequenceRequest, handleNewSequence(socket));
    socket.on(SocketEvents.UpdateSequenceRequest, handleUpdateSequence(socket));
    socket.on(SocketEvents.DeleteSequenceRequest, handleRemoveSequence(socket));

    socket.on(SocketEvents.SaveOptionsRequest, handleSaveOptions(socket));
    socket.on(SocketEvents.DeleteOptionsRequest, handleDeleteOptions(socket));
}

module.exports = registerWriteStorySocket;
