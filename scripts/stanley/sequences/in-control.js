function generateId (nr) {
    return `inControl${nr}`;
}

module.exports = [
    {
        id: generateId(1),
        name: 'In control - Pushed the \'ON\' button',
        content: `Stanley pushed the 'OFF' button and the room...

...Wait, Stanley, you just activated the controls. didn't you? After they kept you enslaved for all these years you go and try to take control of this machine for yourself, Is that what you wanted? Control? This isn't how the story goes, you were supposed to get to this control deck, turn the controls OFF, and leave. If you're going to throw my story off track, you're going to have to do much better than that, for example; and I think you'll find this pertinent:

Stanley realised he had just initiated the network's emergency detonation system. If turning on the controls without proper DNA identification, nuclear detonators are set to explode, eliminating the entire complex. How long until this happens? Hm, let me think...

...Two minutes.`,
    },
    {
        id: generateId(2),
        name: 'In control - Run back into the control room',
        content: `Ah! Yes! This is making things a little more fun, isn't it, Stanley? It's your time to shine! You are the star! You can shape your story to your heart's desires. Ooh, this is much better than what I had in mind! It's a shame we have such little time to enjoy it. Mere moments until the bomb goes off, but what precious moments each one of them is! More time to talk about you, about me, where we're going, what all this means... I barely know where to start!`,
    },
    {
        id: generateId(3),
        name: 'In control - Ask where your co-workers are',
        content: `What's that? You want to know where your co-workers are? A moment of solace before you're obliterated? Alright, I'm in a good mood, and you're going to die anyway. I'll tell you exactly what happened to them: I erased them, I turned off the machine; I set you free. Of course, that was merely in this instance of the story. Sometimes when I tell it, I simply let you sit in your office forever, pushing buttons endlessly, and then dying alone. Other times, I let the office sink into the ground, swallowing everyone inside; or I let it burn to a crisp.

However, I have to say, this version of events is actually quite amusing, watching you try to make sense of everything, watching you try and take back the control wrested away from you... It's quite rich. I almost hate to see it go!

My goodness! Only thirty-four seconds left... But I'm enjoying this so much! You know what? To Hell with it; I'm going to put some extra time on the clock; why not, maybe a minute or so. These are precious additional seconds, Stanley. Time doesn't grow on trees, you know!`,
    },
    {
        id: generateId(4),
        name: 'In control - Try to find a way to escape',
        content: `Oh, dear me, what's the matter, Stanley? Is it that you have know idea what you're supposed to be doing right now? Or did you just assume when you saw that timer that there was something in this room capable of turn it off? I mean, look at you, running from button to button, screen to screen, touching every little thing to see if something happens! These numbered buttons! No! These coloured buttons! Or maybe this big red button! Or this door! Everything! Anything! Something here will save me!

Why would you think that, Stanley? You think that this video game can be beaten, won, solved? Do you have any idea what your purpose in this place is? Hahaha, heh, Stanley... You're in for quite a disappointment. But here's a spoiler for you: That timer isn't a catalyst to keep the action going, it's just seconds ticking away to your death. You're only still playing instead of watching a cutscene because I want to watch every moment that you're powerless, to see you made humble.

This is not a challenge, it's a tragedy. You wanted to control this world; that's fine. But I'm going to destroy it first, so you can't.`,
    },
    {
        id: generateId(5),
        name: 'In control - Look at the clock',
        content: `Take a look at the clock, Stanley. That's thirty seconds you have left to struggle. Thirty seconds until a big boom, and then nothing. No ending here, just you being blown to bits. Will you cling desperately to your frail life? Or will you let it go peacefully? Another choice! Make it count. Or don't. It's all the same to me, all part of the joke.

And believe me, I will be laughing every second of your inevitable life, from the moment we fade in until the moment I say: Happily Ever-

BOOM`,
    },
    {
        id: generateId(6),
        name: 'In control - BOOM',
        isEnding: true,
        content: `<BLANK>`,
    },
];
