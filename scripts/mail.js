// This file handles everything email related
// Code by: Sébastien

var emailRecipient;
var emailSubject;
var emailBody;
var emailID;
var correctEmail;
var noMatch;

// Function called when any of the keywords are triggered by the main chat loop
// Parameters: user transcript
async function mail(transcript) {
    
    // Looking for emails sent by specific user
    if (transcript.includes('by') || transcript.includes('from')) { 
        
        var name = getNamesInTranscript(transcript);
        var emailAddress = await getAddressFromName(name);
        if (emailAddress != undefined) {
            var emails = await getEmailsSentBy(emailAddress);
            showEmails(emails);
        } else{
            pushChat('I cannot find anyone with that name.', 'bot');
        }

        recognition.addEventListener("result", emailEventHandler);
    }   // Looking for emails containing a specific string
    else if (transcript.includes('about') || transcript.includes('says') || transcript.includes('say')) {
        var searchTerms = getSearchTerms(transcript);
        
        var emails = await getEmailsContaining(searchTerms);

        if (emails.length == 0) {
            var botAnswer = 'I could not find emails containing ' + searchTerms + '.';
            pushChat(botAnswer, 'bot');
        } else if (emails.length == 1) {
            var botAnswer = 'I found a single email containing ' + searchTerms + '.';
            pushChat(botAnswer, 'bot');
        } else {
            var botAnswer = 'These are all the emails containing ' + searchTerms + ' that I found';
            pushChat(botAnswer, 'bot');
        }
        showEmails(emails);
        recognition.addEventListener("result", emailEventHandler);
    } // Sending a new email
    else if (transcript.includes('write') || transcript.includes('send')) {
        // var emails = await getInboxEmails();
        requestSendEmail(transcript);
    } // Forwarding an email
    else if (transcript.includes('forward')) {
        var emails = await getInboxEmails();
        forwardEmail();
    } // Deleting an email
    else if (transcript.includes('delete')) {

        // Showing emails to user
        var emails = await getInboxEmails();
        showEmails(emails);

        // Resetting email details
        emailSubject = '';
        emailRecipient = '';
        emailID = '';
        correctEmail = false;
        noMatch = false;

        pushChat('Let\'s do it! What is the subject of the email?', 'bot');
        // Adding event listeners for specific functions
        recognition.addEventListener("result", getEmailID);
        recognition.addEventListener("result", deleteEmail);
    } // Read an email
    else if (transcript.includes('read')) {

        // Showing emails to user
        var emails = await getInboxEmails();
        showEmails(emails);

        // Resetting email details
        emailSubject = '';
        emailRecipient = '';
        emailID = '';
        correctEmail = false;
        noMatch = false;

        pushChat('Let\'s do it! What is the subject of the email?', 'bot');
        // Adding event listeners for specific functions
        recognition.addEventListener("result", getEmailID);
        recognition.addEventListener("result", readEmail);
    }// Reply to an email display
    else if (transcript.includes('reply')) {
        // Showing emails to user
        var emails = await getInboxEmails();
        showEmails(emails);

        // Resetting email details
        emailSubject = '';
        emailRecipient = '';
        emailID = '';
        correctEmail = false;
        noMatch = false;

        pushChat('Let\'s do it! What is the subject of the email to reply to?', 'bot');
        // Adding event listeners for specific functions
        recognition.addEventListener("result", getEmailID);
        recognition.addEventListener("result", replyToEmail);
    }// Refreshing display
    else if (transcript.includes('refresh')) {
        pushChat('The latest emails right here for you!', 'bot');
        recognition.addEventListener("result", emailEventHandler);
        var emails = await getInboxEmails();
        showEmails(emails);
    } // Show help display
    else if (transcript.includes('help')) {
        pushChat('I\'m here for you. Check the bottom left corner.', 'bot');

        items = ['Sending an email => send', 'Replying to an email => reply', 'Deleting an email => delete', 'Filtering email by sender => from/by', 'Look for specific words in emails => about/say'];
        showHelp('Email', items, 15000);

        recognition.addEventListener("result", emailEventHandler);
        var emails = await getInboxEmails();
        showEmails(emails);
    } // Showing emails
    else {
        pushChat('And here comes a batch of emails straight from your inbox!', 'bot');
        pushChat('Would you like me to read one for you? Or perhaps send a reply to someone?', 'bot');
        recognition.addEventListener("result", emailEventHandler);
        var emails = await getInboxEmails();
        showEmails(emails);
    }

    
}


// Handles user input after showing the emails
async function emailEventHandler(event) {
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

        // Looking for emails sent by specific user
        if (transcript.includes('by') || transcript.includes('from')) {

            var name = getNamesInTranscript(transcript);
            var emailAddress = await getAddressFromName(name);
            if (emailAddress != undefined) {
                var emails = await getEmailsSentBy(emailAddress);
                showEmails(emails);
            } else {
                pushChat('I cannot find anyone with that name.', 'bot');
            }

            recognition.addEventListener("result", resultOfSpeechRecognition);
            recognition.removeEventListener("result", emailEventHandler);
        }   // Looking for emails containing a specific string
        else if (transcript.includes('about') || transcript.includes('says') || transcript.includes('say')) {
            var searchTerms = getSearchTerms(transcript);

            var emails = await getEmailsContaining(searchTerms);

            if (emails.length == 0) {
                var botAnswer = 'I could not find emails containing ' + searchTerms + '.';
                pushChat(botAnswer, 'bot');
            } else if (emails.length == 1) {
                var botAnswer = 'I found a single email containing ' + searchTerms + '.';
                pushChat(botAnswer, 'bot');
            } else {
                var botAnswer = 'These are all the emails containing ' + searchTerms + ' that I found';
                pushChat(botAnswer, 'bot');
            }
            showEmails(emails);

            recognition.addEventListener("result", resultOfSpeechRecognition);
            recognition.removeEventListener("result", emailEventHandler);
        } // Sending a new email
        else if (transcript.includes('write') || transcript.includes('send') || transcript.includes('to')) {
            // var emails = await getInboxEmails();
            requestSendEmail(transcript);
            recognition.removeEventListener("result", emailEventHandler);
        } // Forwarding an email
        else if (transcript.includes('forward')) {
            var emails = await getInboxEmails();
            forwardEmail();
        } // Deleting an email
        else if (transcript.includes('delete')) {

            // Showing emails to user
            var emails = await getInboxEmails();
            showEmails(emails);

            // Resetting email details
            emailSubject = '';
            emailRecipient = '';
            emailID = '';
            correctEmail = false;
            noMatch = false;

            pushChat('Let\'s do it! What is the subject of the email?', 'bot');
            // Adding event listeners for specific functions
            recognition.addEventListener("result", getEmailID);
            recognition.addEventListener("result", deleteEmail);
            recognition.removeEventListener("result", emailEventHandler);
        } // Read an email
        else if (transcript.includes('read')) {

            // Showing emails to user
            var emails = await getInboxEmails();
            showEmails(emails);

            // Resetting email details
            emailSubject = '';
            emailRecipient = '';
            emailID = '';
            correctEmail = false;
            noMatch = false;

            pushChat('Let\'s do it! What is the subject of the email?', 'bot');
            // Adding event listeners for specific functions
            recognition.addEventListener("result", getEmailID);
            recognition.addEventListener("result", readEmail);
            recognition.removeEventListener("result", emailEventHandler);
        } // Reply to an email display
        else if (transcript.includes('reply')) {
            // Showing emails to user
            var emails = await getInboxEmails();
            showEmails(emails);

            // Resetting email details
            emailSubject = '';
            emailRecipient = '';
            emailID = '';
            correctEmail = false;
            noMatch = false;

            pushChat('Let\'s do it! What is the subject of the email to reply to?', 'bot');
            // Adding event listeners for specific functions
            recognition.addEventListener("result", getEmailID);
            recognition.addEventListener("result", replyToEmail);
            recognition.removeEventListener("result", emailEventHandler);
        }// Refreshing display
        else if (transcript.includes('refresh')) {
            pushChat('The latest emails right here for you!', 'bot');
            var emails = await getInboxEmails();
            showEmails(emails);
        } // Show help display
        else if (transcript.includes('help')) {
            pushChat('I\'m here for you. Check the bottom left corner.', 'bot');

            items = ['Sending an email: say &#8220send&#8221', 'Replying to an email: say &#8220reply&#8221', 'Deleting an email: say &#8220delete&#8221', 'Filtering email by sender: say &#8220from/by&#8221', 'Look for specific words in emails: say &#8220about/says&#8221'];
            showHelp('Email', items, 15000);

            var emails = await getInboxEmails();
            showEmails(emails);
        }// Showing emails
        else {
            // pushChat('And here comes a batch of emails straight from your inbox!', 'bot');
            // pushChat('Would you like me to read one for you? Or perhaps send a reply to someone?', 'bot');
            defaultAnswer();
            var emails = await getInboxEmails();
            recognition.removeEventListener("result", emailEventHandler);
            recognition.addEventListener("result", resultOfSpeechRecognition);
            showEmails(emails);
        }
    }
}


// Displays emails passed
function showEmails(listOfEmails) {
    var userInfo = JSON.parse(sessionStorage.getItem('graphUser'));

    // Gets the element to display into
    var displayPanel = document.getElementById('display-panel');

    // Creates a new div to put content into
    var div = document.createElement('div');
    div.classList.add('container', 'mt-4');
    var inner ='<div class="row row-cols-2 g-4">';

    // Loops through all emails and adds them to the content div
    listOfEmails.forEach(email => {
        time = new Date(email.receivedDateTime);

        inner += '<div class="col">' +
            '<div class="card">' +
            '<div class="card-body">' +
            '<h5 class="card-title email-subject">Subject:<span class="actual-email-subject ms-1"> ' + email.subject + '</span></h5>' +
            '<p class="card-text email-body">' + email.body.content + '</p>' +
            '</div>' +
            '<div class="card-footer">' +
            '<small class="text-muted email-from">From: ' + email.from.emailAddress.name + '</small>' +
            '<small class="text-muted email-date float-end">Received: ' + time.toDateString() + '</small>' +
            '</div> ' +
            '</div>' +
            '</div>';
    });

    inner += '</div></div>';

    div.innerHTML = inner;

    // Empties display element from existing content
    displayPanel.innerHTML = '';
    

    // Appends child with content
    displayPanel.appendChild(div);
}

// Displays all emails in the mailbox (includes all folders: drafts, inbox, sent...)
async function getAllEmails() {

    try {
        // Create request to Microsoft Graph API
        let messages = await graphClient.api('/me/messages?top=100')
            .header("Prefer", `outlook.body-content-type="text"`)
            .get();

        // Gets the emails from server response
        let emailsArray = messages.value;
        return emailsArray;
    }
    catch (error) {
        console.log(error);
    }
}

// Returns all emails from inbox
async function getInboxEmails() {

    try {
        // Create request to Microsoft Graph API
        let messages = await graphClient.api('/me/mailFolders/inbox/messages?top=100')
            .header("Prefer", `outlook.body-content-type="text"`)
            .get();

        // Gets the emails from server response
        let emailsArray = messages.value;
        return emailsArray;
    }
    catch (error) {
        console.log(error);
    }
}

// Returns all emails from inbox
async function getEmailByID(id) {

    try {
        // Create request to Microsoft Graph API
        let message = await graphClient.api('/me/messages/' + id)
            .header("Prefer", `outlook.body-content-type="text"`)
            .get();

        // Turning the message into an array of one message so that it can be used by other functions
        message = [message];

        // Gets the emails from server response
        return message;
    }
    catch (error) {
        console.log(error);
    }
}

// Returns words after "by", "from" or "to" in a string
function getNamesInTranscript(transcript) {
    var splitTranscript = transcript.split(' ');
    var keyWordIndex = -1;
    var name = '';
    var i;

    // Loops through transcript to get position of keyword
    for (i = 0; i < splitTranscript.length; i++) {
        if (splitTranscript[i] == 'by' || splitTranscript[i] == 'from' || splitTranscript[i] == 'to') {
            keyWordIndex = i;
        }
    }

    // Loops from keyword position + 1 to end of transcript
    for (i = keyWordIndex + 1; i < splitTranscript.length; i++) {
        if (i < splitTranscript.length - 1) {
            name += splitTranscript[i] + ' ';
        } else {
            name += splitTranscript[i];
        }
    }

    return name;
}

async function getAddressFromName(name) {
    
    var emailAddress;
    var allEmails = await getAllEmails();
    name = name.toLowerCase();

    allEmails.forEach(email => {
        var emailName = email.from.emailAddress.name.toLowerCase();

        if (emailName == name) {
            emailAddress = email.from.emailAddress.address;
        }
    });

    return emailAddress;
}

// Displays emails matching an email address
async function getEmailsSentBy(emailAddress) {
    try {
        // Create request to Microsoft Graph API
        let messages = await graphClient.api("/me/messages?$filter=(from/emailAddress/address) eq \'" + emailAddress + "\'")
            .header("Prefer", `outlook.body-content-type="text"`)
            .get();

        // Gets the emails from server response
        let emailsArray = messages.value;
        console.log(emailsArray);
        return emailsArray;
    }
    catch (error) {
        console.log(error);
    }
}

// Gets search terms out of a sentence
function getSearchTerms(transcript) {
    var splitTranscript = transcript.split(' ');
    var keyWordIndex = -1;
    var searchTerms = '';
    var i;

    // Loops through transcript to get position of keyword
    for (i = 0; i < splitTranscript.length; i++) {
        if (splitTranscript[i] == 'about' || splitTranscript[i] == 'says' || splitTranscript[i] == 'say') {
            keyWordIndex = i;
        }
    }

    // Loops from keyword position + 1 to end of transcript
    for (i = keyWordIndex + 1; i < splitTranscript.length; i++) {
        if (i < splitTranscript.length - 1) {
            searchTerms += splitTranscript[i] + ' ';
        } else {
            searchTerms += splitTranscript[i];
        }
    }
    
    return searchTerms;
}

// Displays emails containing specific words
async function getEmailsContaining(searchTerms) {

    try {
        // Create request to Microsoft Graph API
        let messages = await graphClient.api('/me/messages?$search="' + searchTerms + '"&?top=100')
            .header("Prefer", `outlook.body-content-type="text"`)
            .get();

        // Gets the emails from server response
        let emailsArray = messages.value;
        return emailsArray;
    }
    catch (error) {
        console.log(error);
    }
}

// Sends an email
async function requestSendEmail(transcript) {
    // User mentioned recipient
    if (transcript.includes('cancel')) {
        pushChat('Okay, email cancelled', 'bot');
        recognition.addEventListener("result", resultOfSpeechRecognition);
    } else if (transcript.includes('to')) {
        
        // User specified an email address
        if (transcript.includes('at')) {
            var emailAddress = '';
            var unprocessedEmailAddress = getNamesInTranscript(transcript);

            // Splitting by word
            unprocessedEmailAddress = unprocessedEmailAddress.split(' ');

            unprocessedEmailAddress.forEach(word => {
                
                if (word == 'at') {
                    emailAddress += '@';
                } else {
                    emailAddress += word;
                }
            });

            emailRecipient = emailAddress;
        } else {
            await setEmailFromTranscript(transcript);
        }

        if (emailRecipient != undefined) {
            var botMessage = 'Great, writing an email to ' + emailRecipient + '. What should the subject be?';
            pushChat(botMessage, 'bot');
            recognition.addEventListener("result", recognitionOfSubject);
        } else {
            var botMessage = 'I didn\'t recognize that person, can you repeat please?';
            pushChat(botMessage, 'bot');
        }
        
    } else { // User did not mention recipient
        pushChat('Okay, let\'s send an email! Who would you like to write to?', 'bot');

        recognition.addEventListener("result", recognitionOfRecipient);
    }
}

async function recognitionOfRecipient(event) {
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

        if (transcript.includes('cancel email')) {
            pushChat('We can stop here, no problem.', 'bot');
        } else {
            transcript.toLowerCase();

            if (transcript.includes('at')) {
                var emailAddress = '';
                var unprocessedEmailAddress = getNamesInTranscript(transcript);

                // Splitting by word
                unprocessedEmailAddress = unprocessedEmailAddress.split(' ');

                unprocessedEmailAddress.forEach(word => {

                    if (word == 'at') {
                        emailAddress += '@';
                    } else {
                        emailAddress += word;
                    }
                });

                emailRecipient = emailAddress;
            } else {
                await setEmailFromTranscript(transcript.trim());
            }

            if (emailRecipient != undefined) {
                var botMessage = 'Great, writing an email to ' + emailRecipient + '. What should the subject be?';
                pushChat(botMessage, 'bot');

                emailSubject = '';

                recognition.removeEventListener("result", recognitionOfRecipient)
                recognition.addEventListener("result", recognitionOfSubject);
            } else {
                var botMessage = 'I didn\'t recognize that person, can you repeat please?';
                pushChat(botMessage, 'bot');
            }
        }
        
        
    }
}

async function setEmailFromTranscript(transcript) {
    var name = getNamesInTranscript(transcript);

    emailRecipient = await getAddressFromName(name);
}

function recognitionOfSubject(event) {
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

        if (transcript.toLowerCase().includes('cancel email')) {
            pushChat('Got it, email canceled.', 'bot');
            recognition.removeEventListener("result", recognitionOfSubject);
            recognition.addEventListener("result", resultOfSpeechRecognition);
        } else {
            emailSubject = transcript;

            pushChat('And what should the email say? Let me know when you are done by saying "email finished".', 'bot');

            emailBody = '';
            recognition.removeEventListener("result", recognitionOfSubject)
            recognition.addEventListener("result", recognitionOfBody);
        }
    }
}

function recognitionOfBody(event) {
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


        if(transcript.toLowerCase().includes('cancel email')) {
            pushChat('Got it, email canceled.', 'bot');
            recognition.removeEventListener("result", recognitionOfSubject);
            recognition.addEventListener("result", resultOfSpeechRecognition);
        } else if (transcript.includes('email finished')) {

            var body = transcript.split('email finished');
            emailBody += body[0];

            pushChat('Great, this is the email I am about to send. Can you confirm everything is okay?', 'bot');

            recognition.removeEventListener("result", recognitionOfBody);
            recognition.addEventListener("result", checkEmailBeforeSending);
            

            // Gets the element to display into
            var displayPanel = document.getElementById('display-panel');

            // Creates a new div to put content into
            var div = document.createElement('div');
            div.classList.add('container', 'mt-4');
            var inner = '<div class="row g-4">';

            // Adds email to the div
            inner += '<div class="col">' +
                '<div class="card">' +
                '<div class="card-body">' +
                '<h5 class="card-title email-subject">Subject:<span class="actual-email-subject ms-1"> ' + emailSubject + '</span></h5>' +
                '<p class="card-text email-body">' + emailBody + '</p>' +
                '</div>' +
                '<div class="card-footer">' +
                '<small class="text-muted email-from">To: ' + emailRecipient + '</small>' +
                '</div> ' +
                '</div>' +
                '</div>';

            inner += '</div></div>';

            div.innerHTML = inner;

            // Empties display element from existing content
            displayPanel.innerHTML = '';

            // Appends child with content
            displayPanel.appendChild(div);


        } else {
            emailBody += transcript;
        }        
    }
}

async function checkEmailBeforeSending(event) {
    
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

        if (transcript.includes('yes') || transcript.includes('okay') || transcript.includes('good') || transcript.includes('send')) {
            sendEmail();
            recognition.removeEventListener("result", checkEmailBeforeSending);
        } else {
            pushChat('I guess that\'s a no then. Email deleted!', 'bot');
            recognition.addEventListener("result", resultOfSpeechRecognition);
            recognition.removeEventListener("result", checkEmailBeforeSending);
        }
    }
}

async function sendEmail() {

    // Create the JSON body of the request
    var newEmail = {
        message: {
            subject: emailSubject,
            body: {
                contentType: Text,
                content: emailBody
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: emailRecipient
                    }
                }
            ]
        }
    }

    try {
        // Create request to Microsoft Graph API

        var response = await graphClient.api('/me/sendMail')
            .header("Content-type", "application/json")
            .post(newEmail);
        
        console.log(response);

        // response does not return expected output yet email is sent properly, can't figure out why (probably cause crosoft is a dumpster fire)
        // if (response.status == 200) {
        //     pushChat('Your email is sailing the smooth seas of the internet, towards its recipients inbox!', 'bot');
        //     recognition.addEventListener("result", resultOfSpeechRecognition);
        // } else {
        //     pushChat('An error occured when sending your email. *sad beep boop*', 'bot');
        //     recognition.addEventListener("result", resultOfSpeechRecognition);
        // }

        pushChat('Your email is sailing the smooth seas of the internet, towards its recipients inbox!', 'bot');
        recognition.addEventListener("result", resultOfSpeechRecognition);
    }
    catch (error) {
        console.log(error);
    }


    
}

// Retrieves the ID of an email based on sender name and subject
async function getEmailID(event) {
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
        if (emailSubject == '') {
            emailSubject = transcript;
            pushChat('Great, can you tell me the email sender now?', 'bot');
        } else if (emailRecipient == '') {
            emailRecipient = transcript;
        }


        // Get all emails, check for emails with matching senders and subjects
        if (emailRecipient !== '' && emailSubject !== '') {
            var allEmails = await getAllEmails();
            emailSubject = emailSubject.trim();
            emailRecipient = emailRecipient.trim();
            emailSubject = emailSubject.toLowerCase();
            emailRecipient = emailRecipient.toLowerCase();

            allEmails.forEach(email => {
                if ((emailRecipient.includes(email.from.emailAddress.name.toLowerCase()) || email.from.emailAddress.name.toLowerCase().includes(emailRecipient))
                    && (emailSubject.includes(email.subject.toLowerCase()) || email.subject.toLowerCase().includes(emailSubject))) {
                    emailID = email.id;
                }
            });
        }

        
        if (emailID !== '') {            
            pushChat('This is the email I found. Is it the correct one?', 'bot');

            emailFound = await getEmailByID(emailID);
            showEmails(emailFound);

            correctEmail = true;

            recognition.removeEventListener('result', getEmailID);
        } else if (emailRecipient !== '' && emailSubject !== '') {
            pushChat('I could not find any email matching your request. Sorry.', 'bot');
            noMatch = true;
            recognition.removeEventListener('result', getEmailID);
        }
    }
}


// Forwards email
function forwardEmail() {
    
}

// Deletes email
async function deleteEmail(event) {

    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const msgBox = document.getElementById("userFeedback");

    msgBox.innerHTML = transcript;

    // Getting last results's index
    var i = event.results.length - 1;
    
    // If noMatch stop listening for this
    if (noMatch == true) {
        recognition.removeEventListener('result', deleteEmail);
        recognition.addEventListener('result', resultOfSpeechRecognition);
    } else if (correctEmail == true && event.results[i].isFinal == true) {    // Checking if the user stopped talking and a matching email has been found
        pushChat(transcript, 'user');

        if (transcript.includes('yes')) {
            await graphClient.api('/me/messages/' + emailID)
                .delete();
            pushChat('Email deleted. Do you need me to do something else?', 'bot');
            recognition.removeEventListener('result', deleteEmail);
            recognition.addEventListener('result', resultOfSpeechRecognition);
        } else {
            pushChat('I guess I made a mistake. Sorry about that.', 'bot');
            recognition.removeEventListener('result', deleteEmail);
            recognition.addEventListener('result', resultOfSpeechRecognition);
        }
    }

}

// Replies to email
async function replyToEmail(event) {

    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const msgBox = document.getElementById("userFeedback");

    msgBox.innerHTML = transcript;

    // Getting last results's index
    var i = event.results.length - 1;

    // If noMatch stop listening for this
    if (noMatch == true) {
        recognition.removeEventListener('result', replyToEmail);
        recognition.addEventListener('result', resultOfSpeechRecognition);
    } else if (correctEmail == true && event.results[i].isFinal == true) {    // Checking if the user stopped talking and a matching email has been found
        pushChat(transcript, 'user');

        if (transcript.includes('yes')) {
            pushChat('And what should the email say? Let me know when you are done by saying "email finished".', 'bot');

            emailBody = '';

            recognition.removeEventListener('result', replyToEmail);
            recognition.addEventListener('result', sendReply);
        } else {
            pushChat('I guess I made a mistake. Sorry about that.', 'bot');
            recognition.removeEventListener('result', replyToEmail);
            recognition.addEventListener('result', resultOfSpeechRecognition);
        }
    }

}

async function sendReply(event) {
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


        if (transcript.toLowerCase().includes('cancel email')) {
            pushChat('Alright, reply canceled.', 'bot');
            recognition.removeEventListener("result", recognitionOfSubject);
            recognition.addEventListener("result", resultOfSpeechRecognition);
        } else if (transcript.includes('email finished')) {

            var body = transcript.split('email finished');
            emailBody += body[0];

            var reply = {
                "comment": emailBody
            }

            await graphClient.api('/me/messages/' + emailID + '/reply')
                .post(reply);

            pushChat('Reply sent.', 'bot');

            recognition.removeEventListener("result", sendReply);
            recognition.addEventListener("result", resultOfSpeechRecognition);

        } else {
            emailBody += transcript;
        }
    }
}

// Reads aloud the content of an email
async function readEmail(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const msgBox = document.getElementById("userFeedback");

    msgBox.innerHTML = transcript;

    // Getting last results's index
    var i = event.results.length - 1;


    // If noMatch stop listening for this
    // If noMatch stop listening for this
    if (noMatch == true) {
        recognition.removeEventListener('result', deleteEmail);
        recognition.addEventListener('result', resultOfSpeechRecognition);
    } else if (correctEmail == true && event.results[i].isFinal == true) {    // Checking if the user stopped talking and a matching email has been found
        pushChat(transcript, 'user');

        if (transcript.includes('yes')) {
            emailFound = await getEmailByID(emailID);
            pushChat(emailFound[0].body.content, 'bot');
            pushChat('Anything else I can help you with?', 'bot');
            
            recognition.removeEventListener('result', readEmail);
            recognition.addEventListener('result', resultOfSpeechRecognition);
        } else {
            pushChat('I guess I made a mistake. Sorry about that!', 'bot');
            recognition.removeEventListener('result', readEmail);
            recognition.addEventListener('result', resultOfSpeechRecognition);
        }
    }
}