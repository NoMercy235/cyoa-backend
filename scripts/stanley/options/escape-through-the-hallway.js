function generateId (nr) {
    return `hallwayEscape${nr}`;
}

module.exports = [
    {
        action: 'Keep walking',
        sequence: generateId(1),
        nextSeq: generateId(2),
        consequences: [],
    },
    {
        action: 'Keep going',
        sequence: generateId(2),
        nextSeq: generateId(3),
        consequences: [],
    },
    {
        action: 'Keep going',
        sequence: generateId(3),
        nextSeq: generateId(4),
        consequences: [],
    },
    {
        action: 'Die',
        sequence: generateId(4),
        nextSeq: generateId(5),
        consequences: [],
    },
    {
        action: 'Walk into the door',
        sequence: generateId(5),
        nextSeq: generateId(6),
        consequences: [],
    },
    {
        action: 'Exit the museum',
        sequence: generateId(6),
        nextSeq: generateId(7),
        consequences: [],
    },
    {
        action: 'Flip the switch',
        sequence: generateId(7),
        nextSeq: generateId(8),
        consequences: [],
    },
    {
        action: 'Quit',
        sequence: generateId(8),
        nextSeq: 'aManNamedStanley',
        consequences: [],
    },
    ...[1, 2, 3].map(el => {
        return {
            action: 'Go back',
            sequence: generateId(el),
            nextSeq: generateId(9),
            consequences: [],
        };
    }),
    {
        action: 'Walk to the next platform',
        sequence: generateId(9),
        nextSeq: 'followingOrders9',
        consequences: [],
    },
];
