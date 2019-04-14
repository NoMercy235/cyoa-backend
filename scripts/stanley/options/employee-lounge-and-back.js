function generateId (nr) {
    return `employeeLoungeAndBack${nr}`;
}

module.exports = [
    {
        action: 'Continue admiring the employee lounge',
        sequence: generateId(1),
        nextSeq: generateId(2),
        consequences: [],
    },
    {
        action: 'Continue, uh... admiring',
        sequence: generateId(2),
        nextSeq: generateId(3),
        consequences: [],
    },
    {
        action: 'Wait for more dialogue',
        sequence: generateId(3),
        nextSeq: generateId(4),
        consequences: [],
    },
    {
        action: 'Exit the employee lounge',
        sequence: generateId(4),
        nextSeq: generateId(5),
        consequences: [],
    },
    {
        action: 'Enter the door on your left',
        sequence: generateId(5),
        nextSeq: generateId(6),
        consequences: [],
    },
    {
        action: 'Enter the door in front of you',
        sequence: generateId(5),
        nextSeq: generateId(7),
        consequences: [],
    },
    {
        action: 'Walk into the door ahead',
        sequence: generateId(6),
        nextSeq: 'followingOrders2',
        consequences: [],
    },
    ...[1, 2, 3].map(el => {
        return {
            action: 'Exit the employee lounge',
            sequence: generateId(el),
            nextSeq: generateId(5),
            consequences: [],
        }
    }),
    {
        action: 'Fall down the pit',
        sequence: generateId(7),
        nextSeq: 'fallDownThePit',
        consequences: [],
    },
    {
        action: 'Jump on the elevator platform',
        sequence: generateId(7),
        nextSeq: 'jumpOnElevatorPlatform1',
        consequences: [],
    },
];
