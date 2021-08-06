// This function adds a speech bubble for either the user or the bot
// Code by: Sara and Sébastien

// Arguments: transcript as a string, 'bot' or 'user' as a string depending on who is posting the message
function pushChat(userTranscript, botOrUser) {

    // Initiate speech for bot
    const speech = new SpeechSynthesisUtterance();

    // Initiating parameter for the colour
    let colour = 'primary';

    // Setting to the appropriate value if the message is said by the bot
    if (botOrUser == 'bot') {
        colour = 'success';
    }

    // Retrieving the parent div
    chatBox = document.getElementById('chat-window-container');
  

    // If at least one chat bubble is already in the chat
    if (chatBox.childElementCount != 0) {
        // Check what the last text bubble was, append accordingly and potentially modify last children
        lastBubble = chatBox.lastElementChild.lastElementChild;
        

        // User is posting a message
        if (botOrUser == 'user') {

            // Last message was from the user
            if (lastBubble.classList.contains("chat-bubble-user-bottom") || lastBubble.classList.contains("chat-bubble-user")) {

                // Last message was part of a chain of messages
                if (lastBubble.classList.contains("chat-bubble-user-bottom")) {

                    // In the current last child, remove 'bottom' class and replace it by correct one
                    lastBubble.classList.remove("chat-bubble-user-bottom");
                    lastBubble.classList.add("chat-bubble-user-mid");

                    // Add the chat bubble
                    sendMessage(userTranscript, botOrUser, colour, 'bottom');

                } else {// Last message was on its own

                    // In the current last child, remove 'normal' class and replace it by correct one
                    lastBubble.classList.remove("chat-bubble-user");
                    lastBubble.classList.add("chat-bubble-user-top");

                    // Add the chat bubble
                    sendMessage(userTranscript, botOrUser, colour, 'bottom');
                }

            } else { // Last message was from the bot

                // Add the chat bubble
                sendMessage(userTranscript, botOrUser, colour, 'normal');
            }
        } else { // Bot is posting the message

            // Convert text to speech for bot
            speech.text = userTranscript;
            speech.rate = 1.5;
            window.speechSynthesis.speak(speech);

            // Last message was from the bot
            if (lastBubble.classList.contains("chat-bubble-bot-bottom") || lastBubble.classList.contains("chat-bubble-bot")) {

                // Last message was part of a chain of messages
                if (lastBubble.classList.contains("chat-bubble-bot-bottom")) {

                    // In the current last child, remove 'bottom' class and replace it by correct one
                    lastBubble.classList.remove("chat-bubble-bot-bottom");
                    lastBubble.classList.add("chat-bubble-bot-mid");

                    // Add the chat bubble
                    sendMessage(userTranscript, botOrUser, colour, 'bottom');

                } else {// Last message was on its own

                    // In the current last child, remove 'normal' class and replace it by correct one
                    lastBubble.classList.remove("chat-bubble-bot");
                    lastBubble.classList.add("chat-bubble-bot-top");

                    // Add the chat bubble
                    sendMessage(userTranscript, botOrUser, colour, 'bottom');
                }

            } else { // Last message was from the user

                // Add the chat bubble
                sendMessage(userTranscript, botOrUser, colour, 'normal');
            }
        }
    } else { // Chat is empty
        // Add the chat bubble
        sendMessage(userTranscript, botOrUser, colour, 'normal');
    }

    // Scrolls to the bottom of the chat
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Appends normal text bubble
function sendMessage(userTranscript, botOrUser, colour, normalOrBottom) {

    // Create a div
    let textBubble = document.createElement('div');
    // Give it appropiate class and innerHTML
    textBubble.className = 'chat-div-' + botOrUser;
    if (normalOrBottom == 'normal') {
        textBubble.innerHTML = '<div class="chat-bubble-' + botOrUser + ' p-2 bg-' + colour + ' bg-gradient"><p>' + userTranscript + '</p></div>';
    } else {
        textBubble.innerHTML = '<div class="chat-bubble-' + botOrUser + '-bottom p-2 bg-' + colour + ' bg-gradient"><p>' + userTranscript + '</p></div>';
    }

    // Append to the chatBox
    chatBox.appendChild(textBubble);
}