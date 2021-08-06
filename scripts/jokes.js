// Tells jokes or pulls pranks on the user
// Code by: Sébastien

function tellJoke() {
    if (jokesCounter == 0) {
        recognition.addEventListener("result", jokeAnswer1);
        // Question
        pushChat('What does a baby computer call its father?', 'bot');
        // Incrementing counter
        jokesCounter++;
    } else if (jokesCounter == 1) {
        // Question
        pushChat('I changed all my passwords to "incorrect" so that if I forget it, it tells me "your password is incorrect".', 'bot');
        // Returning to main chat logic
        recognition.addEventListener("result", resultOfSpeechRecognition);
        // Incrementing counter
        jokesCounter++;
    } else if (jokesCounter == 2) {
        // Displays a button that triggers the joke on click (required to be on a button as fullscreen can only be triggered by user's action)
        document.getElementById('joke-button').classList.remove('d-none');
        // blueScreen();
        // Returning to main chat logic
        recognition.addEventListener("result", resultOfSpeechRecognition);
        // Resetting counter
        jokesCounter++;
    } else {
        recognition.addEventListener("result", jokeAnswer2);
        // Question
        pushChat('What position did the spider apply for?', 'bot');
        // Incrementing counter
        jokesCounter = 0;
    }
}

// Answer to the first joke
function jokeAnswer1(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;

    // takes into account 
    var i = event.results.length - 1;

    if (event.results[i].isFinal == true) {

        // Adding a chat bubble with what the user said
        pushChat(transcript, 'user');

        // Turning the transcript in an all lowercase string
        let userSentence = transcript.toLowerCase();

        if (userSentence.includes('data')) {

            pushChat('I guess you already knew that one ;)', 'bot');
            recognition.removeEventListener("result", jokeAnswer1);
            recognition.addEventListener("result", resultOfSpeechRecognition);

        } else {

            pushChat('It calls him "Data".', 'bot');
            recognition.removeEventListener("result", jokeAnswer1);
            recognition.addEventListener("result", resultOfSpeechRecognition);

        }
    }
}

// Answer to the second joke
function jokeAnswer2(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;

    // takes into account 
    var i = event.results.length - 1;

    if (event.results[i].isFinal == true) {

        // Adding a chat bubble with what the user said
        pushChat(transcript, 'user');

        // Turning the transcript in an all lowercase string
        let userSentence = transcript.toLowerCase();

        // If answer is correct, congratulate user
        if (userSentence.includes('webdesigner') || userSentence.includes('web designer')) {

            pushChat('You are really good at this, congrats!', 'bot');
            recognition.removeEventListener("result", jokeAnswer2);
            recognition.addEventListener("result", resultOfSpeechRecognition);

        } else { // Tell the joke

            pushChat('It applied to be a "Web designer".', 'bot');
            recognition.removeEventListener("result", jokeAnswer2);
            recognition.addEventListener("result", resultOfSpeechRecognition);

        }
    }
}

// Super secret joke: display a fake BSOD in full screen
function blueScreen() {

    // Hiding the joke button
    document.getElementById('joke-button').classList.add('d-none');

    // Hiding cursor
    document.body.style.cursor = 'none';

    // Get <body>
    var bodyElement = document.getElementsByTagName('body')[0];

    // Copy main
    var bodyCopy = document.createElement('main');
    bodyCopy.innerHTML = bodyElement.innerHTML;
    bodyCopy.classList = bodyElement.classList;
    
    // Creates a new element and stores the joke in it
    var bodyJoke = document.createElement('body');
    bodyJoke.innerHTML = '<div class="joke-body container-fluid">' +
        '<div class="row joke-container">' +
        '<div class="col-1">' +
        '</div>' +
        '<div class="col-7">' +
        '<div>' +
        '<h1 class="joke-title">:(</h1>' +
        '</div>' +
        '<div>' +
        '<p class="joke-text">' +
        'Your PC ran into a problem and needs to restart. We\'re just collecting some error info, and then we\'ll' +
        ' restart for you.' +
        '</p>' +
        '</div>' +
        '<div>' +
        '<p class="joke-completeness">' +
        '0% complete' +
        '</p>' +
        '</div>' +
        '<div class="container">' +
        '<div class="row">' +
        '<div class="col-1 ps-0 me-4">' +
        '<img src="assets/images/joke-qrcode.svg" class="joke-img">' +
        '</div>' +
        '<div class="col">' +
        '<p class="joke-help joke-help-top">' +
        'For more information about this issue and possible fixes, visit https://www.realwebsite.com/error404' +
        '</p>' +
        '<p class="joke-help">' +
        'If you call a support person, give them this info:' +
        '</p>' +
        '<p class="joke-help">' +
        'Stop code: ANDREW-01D_F00LED_ME' +
        '</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-5">' +
        '</div>' +
        '</div>' +
        '</div >';

    bodyJoke.classList.add('joke-body', 'container-fluid');

    
    // Replaces page's body with the joke
    bodyElement.innerHTML = bodyJoke.innerHTML;
    bodyElement.classList = bodyJoke.classList;

    // Swaps the page to fullscreen for better immersion
    // document.getElementsByTagName('html')[0].requestFullscreen();
    document.documentElement.requestFullscreen();

    // Next three timeout fake a percentage increment on the page
    setTimeout(function () {
        document.getElementsByClassName('joke-completeness')[0].innerText = '2% complete';
        console.log('2%');
    }, 500);

    setTimeout(function () {
        document.getElementsByClassName('joke-completeness')[0].innerText = '5% complete';
        console.log('5%');
    }, 1500);

    setTimeout(function () {
        document.getElementsByClassName('joke-completeness')[0].innerText = '20% complete';
        console.log('20%');
    }, 4000);

    // Restores original body after a short time and stops fullscreen
    setTimeout(function () {
        bodyElement.innerHTML = bodyCopy.innerHTML;
        bodyElement.classList = bodyCopy.classList;

        document.body.style.cursor = 'auto';

        document.exitFullscreen();
        pushChat('Ha! Ha! Got you!', 'bot');
    }, 6000);

    
}