module.exports = [
    {
        action: 'Open the door and step out of your office.',
        sequence: 'aManNamedStanley',
        nextSeq: 'aNewChoice',
        consequences: [],
    },
    {
        action: 'Do not leave the office',
        sequence: 'aManNamedStanley',
        nextSeq: 'notToday',
        consequences: [],
    },
];
