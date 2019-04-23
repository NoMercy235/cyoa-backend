function generateId (nr) {
    return `jumpOnElevatorPlatform${nr}`;
}

module.exports = [
    {
        action: 'Jump down a catwalk below.',
        sequence: generateId(1),
        nextSeq: generateId(2),
        consequences: [],
    },
    {
        action: 'Jump off the platform',
        sequence: generateId(1),
        nextSeq: 'fallDownThePit',
        consequences: [],
    },
    {
        action: 'Walk through the corridor',
        sequence: generateId(2),
        nextSeq: generateId(3),
        consequences: [],
    },
    {
        action: 'Enter the red door',
        sequence: generateId(3),
        nextSeq: generateId(4),
        consequences: [],
    },
    {
        action: 'Enter the door',
        sequence: generateId(4),
        nextSeq: generateId(5),
        consequences: [],
    },
    {
        action: 'Step down the stairs',
        sequence: generateId(5),
        nextSeq: generateId(6),
        consequences: [],
    },
    {
        action: 'Walk up the stairs',
        sequence: generateId(6),
        nextSeq: generateId(7),
        consequences: [],
    },
    {
        action: 'Jump',
        sequence: generateId(7),
        nextSeq: generateId(8),
        consequences: [],
    },
    {
        action: 'Walk back up the stairs',
        sequence: generateId(8),
        nextSeq: generateId(9),
        consequences: [],
    },
    {
        action: 'Walk up the steps',
        sequence: generateId(9),
        nextSeq: generateId(10),
        consequences: [],
    },
    {
        action: 'Jump',
        sequence: generateId(10),
        nextSeq: generateId(11),
        consequences: [],
    },
    {
        action: 'Walk back up the stairs',
        sequence: generateId(11),
        nextSeq: generateId(12),
        consequences: [],
    },
    {
        action: 'Jump',
        sequence: generateId(12),
        nextSeq: generateId(13),
        consequences: [],
    },
    {
        action: 'Jump',
        sequence: generateId(13),
        nextSeq: generateId(14),
        consequences: [],
    },
    ...[5, 6, 8, 9, 11].map(el => {
        return {
            action: 'Go back',
            sequence: generateId(el),
            nextSeq: generateId(15),
            consequences: [],
        }
    }),
    {
        action: 'Go back to the stairwell',
        sequence: generateId(15),
        nextSeq: generateId(16),
        consequences: [],
    },
    {
        action: 'Walk up the stairs',
        sequence: generateId(16),
        nextSeq: generateId(12),
        consequences: [],
    },
    {
        action: 'Enter the blue door',
        sequence: generateId(3),
        nextSeq: generateId(17),
        consequences: [],
    },
    {
        action: 'Enter the blue door',
        sequence: generateId(17),
        nextSeq: generateId(18),
        consequences: [],
    },
    {
        action: 'Enter the blue door',
        sequence: generateId(18),
        nextSeq: generateId(19),
        consequences: [],
    },
    ...[17, 18].map(el => {
        return {
            action: 'Enter the red door',
            sequence: generateId(el),
            nextSeq: generateId(4),
            consequences: [],
        }
    }),
    {
        action: 'Take a stab in the dark',
        sequence: generateId(19),
        nextSeq: generateId(20),
        consequences: [],
    },
    {
        action: 'Enter the third door',
        sequence: generateId(20),
        nextSeq: generateId(21),
        consequences: [],
    },
    {
        action: 'Push one',
        sequence: generateId(21),
        nextSeq: generateId(24),
        consequences: [],
    },
    {
        action: 'Push three',
        sequence: generateId(21),
        nextSeq: generateId(22),
        consequences: [],
    },
    {
        action: 'Push five',
        sequence: generateId(21),
        nextSeq: generateId(36),
        consequences: [],
    },
    {
        action: 'Take a look',
        sequence: generateId(22),
        nextSeq: generateId(23),
        consequences: [],
    },
    {
        action: 'Push one',
        sequence: generateId(23),
        nextSeq: generateId(24),
        consequences: [],
    },
    {
        action: 'Push three',
        sequence: generateId(23),
        nextSeq: generateId(22),
        consequences: [],
    },
    {
        action: 'Push five',
        sequence: generateId(23),
        nextSeq: generateId(36),
        consequences: [],
    },
    {
        action: 'Take a look',
        sequence: generateId(24),
        nextSeq: generateId(25),
        consequences: [],
    },
    {
        action: 'Push the button for fifteen minutes',
        sequence: generateId(25),
        nextSeq: generateId(26),
        consequences: [],
    },
    {
        action: 'Push the button for fifteen minutes',
        sequence: generateId(26),
        nextSeq: generateId(27),
        consequences: [],
    },
    {
        action: 'Push the button for 30 minutes',
        sequence: generateId(27),
        nextSeq: generateId(28),
        consequences: [],
    },
    {
        action: 'Push the button for 60 minutes',
        sequence: generateId(28),
        nextSeq: generateId(29),
        consequences: [],
    },
    {
        action: 'Push the button for 30 minutes',
        sequence: generateId(29),
        nextSeq: generateId(30),
        consequences: [],
    },
    {
        action: 'Push the button for 30 minutes',
        sequence: generateId(30),
        nextSeq: generateId(31),
        consequences: [],
    },
    {
        action: 'PUSH THE BUTTONS',
        sequence: generateId(31),
        nextSeq: generateId(32),
        consequences: [],
    },
    {
        action: 'Push the button for fifteen minutes',
        sequence: generateId(32),
        nextSeq: generateId(33),
        consequences: [],
    },
    {
        action: 'Push the button for fifteen minutes',
        sequence: generateId(33),
        nextSeq: generateId(34),
        consequences: [],
    },
    {
        action: 'Accept the essence of art itself',
        sequence: generateId(34),
        nextSeq: generateId(35),
        consequences: [],
    },
];
