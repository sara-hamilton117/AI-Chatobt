// This file handles the administration functions
// Code by: Justin

// Variables used for administration
var remainingBalance = 0;
var paidBalance = 0;

// Function called when any of the keywords are triggered by the main chat loop
// Parameters: user transcript
function checkAdmin(transcript) {

    // Shows opening hours of the campus or administration
    if (transcript.includes('hours') || transcript.includes('time') || transcript.includes('open')) {
        pushChat("During the winter period, the campus is open from 8:30 till 21:00 from Monday to Friday and 08:00 till 12:00 on Saturdays. The Office is closed on Sundays and public holidays", "bot");
        pushChat("In summer, it opens from 9:00 till 15:30 from Monday to Friday and closed on Saturdays, Sundays and public holidays", "bot");

        // Shows the address of the university
    } else if (transcript.includes('where') || transcript.includes('location') || transcript.includes('address')) {
        pushChat("We're located at the Middlesex University Malta campus. Our address is Block A, Alamein Road Pembroke PBK 1776, Malta", "bot")

        // Provides email information
    } else if (transcript.includes('contact') || transcript.includes('mail')) {
        pushChat("You can email us on enquiriesmalta@mdx.ac.uk or admissionsmalta@mdx.ac.uk. You can also ask me to send it for you.", "bot")

        // Calls the university's front desk 
    } else if (transcript.includes('call') || transcript.includes('phone')) {
        pushChat("Calling Middlesex University Malta", "bot")
        window.open('tel:0035621456862');

        // Show the student's details and finances
    } else if (transcript.includes('check') || transcript.includes('show')) {
        pushChat("Here are your details and finances", "bot")
        loadBilling();

        // Process payment of fees
    } else if (transcript.includes('pay') || transcript.includes('show')) {
        recognition.removeEventListener("result", resultOfSpeechRecognition);
        recognition.addEventListener("result", paymentHandler);
        pushChat("Let's process your payment. How much are you willing to pay today?", "bot")
        loadBilling();
    } else {
        pushChat("Here are your details and finances", "bot")
        loadBilling();
        items = ['Perform payment: say &#8220Pay fees&#8221', 'Check balance item: say &#8220Check balance&#8221'
                , 'Contact info: say &#8220Contact campus&#8221', 'Call reception: say &#8220Call campus&#8221'];
            showHelp('Administration', items, 15000);
    }
}

// Loads the student's details and financial details
async function loadBilling() {

    try {

        // requests the user's details from Graph API
        var userDetails = await getUserBilling();

        // requests the user's details from Graph API
        var userFinances = await getUserFinances();

        // Construct HTML string
        var htmlString = '<div class="container"> <div class="text-center"> <div class="text-center"><img src="../assets/images/middlesex-university-malta.jpg" class="rounded" alt="mdx-logo"></div><h2>University Admin Information</h2><p>The university has the following details in its records</p></div><div class="row"><div class="col-7 px-2"><div class="card"><div class="card-body"><h5>Student Details</h5>';
        htmlString += '<ul class="list-group"> <li class="list-group-item"> <b>Full Name:</b> ' + userDetails.displayName + '</li> <li class="list-group-item"> <b>E-mail:</b> ' + userDetails.userPrincipalName + '</li><li class="list-group-item"> <b>Street Address:</b> <p>34, Serenity House <br>Merchant street </p> </li> <li class="list-group-item"> <b>City:</b> Valletta </li> <li class="list-group-item"> <b>PostCode:</b> VLT 1172 </li> <li class="list-group-item"> <b>Country:</b> Malta </li> <li class="list-group-item"> <b>Phone:</b> (+356) 8585 4785 </li> </ul> </div> </div> </div><div class="col-5 px-2"> <div class="card"> <div class="card-body"><h5 class="card-title">Financial Details 2020/21</h5> <ul class="list-group">'
        for (const balances of userFinances.values) {
            htmlString += '<li class="list-group-item d-flex justify-content-between lh-sm"> <b>' + balances[0] + ':</b> €' + balances[1] + '</li>';
            if (balances[0].includes("Pending")) {
                remainingBalance = balances[1];
            }
            if (balances[0].includes("Paid")) {
                paidBalance = balances[1];
            }
        }
        htmlString += '</ul></div></div></div></div></div>';

        // Display constructed string
        document.getElementById("display-panel").innerHTML = htmlString;

    } catch {
        // Show error in console
        console.log(error);
    }
}

// Function collects and submits data to create the user's appointment
async function paymentHandler(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const msgBox = document.getElementById("userFeedback");
    let eventSent = false;
    let paymentAmount = 0;

    msgBox.innerHTML = transcript;

    var i = event.results.length - 1;
    if (event.results[i].isFinal == true) {

        let userSentence = transcript.toLowerCase();

        if (userSentence.includes('cancel') || userSentence.includes('stop')) {

            // Ask user to say the value again
            pushChat('Payment cancelled.', 'bot');

            // Remove EventListener and reactivate the original EventListener
            recognition.removeEventListener("result", paymentHandler);
            recognition.addEventListener("result", resultOfSpeechRecognition);
        } else {

            paymentAmount = parseInt(userSentence);

            // Validate if year is between set range
            if (paymentAmount >= 1 && paymentAmount <= remainingBalance) {

                // Create JSON object
                let paymentValue = {
                    values: [[paidBalance + paymentAmount]]
                };

                try {
                    await graphClient
                        .api("/drives/96b2a788d7d0cadf/items/96B2A788D7D0CADF!118/workbook/worksheets('Sheet1')/range(address='B4:B4')")
                        .update(paymentValue);
                    pushChat('A payment of €' + paymentAmount + ' processed. Please check balance', 'bot');

                } catch (error) {
                    console.log(error);
                }
                eventSent = true;

            } else {

                // Ask user to say the value again
                pushChat('That is not a valid amount or it exceeds the pending amount. Please try again.', 'bot');
            }
        }
    }

    if (eventSent) {

        loadBilling();

        // Remove EventListener and reactivate the original EventListener
        recognition.removeEventListener("result", paymentHandler);
        recognition.addEventListener("result", resultOfSpeechRecognition);
    }
}

// Get user information from API
async function getUserBilling() {
    return await graphClient
        .api('/me')
        .get();
}

// Get financial data from Microsoft Graph API
async function getUserFinances() {
    return await graphClient
        .api("/drives/96b2a788d7d0cadf/items/96B2A788D7D0CADF!118/workbook/worksheets('Sheet1')/usedRange")
        .select('values')
        .get();
}
