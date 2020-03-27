const Sequence = require('../models/sequence').model;
const Option = require('../models/option').model;
const { SocketEvents } = require('./constants');

const handleNewSequence = socket => async (data) => {
    const sequence = new Sequence(data);
    sequence.hasScenePic = !!sequence.scenePic;
    const lastSeqInOrder = await Sequence.findLastInOrder();
    sequence.order = lastSeqInOrder ? lastSeqInOrder.order + 1 : 0;
    try {
        await sequence.save();
        socket.emit(
            SocketEvents.NewSequenceResponse,
            sequence,
        );
    } catch (e) {
        console.log(e);
        socket.emit(
            SocketEvents.NewSequenceError,
            e,
        );
    }
};

const handleUpdateSequence = socket => async (data) => {
    const { _id: seqId, ...toUpdate } = data;
    try {
        const sequence = await Sequence.findOneAndUpdate(
            { _id: seqId },
            { $set: toUpdate },
            { new: true, runValidators: true },
        );
        socket.emit(
            SocketEvents.UpdateSequenceResponse,
            sequence,
        );
    } catch (e) {
        console.log(e);
        socket.emit(
            SocketEvents.UpdateSequenceError,
            e,
        );
    }
};

const handleRemoveSequence = socket => async (seqId) => {
    try {
        const sequence = await Sequence.findOneAndRemove(
            { _id: seqId },
        );
        await Option.deleteMany(
            { nextSeq: seqId },
        );
        socket.emit(
            SocketEvents.DeleteSequenceResponse,
            sequence,
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
