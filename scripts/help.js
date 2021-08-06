// This function shows a toast containing some information to help the user
// Code by: Justin

// Arguments:
// category -> what the help message is about(appointment, mail...)
// items -> the list of actions the user can take
// delay -> time in ms before the help disappears

// Example on how to call it:
// items = ['First help bullet point', 'Second help bullet point', 'Third help bullet point'];
// showHelp('General', items, 5000);

function showHelp(category, items, disappearDelay) {

    // Gets the toast
    var helpToast = document.getElementById('HelpToast');

    // Creates a variable to pass to the toast
    var options = { animation: true, autohide: true, delay: disappearDelay }

    // Changes the toast with passed parameters
    document.getElementById('help-description').innerText = category;

    list = document.getElementById('help-list');
    list.innerHTML = '';

    items.forEach(element => {
        list.innerHTML += '<li>' + element + '</li>';
    });

    // Makes the toast Element into a boostrap element
    helpToast = new bootstrap.Toast(helpToast, options);

    // Shows the toast to the user
    helpToast.show();
}