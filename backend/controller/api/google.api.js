const fs = require('fs').promises;
const axios = require('axios')
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']; //.readonly/.modify
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'controller/api/googleApiCreds/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'controller/api/googleApiCreds/credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listLabels(auth) {
    const gmail = google.gmail({version: 'v1', auth});
    const res = await gmail.users.labels.list({
        userId: 'me',
    });
    const labels = res.data.labels;
    if (!labels || labels.length === 0) {
        console.log('No labels found.');
        return;
    }
    console.log('Labels:');
    labels.forEach((label) => {
        console.log(`- ${label.name}`);
    });
}


/////////////////////
async function getRecentEmails(auth, count, label) {
    const gmail = google.gmail({version: 'v1', auth});
    return gmail.users.messages.list({labelIds: label, userId: 'me'}).then(res => {
        if (res.data.resultSizeEstimate === 0) { //dirty: throwing error with (invalid) error code 204, as there is no content. Catch this in router to send an empty array instead
            const err = new Error("no content")
            err.code = 204
            throw err
        }
        let messages = res.data['messages'];

        //TODO: if count exceeds threshold, batch into multiple fetches
        if (messages.length > count) messages = messages.slice(0, count)

        return messages.map(m =>
            gmail.users.messages.get({userId: 'me', 'id': m.id}).then(res => getInfo(res.data.payload))
        )
    }).then(emails => Promise.all(emails))
}

function getInfo(messagePart) {
    let message = messagePart
    let messageParent = message //messageParent: contains all parts[] of message

    while (message.mimeType.split("/")[0] === 'multipart') {
        messageParent = message
        message = message.parts[0]
    }

    //TODO: load more than just 0th index. lookup doc. : https://developers.google.com/gmail/api/reference/rest/v1/users.messages#Message.MessagePart
    //TODO: load body properly
    //const messagePartBody = messageParent.parts[0].body
    //const body = Buffer.from(messagePartBody.data, 'base64').toString()

    const headers = messagePart.headers
    const date = new Date(headers.find(i => i.name === 'Date').value).toISOString()
    const subject = headers.find(i => i.name === 'Subject').value
    const unsortedNames = headers.find(i => i.name === 'From').value.split(" ")
    const senderEmail = unsortedNames.pop().slice(1, -1) //email: last name, pop s.t. senderNames now contains only names
    const senderNames = unsortedNames.join(" ")

    return {
        subject: "subject",
        senderName: senderNames,
        senderEmail: senderEmail,
        body: "body",
        date: date
    }
}

/**
 * fetches most recent count mails and returns a promise
 * @param count
 * @param labels
 * @return {Promise<Object[]>} list of json objects containing email info. (subject, sender, body)
 */
const fetchMail = (count, label) => {
    return authorize().then(a => getRecentEmails(a, count, label))
}

module.exports = fetchMail