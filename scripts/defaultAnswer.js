// This file generates a default answer, greets the user and handles insults
// Code by: Justin (respondGreet(), respondApology() & rude()) & Sébastien (defaultAnswer())

// Gives the user a default answer to indicate that what they said was not understood
// Arguments: text box for user feedback
function defaultAnswer() {

    // Hardcoded potential answers if no keyword can be detected
    const answers = ["Sorry, I didn't catch that, could you repeat?", //0
        "I'm not sure I understand, what was that?", //1
        "I have no doubt what you said was interesting, but I didn't catch a word", //2
        "You'll have to repeat that for me chief.", //3
        "I'm getting old, my hearing is not what it used to be, do you mind repeating?", //4
        "Could you repeat that a bit slower please?", //5
        "I'm sorry, I only speak English. If that was English, I'm extra-sorry.", //6
        "I didn't get that, could you try again?"]; //7

    // Randomly choosing one of the potential answers
    answerNumber = Math.floor(Math.random() * answers.length);

    // Answering the random sentence
    pushChat(answers[answerNumber], 'bot');
    pushChat('If you are lost, just say "help"', 'bot');
}

function respondGreet() {

    // Greetings for friendly users
    const answers = ["Hey there!", //0
        "Hello friend", //1
        "Greetings", //2
        "Nice to meet you", //3
        "It is a pleasure to meet you"]; //4

    // Randomly choosing one of the potential answers
    answerNumber = Math.floor(Math.random() * answers.length);

    // Answering the random sentence
    pushChat(answers[answerNumber], 'bot');
}

function respondApology() {

    // Responses to apologies
    const answers = ["Don't worry about it", //0
        "It happens to the best of us", //1
        "Apology accepted", //2
        "It's ok", //3
        "Don't worry. We are still friends :)"]; //4

    // Randomly choosing one of the potential answers
    answerNumber = Math.floor(Math.random() * answers.length);

    // Answering the random sentence
    pushChat(answers[answerNumber], 'bot');
}


function rude() {

    // Responses to very rude users
    const answers = ["How rude!", //0
        "Hey! Stop that!", //1
        "I'll cut the conversation short with such attitude", //2
        "Language please", //3
        "You need to learn some manners", //4
        "You must be one of the university's finest students. I'm sure."]; //5

    // Randomly choosing one of the potential answers
    answerNumber = Math.floor(Math.random() * answers.length);

    // Answering the random sentence
    pushChat(answers[answerNumber], 'bot');
}