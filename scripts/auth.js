// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// Code implemented by: Justin

// Auth configuration for use with Microsoft Authentication Library (MSAL)
const msalConfig = {
  auth: {

    // The ID is authentic to this app
    clientId: 'd455e9c8-8cef-42c3-b27c-255b0e66f01f',
    // redirectUri: 'https://andrew-01d.herokuapp.com/'
    redirectUri: 'http://localhost:8080'
  }
};

// The permissions required by this app
const msalRequest = {
  scopes: [
    'user.read',
    'mailboxsettings.readwrite',
    'calendars.readwrite',
    'mail.read',
    'mail.readwrite',
    'mail.send',
    'tasks.read',
    'tasks.readwrite',
    'email',
    'files.readwrite'
  ]
}

// Generate an access token for authentication
const authProvider = {
  getAccessToken: async () => {
    // Call getToken
    return await getToken();
  }
};

// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });

// Get user information from Microsoft Graph API
async function getUser() {
  return await graphClient
    .api('/me')

    // Query the required fields for the user
    .select('id,displayName,mail,userPrincipalName,mailboxSettings')

    .get();
}

// Store client info for MSAL
const msalClient = new msal.PublicClientApplication(msalConfig);

// Display sign in window for MSAL
async function signIn() {

  try {

    // Use MSAL to login
    const authResult = await msalClient.loginPopup(msalRequest);

    // Store the MSAL account within session storage
    sessionStorage.setItem('msalAccount', authResult.account.username);

    user = await getUser();

    // Store the user's information received from MS Graph
    sessionStorage.setItem('graphUser', JSON.stringify(user));

    // Show user information on the app's header
    headerUser()

  } catch (error) {

    // Show error in console
    console.log(error);
  }
}

// Sign out user and delete the related information
function signOut() {
  account = null;

  // Remove user info from session storage
  sessionStorage.removeItem('graphUser');
  msalClient.logout();

  // Remove user information from header
  headerUser()
}

// Get authentication token
async function getToken() {
  let account = sessionStorage.getItem('msalAccount');
  if (!account) {
    throw new Error(
      'User account missing from session. Please sign out and sign in again.');
  }
  try {
    const silentRequest = {
      scopes: msalRequest.scopes,
      account: msalClient.getAccountByUsername(account)
    };
    const silentResult = await msalClient.acquireTokenSilent(silentRequest);
    return silentResult.accessToken;
  } catch (silentError) {

    if (silentError instanceof msal.InteractionRequiredAuthError) {
      const interactiveResult = await msalClient.acquireTokenPopup(msalRequest);
      return interactiveResult.accessToken;
    } else {
      throw silentError;
    }
  }
}

// Display or remove user information if logged in or out
function headerUser() {

  const user = JSON.parse(sessionStorage.getItem('graphUser'));
  const signIn = document.getElementById("signInDiv");

  if (user) {
    signIn.innerHTML = '<div>Logged: ' + user.displayName + ' <button type="button" class="btn btn-secondary" onclick="signOut()">Sign Out</button></div>';
  } else {
    signIn.innerHTML = '<button type="button" class="btn btn-primary" onclick="signIn()">Sign In</button>';
  }
}
