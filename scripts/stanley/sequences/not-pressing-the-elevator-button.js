function generateId (nr) {
    return `notGonnaPressIt${nr}`;
}

module.exports = [
    {
        id: generateId(1),
        name: ' Not gonna press it- Did not push the button on the elevator',
        content: `ahem Perhaps you didn't hear me clearly. Stanley got into the ELEVATOR and pushed the BIG RED BUTTON, right there on the wall.`,
    },
    {
        id: generateId(2),
        name: 'Not gonna press it - Still didn\'t push the button',
        content: `Is something wrong, Stanley? Do you just not want to continue the Story? If you didn't want to press the button, then why did you come here? You can't move on unless you push that button!`,
    },
    {
        id: generateId(3),
        name: 'Not gonna press it - Did not press it. Sit around and do nothing.',
        content: `Fine, Stanley, have it your way. I have no clue who would want to play through half the story and just decide you have better things to do than to perform a simple task! Fine. Just fine. Don't push the button then. I'm sure you have much better things to do with your time.`,
    },
    {
        id: generateId(4),
        name: 'Not gonna press it - Still doing nothing.',
        content: `Stanley just sat around doing nothing, oblivious to the fact that he is keep the story from progressing any further. Maybe the Mind Control hasn't entirely worn off. Yes, there's mind control in this story, but you'll never find out because you won't press that damn button! 

sigh Okay, whatever. I'm just going to wait until you decide to get up and move forward with your life.`,
    },
    {
        id: generateId(5),
        name: 'Not gonna press it - Doing nothing. Not even gonna press it',
        content: `Stanley continued to sit around and do nothing.`,
    },
    {
        id: generateId(6),
        name: 'Not gonna press it - That\'s it, I\'m out.',
        isEnding: true,
        content: `Did nothing until the end of the world.`,
    },
];
