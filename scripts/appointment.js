// This file handles all functions related to appointments
// Code by: Justin

// Variables used for appoinments
var eventDay = null;
var eventMonth = null;
var eventYear = null;
var eventHour = null;
var eventMinutes = null;
var eventDuration = null;
var eventTitle = null;

// Function processes the user's voice input and performs the required operation
// Paramenters: user transcript
function appointment(transcript) {

    if (transcript.includes('show') || transcript.includes('display')) {
        pushChat('Sure! Here are your appointments for the upcoming months.', 'bot');
        items = ['Create appointment: say &#8220Create appointment&#8221', 'Delete appointment: say &#8220Delete appointment&#8221'
            , 'Update appointment: say &#8220Update appointment&#8221', 'To cancel any process, just say "Stop" or "Cancel"',];
        showHelp('Appointments', items, 15000);
        // Display upcoming appointments
        getAppointments();

    } else if (transcript.includes('create') || transcript.includes('schedule') || transcript.includes('add') || transcript.includes('set')) {

        // Remove main EventListener to process a different set of functions
        recognition.removeEventListener("result", resultOfSpeechRecognition);
        setAppointment();
    } else if (transcript.includes('delete') || transcript.includes('remove')) {
        recognition.removeEventListener("result", resultOfSpeechRecognition);
        removeAppointment();
    } else if (transcript.includes('update') || transcript.includes('edit')) {
        recognition.removeEventListener("result", resultOfSpeechRecognition);
        editAppointment();
    } else {
        getAppointments();
        pushChat('I can help you schedule, remove or update appoinments.', 'bot');
        items = ['Create appointment: say &#8220Create appointment&#8221', 'Delete appointment: say &#8220Delete appointment&#8221'
            , 'Update appointment: say &#8220Update appointment&#8221', 'To cancel any process, just say "Stop" or "Cancel"',];
        showHelp('Appointments', items, 15000);
    }
}

// Function to CREATE an appointment
function setAppointment() {

    // Add EventListener for setting appointment
    recognition.addEventListener("result", appointmentHandler);
    pushChat('I will ask a sequence of questions to create the appointment. Shall we start by mentioning the year?', 'bot');

    // Show command examples for the user
    items = ['Try saying the days, hours and minutes in numerical form', 'The appointment will be updated in the list once done'];
    showHelp('Create appointment', items, 15000);
    getAppointments();
}

// Function collects and submits data to create the user's appointment
function appointmentHandler(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const msgBox = document.getElementById("userFeedback");
    let eventSent = false;

    msgBox.innerHTML = transcript;
    var i = event.results.length - 1;
    if (event.results[i].isFinal == true) {
        let userSentence = transcript.toLowerCase();

        // Function to stop booking process
        if (userSentence.includes('cancel') || userSentence.includes('stop')) {

            // Reset variables to null
            eventDay = null;
            eventMonth = null;
            eventYear = null;
            eventHour = null;
            eventMinutes = null;
            eventDuration = null;
            eventTitle = null;

            // Ask user to say the value again
            pushChat('Appointment booking cancelled.', 'bot');

            // Remove EventListener and reactivate the original EventListener
            recognition.removeEventListener("result", appointmentHandler);
            recognition.addEventListener("result", resultOfSpeechRecognition);

        } else {
            if (eventYear == null) {
                pushChat(transcript, 'user');
                let temp = parseInt(userSentence);
                if (temp >= 2021 && temp <= 2025) {
                    eventYear = moment().year(userSentence).format("YYYY");
                    pushChat('And month?', 'bot');
                } else {
                    pushChat('That year is not within range. Try between 2021 and 2025', 'bot');
                }
            } else if (eventMonth == null) {
                pushChat(transcript, 'user');
                const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
                if (monthNames.includes(userSentence.trim())) {
                    eventMonth = moment().month(userSentence.trim()).format("MM");
                    pushChat('Which day of the month?', 'bot');
                } else {
                    pushChat('That is not a month. Can you try again, please?', 'bot');
                }
            } else if (eventDay == null) {
                pushChat(transcript, 'user');
                var daysInMonth = moment(eventYear + "-" + eventMonth, "YYYY-MM").daysInMonth();
                if (parseInt(userSentence) >= 1 && parseInt(userSentence) <= daysInMonth) {
                    eventDay = moment().dayOfYear(userSentence).format("DD");
                    pushChat('The hour in 24-hour clock format?', 'bot');
                } else {
                    pushChat('That is not a day within the month. Please try again', 'bot');
                }
            } else if (eventHour == null) {
                pushChat(transcript, 'user');
                if (parseInt(userSentence) >= 1 && parseInt(userSentence) <= 24) {
                    eventHour = moment().hours(userSentence).format("HH");
                    pushChat('And the minutes?', 'bot');
                } else {
                    pushChat('Not a valid number. Please try again.', 'bot');
                }
            } else if (eventMinutes == null) {
                pushChat(transcript, 'user');
                if (parseInt(userSentence) >= 0 && parseInt(userSentence) <= 59) {
                    eventMinutes = moment().minutes(userSentence).format("mm");
                    pushChat('How long will this appointment take in hours?', 'bot');
                } else {
                    pushChat('Not a valid number. Please try again.', 'bot');
                }
            } else if (eventDuration == null) {
                pushChat(transcript, 'user');
                if (Number.isNaN(parseInt(userSentence)) == false) {
                    eventDuration = userSentence;
                    pushChat('What shall we call it?', 'bot');
                } else {
                    pushChat('Not a valid number. Please try again.', 'bot');
                }
            } else if (eventTitle == null) {
                pushChat(transcript, 'user');
                eventTitle = transcript;
                pushChat('Appointment ready to create. Just say the magic word or "Cancel" to stop.', 'bot');
            } else {
                postAppointment();
                eventSent = true;
            }
        }
        if (eventSent) {
            // Set variables to null
            eventDay = null;
            eventMonth = null;
            eventYear = null;
            eventHour = null;
            eventMinutes = null;
            eventDuration = null;
            eventTitle = null;
            // Remove EventListener and reactivate the original EventListener
            recognition.removeEventListener("result", appointmentHandler);
            recognition.addEventListener("result", resultOfSpeechRecognition);
        }
    }
}

// Sends appointment information
async function postAppointment() {

    let timeObj = moment(eventYear + "-" + eventMonth + "-" + eventDay + " " + eventHour + ":" + eventMinutes, "YYYY-MM-DD H:mm");
    let startDateTimeEvent = timeObj.toISOString();
    let endDateTimeEvent = timeObj.add(eventDuration, 'hours').toISOString();

    // Create JSON object
    let newAppointment = {
        subject: eventTitle,
        start: {
            dateTime: startDateTimeEvent,
            timeZone: user.mailboxSettings.timeZone
        },
        end: {
            dateTime: endDateTimeEvent,
            timeZone: user.mailboxSettings.timeZone
        }
    };

    // Post JSON object through API
    try {
        await graphClient
            .api('me/events').post(newAppointment);
        getAppointments()
        pushChat('Appointment created.', 'bot');
    } catch (error) {
        console.log(error);
    }
}

// Function to READ the user's appointments
async function getAppointments() {

    const user = JSON.parse(sessionStorage.getItem('graphUser'));

    // Convert time to Europe/Berlin time in IANA format
    let ianaTimeZone = getIanaFromWindows(user.mailboxSettings.timeZone);
    let monthStart = moment.tz('Europe/Berlin').startOf('month').utc();

    // Show events for the upcoming twelve months
    let yearSpan = moment(monthStart).add(48, 'month');

    try {
        // Create request to Microsoft Graph API
        let response = await graphClient
            .api('/me/calendarView')

            // Format the time to user's time format
            .header("Prefer", `outlook.timezone="${user.mailboxSettings.timeZone}"`)
            .query({ startDateTime: monthStart.format(), endDateTime: yearSpan.format() })

            // Request the necessary parameters
            .select('id,subject,organizer,start,end')

            // Sort by ascending order of date and time
            .orderby('start/dateTime')

            // Limit received values
            .top(30)
            .get();

        // Display the appointments using the response received
        showAppointments(response);
    }
    catch (error) {
        console.log(error);
    }
}

// Function to display the appoinments
function showAppointments(data) {

    // Construct HTML string for appointments list
    var htmlString = '<div><h3 class="m-2 text-center">Appointments</h3><table class="table table-striped"><thead><tr><th scope="col">Start date</th><th scope="col">End Date</th><th scope="col">Subject</th><th scope="col">Organiser</th><th scope="col">E-mail</th></tr></thead><tbody>';
    for (const appointments of data.value) {
        htmlString += '<tr><td scope="row">' + moment(appointments.start.dateTime).format("DD MMM YYYY, H:mm") + '</td><td>' + moment(appointments.end.dateTime).format("DD MMM YYYY, H:mm") + '</td><td>' + appointments.subject + '</td><td>' + appointments.organizer.emailAddress.name + '</td><td>' + appointments.organizer.emailAddress.address + '</td></tr>';
    }
    htmlString += '</tbody></table></div>';

    // Apply HTML string to display within website
    document.getElementById("display-panel").innerHTML = htmlString;
}

// Function to UPDATE an appointment
function editAppointment() {
    recognition.addEventListener("result", updateAppointmentID);
    pushChat('I will ask a sequence of questions to update the appointment. Shall we start by mentioning the year?', 'bot');
    getAppointments();
}

// Function used to update an appointment
async function updateAppointmentID(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const msgBox = document.getElementById("userFeedback");
    let eventSent = false;

    // clears user message box
    msgBox.innerHTML = transcript;

    // takes into account 
    var i = event.results.length - 1;
    if (event.results[i].isFinal == true) {

        // Turning the transcript in an all lowercase string
        let userSentence = transcript.toLowerCase();

        // Function to stop update process
        if (userSentence.includes('cancel') || userSentence.includes('stop')) {

            // Reset variables to null
            eventDay = null;
            eventMonth = null;
            eventYear = null;
            eventHour = null;
            eventMinutes = null;
            eventDuration = null;
            eventTitle = null;

            // Ask user to say the value again
            pushChat('Appointment update cancelled.', 'bot');

            // Remove EventListener and reactivate the original EventListener
            recognition.removeEventListener("result", updateAppointmentID);
            recognition.addEventListener("result", resultOfSpeechRecognition);

        } else {
            if (eventYear == null) {
                pushChat(transcript, 'user');

                // Create variable to validate
                let temp = parseInt(userSentence);

                // Validate if year is between set range
                if (temp >= 2021 && temp <= 2025) {

                    // Store the user input if validated
                    eventYear = moment().year(userSentence).format("YYYY");

                    // Ask user for next input
                    pushChat('And month?', 'bot');
                } else {

                    // Ask user to say the value again
                    pushChat('That year is not within range. Try between 2021 and 2025', 'bot');
                }
            } else if (eventMonth == null) {
                pushChat(transcript, 'user');

                // Array of calendar month names
                const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

                if (monthNames.includes(userSentence.trim())) {
                    eventMonth = moment().month(userSentence.trim()).format("MM");
                    pushChat('Which day of the month?', 'bot');
                } else {

                    // Ask user to say the value again
                    pushChat('That is not a month. Can you try again, please?', 'bot');

                }

            } else if (eventDay == null) {
                pushChat(transcript, 'user');
                var daysInMonth = moment(eventYear + "-" + eventMonth, "YYYY-MM").daysInMonth();
                if (parseInt(userSentence) >= 1 && parseInt(userSentence) <= daysInMonth) {
                    eventDay = moment().dayOfYear(userSentence).format("DD");
                    pushChat('What shall we change its title to?', 'bot');
                } else {

                    // Ask user to say the value again
                    pushChat('That is not a day within the month. Please try again', 'bot');
                }
            } else if (eventTitle == null) {
                pushChat(transcript, 'user');
                eventTitle = transcript;
                pushChat('Ready to update the appointment. Just say the magic word or "Cancel" to stop.', 'bot');
            } else {

                // Get appointment id from function
                let appointmentId = await getAppointmentID();
                updateAppointment(appointmentId, eventTitle);
                eventSent = true;
            }
        }
    }
    if (eventSent) {

        // Set variables to null
        eventDay = null;
        eventMonth = null;
        eventYear = null;
        eventTitle = null;
    }
}

// Get ID for the appointment
async function getAppointmentID() {
    const user = JSON.parse(sessionStorage.getItem('graphUser'));

    // Convert time to Europe/Berlin time in IANA format
    let ianaTimeZone = getIanaFromWindows(user.mailboxSettings.timeZone);

    let timeObj = moment(eventYear + "-" + eventMonth + "-" + eventDay + " 00:00", "YYYY-MM-DD H:mm");
    let startDateTimeEvent = timeObj.toISOString();
    let endDateTimeEvent = timeObj.add(24, 'hours').toISOString();
    try {

        // Create request to Microsoft Graph API
        return await graphClient.api('/me/calendarView?startDateTime=' + startDateTimeEvent + "&endDateTime=" + endDateTimeEvent)

            // Format the time to user's time format
            .header("Prefer", `outlook.timezone="${user.mailboxSettings.timeZone}"`)

            // Request the necessary parameters
            .select('id,subject,organizer,start,end')
            .get();
    }
    catch (error) {
        console.log(error);
    }
}

async function updateAppointment(data, eventTitle) {

    // Create JSON object
    let eventData = {
        subject: eventTitle,
    };

    try {
        await graphClient
            .api('/me/calendar/events/' + data.value[0].id)
            .update(eventData);

    } catch (error) {
        console.log(error);
    }
    pushChat('Appointment updated successfully.', 'bot');
    getAppointments();


    // Remove EventListener and reactivate the original EventListener
    recognition.removeEventListener("result", updateAppointmentID);
    recognition.addEventListener("result", resultOfSpeechRecognition);
}

// Function to DELETE an appointment
function removeAppointment() {
    recognition.addEventListener("result", appointmentDeletionHandler);
    pushChat('I will ask a sequence of questions to delete the appointment. Shall we start by mentioning the year?', 'bot');
    getAppointments();
}

// Function collects information to find the user's appointment
async function appointmentDeletionHandler(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const msgBox = document.getElementById("userFeedback");
    let eventSent = false;

    msgBox.innerHTML = transcript;
    var i = event.results.length - 1;
    if (event.results[i].isFinal == true) {

        // Turning the transcript in an all lowercase string
        let userSentence = transcript.toLowerCase();

        // Function to stop update process
        if (userSentence.includes('cancel') || userSentence.includes('stop')) {

            // Reset variables to null
            eventDay = null;
            eventMonth = null;
            eventYear = null;
            eventHour = null;
            eventMinutes = null;
            eventDuration = null;
            eventTitle = null;

            // Ask user to say the value again
            pushChat('Appointment deletion cancelled.', 'bot');

            // Remove EventListener and reactivate the original EventListener
            recognition.removeEventListener("result", appointmentDeletionHandler);
            recognition.addEventListener("result", resultOfSpeechRecognition);

        } else {
            if (eventYear == null) {
                pushChat(transcript, 'user');

                // Validate if the year is within range
                let temp = parseInt(userSentence);
                if (temp >= 2021 && temp <= 2025) {

                    // Store the user input if validated
                    eventYear = moment().year(userSentence).format("YYYY");

                    // Ask the user's next input
                    pushChat('And month?', 'bot');

                    // Asks the user to repeat the input if invalid
                } else {
                    pushChat('That year is not within range. Try between 2021 and 2025', 'bot');
                }
            } else if (eventMonth == null) {
                pushChat(transcript, 'user');

                // Array of calendar month names for validation
                const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

                // Validate the user's input with the array
                if (monthNames.includes(userSentence.trim())) {
                    eventMonth = moment().month(userSentence.trim()).format("MM");
                    pushChat('Which day of the month?', 'bot');
                } else {
                    pushChat('That is not a month. Can you try again, please?', 'bot');
                }
            } else if (eventDay == null) {
                pushChat(transcript, 'user');
                var daysInMonth = moment(eventYear + "-" + eventMonth, "YYYY-MM").daysInMonth();
                if (parseInt(userSentence) >= 1 && parseInt(userSentence) <= daysInMonth) {
                    eventDay = moment().dayOfYear(userSentence).format("DD");
                    pushChat('The appointment is ready to be deleted. Just say the magic word or "Cancel" to stop.', 'bot');
                } else {
                    pushChat('That is not a day within the month. Please try again', 'bot');
                }

                // Send the collected information to retrieve the appointment ID
            } else {
                // Get appointment id from function
                let appointmentId = await getAppointmentID();
                deleteAppointment(appointmentId);
                eventSent = true;
            }
        }
    }
    if (eventSent) {

        // Set variables to null
        eventDay = null;
        eventMonth = null;
        eventYear = null;

        // Remove EventListener and reactivate the original EventListener
        recognition.removeEventListener("result", appointmentDeletionHandler);
        recognition.addEventListener("result", resultOfSpeechRecognition);
    }
}

// Function to delete user's appointment through client
async function deleteAppointment(data) {
    try {
        await graphClient
            .api('/me/calendar/events/' + data.value[0].id)
            .delete();
    } catch (error) {
        console.log(error);
    }
    pushChat('Appointment deleted.', 'bot');
    getAppointments();
}
