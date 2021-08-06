// This file handles Google searches
// Code by: Sara

// Function that calls the event listener for the transcript on keyword detection
function googleSearch(transcript) {
    recognition.addEventListener("result", searchEvent);

    //Pushing Bot Chat to promp user to state the query
    pushChat("What would you like me to look up for you?", 'bot');
}

//Function for the event listener to take the next transcript and search
function searchEvent(event){

    // Initiating variables
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    
    // Takes into account 
    var i = event.results.length - 1;

    // If the result of the transcript is final
    if (event.results[i].isFinal == true) {

        // Adding a chat bubble with what the user said
        pushChat(transcript, 'user');

        // Opens a new tab in the browser with the user's query after a short delay
        setTimeout(function () { window.open('https://www.google.com/search?q=' + transcript); }, 800);

        // Event listener for the query ends
        recognition.removeEventListener("result", searchEvent);

        // Event listener for the default keywords starts
        recognition.addEventListener("result", resultOfSpeechRecognition);
    }
}