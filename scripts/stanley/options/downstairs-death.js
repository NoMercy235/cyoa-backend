function generateId (nr) {
    return `downstairsDeath${nr}`;
}

module.exports = [
    {
        action: 'Walk into the next room',
        sequence: generateId(1),
        nextSeq: generateId(2),
        consequences: [],
    },
    {
        action: 'Begin lucid dreaming',
        sequence: generateId(2),
        nextSeq: generateId(3),
        consequences: [],
    },
    {
        action: 'Close your eyes',
        sequence: generateId(3),
        nextSeq: generateId(4),
        consequences: [],
    },
    {
        action: 'Open your eyes',
        sequence: generateId(4),
        nextSeq: generateId(5),
        consequences: [],
    },
    {
        action: 'Die',
        sequence: generateId(5),
        nextSeq: generateId(6),
        consequences: [],
    },
];
