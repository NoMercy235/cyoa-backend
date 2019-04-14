function generateId (nr) {
    return `rightDoor${nr}`;
}

module.exports = [
    {
        id: generateId(1),
        name: 'Right door',
        content: `This was not the correct way to the meeting room, and Stanley knew it perfectly well. This of course was the way to the employee lounge, so perhaps Stanley wanted to stop by it first, just to admire it.`,
    },
];
