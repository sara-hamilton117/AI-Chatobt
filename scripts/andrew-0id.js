// This file is the entry point (called once the user is logged in)
// Code by: start by Sara and Sébastien, Justin added what he needed for his parts to work

// Global variables
// Recognition needs to be global so that event handlers can be added/removed in any function
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();

// Jokes counter is global to keep track even if the user doesn't ask for jokes consecutively
var jokesCounter = 0;

function speechRecon() {

    const micBtn = document.getElementById("mic-btn");

    if (SpeechRecognition) {

        // Making the speech recognition continuous (doesn't stop after returning a result)
        recognition.continuous = true;
        recognition.interimResults = true;

        // Event listener for btn click
        micBtn.addEventListener("click", micBtnClick);

        async function micBtnClick() {
            // Asks the user to sign in
            await signIn();

            if (micBtn.classList.contains("mic-btn")) { // Start Voice Recognition
                recognition.start(); // First time you have to allow access to mic!
            }
            else {
                recognition.stop();
            }
        }

        // Adding event listener to speech recognition
        recognition.addEventListener("start", startSpeechRecognition);

        // Function triggered when speech recognition starts
        function startSpeechRecognition() {
            micBtn.innerHTML = '<i class="fas fa-microphone fa-2x"></i>';

            // Greet the user
            greetings();
        }

        // Adding event listener to speech recognition
        recognition.addEventListener("end", endSpeechRecognition);

        // Function triggered when speech recognition stops
        function endSpeechRecognition() {
            micBtn.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="microphone" class="svg-inline--fa fa-microphone fa-w-11" role = "img" xmlns = "http://www.w3.org/2000/svg" viewBox = "0 0 352 512"><path fill="#212529" d="M336 192h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16zM176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zM128 96c0-26.47 21.53-48 48-48s48 21.53 48 48v160c0 26.47-21.53 48-48 48s-48-21.53-48-48V96z" class=""></path></svg>';

            pushChat('I will stop listening now. Goodbye!', 'bot');
        }

        // Adding event listener to speech recognition
        recognition.addEventListener("result", resultOfSpeechRecognition);

    }
    else {
        // Inform the user that the bot will not work on his browser
        pushChat("ANDREW-01D is not supported by your browser. ANDREW-01D broken :( *sad beep boop*", "bot");
    }

    // Greet user and instruct on how to proceed
    pushChat('Hey there! To start talking to me, log in to you Microsoft account first or click the microphone button below', 'bot');

}

function resultOfSpeechRecognition(event) {
    // Variables for current result index and transcript of user's speech
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const msgBox = document.getElementById("userFeedback");

    msgBox.innerHTML = transcript;

    // Getting last results's index
    var i = event.results.length - 1;

    // Checking if the user stopped talking
    if (event.results[i].isFinal == true) {

        // Adding a chat bubble with what the user said
        pushChat(transcript, 'user');

        // Turning the transcript in an all lowercase string
        let userSentence = transcript.toLowerCase();

        // Looking for keywords in the user's sentence
        // Could be improved (at the moment will trigger commands based on the if statement's order)
        if (userSentence.includes('*') || userSentence.includes('idiot') || userSentence.includes('stupid')) {
            rude();
        } else if (userSentence.includes('appointment') || userSentence.includes('event') || userSentence.includes('meeting') || userSentence.includes('calendar')) {
            appointment(transcript);
        } else if (userSentence.includes('download')) {
            download(transcript);
        } else if (userSentence.includes('email') || userSentence.includes('mail') || userSentence.includes('message') || userSentence.includes('messages')
            || userSentence.includes('emails') || userSentence.includes('mails') || userSentence.includes('reply')) {
            recognition.removeEventListener("result", resultOfSpeechRecognition);
            mail(transcript);
        } else if (userSentence.includes('task') || userSentence.includes('tasks') || userSentence.includes('to do') || userSentence.includes('list') ||      userSentence.includes('lists')) {
            recognition.removeEventListener("result", resultOfSpeechRecognition);
            tasks(transcript);
        } else if (userSentence.includes('library') || userSentence.includes('book')) {
            librarySearch(transcript);
        } else if (userSentence.includes('file') || userSentence.includes('document')) {
            showFiles();
        } else if (userSentence.includes('google') || userSentence.includes('look up') || userSentence.includes('search')) {
            recognition.removeEventListener("result", resultOfSpeechRecognition);
            googleSearch(transcript);
        } else if (userSentence.includes('administration') || userSentence.includes('university') || userSentence.includes('campus') || userSentence.includes('admin') || userSentence.includes('fee') || userSentence.includes('balance')) {
            checkAdmin(transcript);
        } else if (userSentence.includes('recorded') || userSentence.includes('recording') || userSentence.includes('recordings')) {
            getRecordedLectures(transcript);
        } else if (userSentence.includes('joke') || userSentence.includes('funny')) {
            recognition.removeEventListener("result", resultOfSpeechRecognition);
            tellJoke();
        } else if (userSentence.includes('help')) {
            items = ['Show upcoming appointments: say &#8220show appointments&#8221', 'Create a new To-Do item: say &#8220To-Do&#8221'
                , 'Check your emails: say &#8220email&#8221', 'To tell me I am awesome... No need, I already know'];
            showHelp('General', items, 15000);
        } else if (userSentence.includes('stop')) {
            recognition.stop();
        } else if (userSentence.includes('thank')) {
            pushChat('You\'re welcome!', 'bot');
        } else if (userSentence.includes('hello') || userSentence.includes('hi') || userSentence.includes('howdy') || userSentence.includes('hey')) {
            respondGreet();
        } else if (userSentence.includes('sorry') || userSentence.includes('apolog') || userSentence.includes('excuse')) {
            respondApology();
        } else if (userSentence.includes('how are you')) {
            pushChat('I am well. Thanks for asking', 'bot');
        } else {
            defaultAnswer();
        }
    }
}
