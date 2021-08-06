// Shows the files on the oneDrive
// Code by: Justin

// Displays the files
async function showFiles() {

    pushChat('These are the documents located within your Drive','bot');

    var data = await getFiles();

    let listHTML = '<div><h3 class="m-2 text-center">Files</h3></div><div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 p-3">';

    // Construct string for files
    for (const files of data.value) {
        listHTML += '<div class="col mb-4"><div class="card border-dark mb-3" style="max-width: 18rem;"> <div class="card-header fs-6">' + files.name + '</div><div class="card-body text-dark"><small class="text-muted">Size:</small><p class="card-text">' + (files.size / 1024).toFixed(2) + ' KB</p><small class="text-muted">Date created:</small><p class="card-text">' + moment(files.createdDateTime).format("DD MMM YYYY HH:mm") + '</p><div class="d-grid gap-2"><a href="' + files.webUrl + '" class="btn btn-secondary btn-sm" target="_blank">Link</a></div></div></div></div>';
    }
    listHTML += '</div>';
    // Display constructed string
    document.getElementById("display-panel").innerHTML = listHTML;
}

// Get user information from Microsoft Graph API
async function getFiles() {
    return await graphClient
        .api('/me/drive/root/children')
        .get();
}
