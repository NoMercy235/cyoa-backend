function generateId (nr) {
    return `employeeLoungeAndBack${nr}`;
}

module.exports = [
    {
        id: generateId(1),
        name: 'Employee Lounge - entered',
        content: `Ah, yes, truly a room worth admiring. The room was coated in gentle deep-sea blue wallpaper. Several recliners and coffee tables littered the room and a cold drink machine sat in the corner humming quietly. What a room, what a room.`,
    },
    {
        id: generateId(2),
        name: 'Employee Lounge - continue admiring',
        content: `Yeeesss, really, really worth it being in this room. A room so utterly eye-catching, even though your co-workers had all vanished, you decide to spend your time gawking at some chairs and paintings. Really worth it, Stanley.`,
    },
    {
        id: generateId(3),
        name: 'Employee Lounge - still admiring',
        content: `At this point, Stanley's obsession on this room was on the brink of being creepy, and reflected poorly on his overall personality. This is probably why everyone left.`,
    },
    {
        id: generateId(4),
        name: 'Employee Lounge - more dialogue',
        content: `Stanley sat around and waited for more dialogue. After a long time, when there was no more, he thought the game was trying to send him a message.

P.S., it's not.`,
    },
    {
        id: generateId(5),
        name: 'Employee Lounge - exit the lounge',
        content: `But eager to get back to business, Stanley left the employee lounge and came to a hallway with a door on his left and a door in front of him. Seeing as the meeting room was through the left door, he entered that one.`,
    },
    {
        id: generateId(6),
        name: 'Employee Lounge - enter door on the left',
        content: `Coming through the door, Stanley found himself the maintenance room; a dimly lit area with wooden planks sitting in the corner. and a red light humming overhead. There was a door straight ahead that led to the meeting room. There was also an elevator that went down into the floor, but Stanley ignored it, and got back on track.`,
    },
    {
        id: generateId(7),
        name: 'Employee Lounge - enter door in front of your',
        content: `Stanley was so bad at following directions, it's incredible he wasn't fired years ago. He came to an enormous room filled will cargo crates, trucks and forklifts. Yet, that was all on the deep floor of the factory, separating two rooms. Oh look, an elevator platform. Why don't you jump on that, or try your luck at falling down the deep pit below.`,
    },
];
