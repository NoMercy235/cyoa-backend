const Sequence = require('../models/sequence').model;
const { SocketEvents } = require('./constants');

const handleNewSequence = socket => async (data) => {
    console.log(data);
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
           SocketEvents.NewSequenceResponse,
           sequence,
       );
    } catch (e) {
        socket.emit(
            SocketEvents.NewSequenceResponse,
            e,
        );
    }
};

function registerWriteStorySocket (socket) {
    socket.on(SocketEvents.NewSequenceRequest, handleNewSequence(socket));
    socket.on(SocketEvents.UpdateSequenceRequest, handleUpdateSequence(socket));
    socket.on(SocketEvents.DeleteSequenceRequest, () => {
        console.log('Delete Sequence')
    });
}

module.exports = registerWriteStorySocket;
