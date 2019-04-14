function generateId (nr) {
    return `followingOrders${nr}`;
}

module.exports = [
    {
        action: 'Enter the left door',
        sequence: generateId(1),
        nextSeq: generateId(2),
        consequences: [],
    },
    {
        action: 'Go to the staircase',
        sequence: generateId(2),
        nextSeq: generateId(3),
        consequences: [],
    },
    {
        action: 'Enter the broom closet',
        sequence: generateId(2),
        nextSeq: 'broomCloset1',
        consequences: [],
    },
    {
        action: 'Walk upstairs',
        sequence: generateId(3),
        nextSeq: generateId(4),
        consequences: [],
    },
    {
        action: 'Walk downstairs',
        sequence: generateId(3),
        nextSeq: 'downstairsDeath1',
        consequences: [],
    },
    {
        action: 'Enter 2-8-4-5 into the keypad',
        sequence: generateId(4),
        nextSeq: generateId(5),
        consequences: [],
    },
    {
        action: 'Enter the passageway',
        sequence: generateId(5),
        nextSeq: generateId(6),
        consequences: [],
    },
    {
        action: 'Press the button',
        sequence: generateId(6),
        nextSeq: generateId(7),
        consequences: [],
    },
    {
        action: 'Don\'t press the button',
        sequence: generateId(6),
        nextSeq: 'notGonnaPressIt1',
        consequences: [],
    },
    {
        action: 'Walk into the large door',
        sequence: generateId(7),
        nextSeq: generateId(8),
        consequences: [],
    },
    {
        action: 'Walk into the long hallway',
        sequence: generateId(7),
        nextSeq: 'hallwayEscape1',
        consequences: [],
    },
    {
        action: 'Walk to the next platform',
        sequence: generateId(8),
        nextSeq: generateId(9),
        consequences: [],
    },
    {
        action: 'Walk to the next platform',
        sequence: generateId(9),
        nextSeq: generateId(10),
        consequences: [],
    },
    {
        action: 'Enter the elevator',
        sequence: generateId(10),
        nextSeq: generateId(11),
        consequences: [],
    },
    {
        action: 'Walk up to the screen',
        sequence: generateId(11),
        nextSeq: generateId(12),
        consequences: [],
    },
    {
        action: 'Push \'OFF\'',
        sequence: generateId(12),
        nextSeq: generateId(13),
        consequences: [],
    },
    {
        action: 'Push \'On\'',
        sequence: generateId(12),
        nextSeq: 'inControl1',
        consequences: [],
    },
    {
        action: 'Step outside',
        sequence: generateId(13),
        nextSeq: generateId(14),
        consequences: [],
    },
];
