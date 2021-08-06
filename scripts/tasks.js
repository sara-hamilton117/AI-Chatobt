// This file handles everything Tasks/To Do related
// Code by: Sara

var listID;
var taskID;

// Function called when any of the keywords are triggered by the main chat loop
// Parameters: user transcript
async function tasks(transcript) {

    let lists = await getAllLists();
    showLists(lists);

    // Deleting Task
    if (transcript.includes('delete') && (transcript.includes('task') || transcript.includes('tasks'))) {
        pushChat('From which list would you like me to delete the task?', 'bot');
        recognition.addEventListener('result', findTaskToDeleteEventHandler);
    }

    // Deleting List
    else if (transcript.includes('delete') && (transcript.includes('list') || transcript.includes('lists'))) {
        pushChat('Which list would you like me to delete?', 'bot');
        recognition.addEventListener('result', findListToDeleteEventHandler);
    }

    // Creating Task
    else if ((transcript.includes('create') || transcript.includes('new') || transcript.includes('make')) && (transcript.includes('task') || transcript.includes('tasks'))) {
        pushChat('In which list do you want to add your new task?','bot');
        recognition.addEventListener('result', findListToCreateTaskEventHandler);
    }

    // Creating List
    else if ((transcript.includes('create') || transcript.includes('new') || transcript.includes('make')) && (transcript.includes('list') || transcript.includes('lists') || transcript.includes('to do'))) {
        pushChat('What would you like to name your new list?', 'bot');
        recognition.addEventListener('result', createListEventHandler);
    }


    // If user wants to cancel function
    else if (transcript.includes('cancel')) {
        recognition.addEventListener('result', resultOfSpeechRecognition);
    }

    // If no keyword is detected
    else {
        pushChat('Here are your tasks. You can create or delete tasks here.', 'bot');
        recognition.addEventListener('result', resultOfSpeechRecognition);
    }
   
}

// Event Handler function that finds the list 
async function findTaskToDeleteEventHandler(event) {
    // Variables for current result index and transcript of user's speech
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const msgBox = document.getElementById("userFeedback");

    msgBox.innerHTML = transcript;

    // Getting last results's index
    var i = event.results.length - 1;

    if (event.results[i].isFinal == true) {

        // Adding a chat bubble with what the user said
        pushChat(transcript, 'user');

        var listName=transcript;

        var allLists = await getAllLists();

        listID = '';

        // Looping through the lists to find the matching ID
        allLists.forEach(list => {
            if (listName.includes(list.displayName.toLowerCase())) {
                listID = list.id;
            }
        });
        
        if (listID != ' '){
            // Listening for which task to delete
            pushChat('Which task do you want to delete?', 'bot');
            recognition.removeEventListener('result', findTaskToDeleteEventHandler);
            recognition.addEventListener('result', deleteTaskEventHandler);
        }else{
            pushChat('I could not find a list with that name', 'bot');
            recognition.addEventListener('result', resultOfSpeechRecognition);
        }
        
    }
}

// Event Handler function that deletes task in list
async function deleteTaskEventHandler(event) {
    // Variables for current result index and transcript of user's speech
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const msgBox = document.getElementById("userFeedback");

    msgBox.innerHTML = transcript;

    // Getting last results's index
    var i = event.results.length - 1;

    if (event.results[i].isFinal == true) {

        if (transcript.includes('cancel')) {
            pushChat('Okay', 'bot');
            recognition.removeEventListener('result', deleteTaskEventHandler);
            recognition.addEventListener('result', resultOfSpeechRecognition);
        } else {

            // Adding a chat bubble with what the user said
            pushChat(transcript, 'user');

            var taskName = transcript;
            taskName = taskName.trim();
            taskName = taskName.toLowerCase();

            var allTasks = await getAllTasks(listID);

            var taskID = '';

            // Looping thruough the tasks to find the matching ID
            allTasks.forEach(task => {
                if (taskName.includes(task.title.toLowerCase()) || task.title.toLowerCase().includes(taskName)) {
                    taskID = task.id;
                }
            });

            if (taskID != '') {
                // Deleting the task
                var response = graphClient.api('/me/todo/lists/' + listID + '/tasks/' + taskID)
                    .delete();
                // Notifying the user
                pushChat('I have deleted the task!', 'bot');

                let allLists = await getAllLists();
                showLists(allLists);

                // Going back to main menu
                recognition.removeEventListener('result', deleteTaskEventHandler);
                recognition.addEventListener('result', resultOfSpeechRecognition);
            }
            else {
                pushChat('Sorry, I did not understand which task, could you repeat?', 'bot');
            }
            allLists = await getAllLists();
            showLists(allLists);
        }

    }
}

// Event Handler function that deletes list
async function findListToDeleteEventHandler(event) {
    // Variables for current result index and transcript of user's speech
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const msgBox = document.getElementById("userFeedback");

    msgBox.innerHTML = transcript;

    // Getting last results's index
    var i = event.results.length - 1;

    if (event.results[i].isFinal == true) {

        // Adding a chat bubble with what the user said
        pushChat(transcript, 'user');

        var listName = transcript;

        var allLists = await getAllLists();

        listID = '';

        // Looping through lists to find the matching ID
        allLists.forEach(list => {
            if (listName.includes(list.displayName.toLowerCase())) {
                listID = list.id;
            }
        });

        if (listID != '') {
            // Deleting list
            var response = graphClient.api('/me/todo/lists/' + listID)
                .delete();

            // Notifying the user and taking them back to the main menu
            pushChat('I have deleted the list.', 'bot');
            let allLists = await getAllLists();
            showLists(allLists);
            
            recognition.removeEventListener('result', findListToDeleteEventHandler);
            recognition.addEventListener('result', resultOfSpeechRecognition);
        } else {
            pushChat('Sorry, I could not find that list.', 'bot');
            recognition.addEventListener('result', resultOfSpeechRecognition);
        }
        allLists = await getAllLists();
        showLists(allLists);

    }
}

// Event Handler function that finds the list 
async function findListToCreateTaskEventHandler(event) {
    // Variables for current result index and transcript of user's speech
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const msgBox = document.getElementById("userFeedback");

    msgBox.innerHTML = transcript;

    // Getting last results's index
    var i = event.results.length - 1;


    if (event.results[i].isFinal == true) {

        // Adding a chat bubble with what the user said
        pushChat(transcript, 'user');

        var listName = transcript;

        var allLists = await getAllLists();

        listID = '';

        // Looping through the lists to find the matching ID
        allLists.forEach(list => {
            if (listName.includes(list.displayName.toLowerCase())) {
                listID = list.id;
            }
        });

        if (listID != ' ') {
            // Listening for which task to delete
            pushChat('What is the task to add?', 'bot');
            recognition.removeEventListener('result', findListToCreateTaskEventHandler);
            recognition.addEventListener('result', createTaskEventHandler);
        } else {
            pushChat('I could not find a list with that name', 'bot');
            recognition.addEventListener('result', resultOfSpeechRecognition);
        }
    }
}

// Event Handler function that creates task in list
async function createTaskEventHandler(event) {
    // Variables for current result index and transcript of user's speech
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const msgBox = document.getElementById("userFeedback");

    msgBox.innerHTML = transcript;

    // Getting last results's index
    var i = event.results.length - 1;

    if (event.results[i].isFinal == true) {

        if (transcript.includes('cancel')) {
            pushChat('Okay', 'bot');
            recognition.removeEventListener('result', createTaskEventHandler);
            recognition.addEventListener('result', resultOfSpeechRecognition);
        } else {

            // Adding a chat bubble with what the user said
            pushChat(transcript, 'user');

            // Getting the task and storing it as titile
            const todoTask = {
                title: transcript
            };

            // Posting the task to the list
            var response = await graphClient.api('/me/todo/lists/' + listID + '/tasks')
            .post(todoTask);

            // Notifying the user
            pushChat('I have created the task!', 'bot');

            // Going back to main menu
            recognition.removeEventListener('result', createTaskEventHandler);
            recognition.addEventListener('result', resultOfSpeechRecognition);
            
            allLists = await getAllLists();
            showLists(allLists);
        }
    }
}

// Event Handler function that creates task in list
async function createListEventHandler(event) {
    // Variables for current result index and transcript of user's speech
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const msgBox = document.getElementById("userFeedback");

    msgBox.innerHTML = transcript;

    // Getting last results's index
    var i = event.results.length - 1;

    if (event.results[i].isFinal == true) {

        if (transcript.includes('cancel')) {
            pushChat('Okay', 'bot');
            recognition.removeEventListener('result', createListEventHandler);
            recognition.addEventListener('result', resultOfSpeechRecognition);
        } else {

            // Adding a chat bubble with what the user said
            pushChat(transcript, 'user');

            // Getting the task and storing it as titile
            const todoTask = {
                displayName: transcript
            };


            // Posting the list
            var response = await graphClient.api('/me/todo/lists/')
                .post(todoTask);

            // Notifying the user
            pushChat('I have created the list!', 'bot');

            // Going back to main menu
            recognition.removeEventListener('result', createListEventHandler);
            recognition.addEventListener('result', resultOfSpeechRecognition);

            allLists = await getAllLists();
            showLists(allLists);
        }
    }
}

// Function that gets Task ID based on transcript
async function getTaskId(){
    var allTasks = await getAllTasks(listID);

    taskID = '';

    allTasks.forEach(task => {
        if (taskName.includes(task.title.toLowerCase())) {
            taskID = task.id;
        }
    });
}

// Function to display tasks using Bootstrap Cards
async function showLists(allLists) {
    var userInfo = JSON.parse(sessionStorage.getItem('graphUser'));

    // Gets the element to display into
    var displayPanel = document.getElementById('display-panel');
    var stringHtml = '';
    var headerHtml = '';
    var i;
    var j;

    headerHtml = '<h3 class="m-2 text-center"> Tasks </h3>';

    for (i=0; i<allLists.length; i++) {
        var tasks = await getAllTasks(allLists[i].id);

        stringHtml += '<div class="card m-2">' +
            '  <div class="card-header">' +
            '  <h5 class="font-weight-bold mt-2">' +
            allLists[i].displayName +
            '  </h5>' +
            '  </div>' +
            '  <div class="card-body p-0">' +
            '<ul class="list-group list-group-flush">';

            tasks.forEach(task => {
                stringHtml += '  <li class="list-group-item">' + task.title + '</li>';
            });

            stringHtml += '</ul>' +
            '  </div>' +
            '</div>';
    }
    displayPanel.innerHTML = headerHtml + stringHtml;
}

// Function that finds all lists and returns the value
async function getAllLists() {

    // Create request to Microsoft Graph API
    try{
        let lists = await graphClient.api('me/todo/lists')
        .get();

        // Gets the lists from server response
        let listValue = lists.value;
        return listValue;

    }
    
    catch (error){
        console.log(error);
    }

}

// Function that gets all the tasks from the list using the ID
async function getAllTasks(id) {

    // Create request to Microsoft Graph API
    try {
        let tasks = await graphClient.api('me/todo/lists/' + id + '/tasks')
            .get();

        // Gets the lists from server response
        let tasksValue = tasks.value;
        return tasksValue;
    }

    catch (error) {
        console.log(error);
    }

}

