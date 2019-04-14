function generateId (nr) {
    return `notGonnaPressIt${nr}`;
}

module.exports = [
    {
        action: 'Don\'t press the button',
        sequence: generateId(1),
        nextSeq: generateId(2),
        consequences: [],
    },
    {
        action: 'Don\'t press the button',
        sequence: generateId(2),
        nextSeq: generateId(3),
        consequences: [],
    },
    {
        action: 'Don\'t press the button',
        sequence: generateId(3),
        nextSeq: generateId(4),
        consequences: [],
    },
    {
        action: 'Continue doing nothing',
        sequence: generateId(4),
        nextSeq: generateId(5),
        consequences: [],
    },
    {
        action: 'Continue doing nothing',
        sequence: generateId(5),
        nextSeq: generateId(6),
        consequences: [],
    },
    ...[1, 2, 3, 4, 5].map(el => {
        return {
            action: 'Press the button',
            sequence: generateId(el),
            nextSeq: 'followingOrders7',
            consequences: [],
        }
    }),
];
