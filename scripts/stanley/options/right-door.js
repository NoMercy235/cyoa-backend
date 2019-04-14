function generateId (nr) {
    return `rightDoor${nr}`;
}

module.exports = [
    {
        action: 'Enter the employee lounge',
        sequence: generateId(1),
        nextSeq: 'employeeLoungeAndBack1',
        consequences: [],
    },
];
