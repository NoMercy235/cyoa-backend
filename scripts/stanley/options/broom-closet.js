function generateId (nr) {
    return `broomCloset${nr}`;
}

module.exports = [
    {
        action: 'Stay in the broom closet',
        sequence: generateId(1),
        nextSeq: generateId(2),
        consequences: [],
    },
    {
        action: 'Continue staying in the broom closet',
        sequence: generateId(2),
        nextSeq: generateId(3),
        consequences: [],
    },
    {
        action: 'Continue doing sweet F.A.',
        sequence: generateId(3),
        nextSeq: generateId(4),
        consequences: [],
    },
    {
        action: 'I\'m waiting for more dialogue',
        sequence: generateId(4),
        nextSeq: generateId(5),
        consequences: [],
    },
    {
        action: 'My choice is to stay in this broom closet',
        sequence: generateId(5),
        nextSeq: generateId(6),
        consequences: [],
    },
    {
        action: 'I have no friends, I think I\'ll stay here',
        sequence: generateId(6),
        nextSeq: generateId(7),
        consequences: [],
    },
    {
        action: 'This broom closet is my home',
        sequence: generateId(7),
        nextSeq: generateId(8),
        consequences: [],
    },
    {
        action: 'Click this if you\'re the second player',
        sequence: generateId(8),
        nextSeq: generateId(9),
        consequences: [],
    },
    {
        action: 'Go back into the broom closet',
        sequence: generateId(9),
        nextSeq: generateId(10),
        consequences: [],
    },
    {
        action: 'Pick up the story again',
        sequence: generateId(10),
        nextSeq: generateId(11),
        consequences: [],
    },
    {
        action: 'Walk upstairs',
        sequence: generateId(11),
        nextSeq: 'followingOrders4',
        consequences: [],
    },
    // {
    //     action: 'Walk downstairs',
    //     sequence: generateId(10),
    //     nextSeq: generateId(11),
    //     consequences: [],
    // },
    ...[1, 2, 3, 4, 5, 6, 7, 9].map(el => {
        return {
            action: 'Get back on track',
            sequence: generateId(el),
            nextSeq: 'followingOrders3',
            consequences: [],
        }
    }),
];
