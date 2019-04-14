function generateId (nr) {
    return `inControl${nr}`;
}

module.exports = [
    {
        action: 'Run back into the control room',
        sequence: generateId(1),
        nextSeq: generateId(2),
        consequences: [],
    },
    {
        action: 'Ask where your co-workers are',
        sequence: generateId(2),
        nextSeq: generateId(3),
        consequences: [],
    },
    {
        action: 'Try to find a way to escape',
        sequence: generateId(3),
        nextSeq: generateId(4),
        consequences: [],
    },
    {
        action: 'Look at the clock',
        sequence: generateId(4),
        nextSeq: generateId(5),
        consequences: [],
    },
    {
        action: 'BOOM',
        sequence: generateId(5),
        nextSeq: generateId(6),
        consequences: [],
    },
];
