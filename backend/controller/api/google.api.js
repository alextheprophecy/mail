const fs = require('fs').promises;
const axios = require('axios')
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', "https://www.googleapis.com/auth/userinfo.profile"]; //.readonly/.modify
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'controller/api/googleApiCreds/token.json'); //
const CREDENTIALS_PATH = path.join(process.cwd(), 'controller/api/googleApiCreds/credentials.json');

const dayjs = require('dayjs')


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
        g: client.credentials.id_token
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
async function getRecentEmails(auth, count, label, startIndex) {
    const gmail = google.gmail({version: 'v1', auth});
    return gmail.users.messages.list({labelIds: label, userId: 'me'}).then(res => {
        if (res.data.resultSizeEstimate === 0) { //dirty: throwing error with (invalid) error code 204, as there is no content. Catch this in router to send an empty array instead
            const err = new Error("no content")
            err.code = 204
            throw err
        }
        let messages = res.data['messages'];

        //TODO: if count exceeds threshold, batch into multiple fetches
        messages = messages.slice(startIndex, (messages.length > count) ? count + startIndex : messages.length)


        return messages.map(m =>
            gmail.users.messages.get({userId: 'me', 'id': m.id}).then(res => getInfo(res.data.payload, m.id))
        )
    }).then(emails => Promise.all(emails))
}

function getInfo(messagePart, id) {
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
    const [formattedDate, time] = formatDate(new Date(headers.find(i => i.name === 'Date').value))
    const subject = headers.find(i => i.name === 'Subject').value
    const unsortedNames = headers.find(i => i.name === 'From').value.split(" ")
    const senderEmail = unsortedNames.pop().slice(1, -1) //email: last name, pop s.t. senderNames now contains only names
    let senderNames = unsortedNames.join(" ")
    if (!senderNames) senderNames = "Anonymous"

    return formatResponse(subject, senderNames, senderEmail, "body", formattedDate, time, id)
}

const formatResponse = (sub, names, email, body, date, time, id) => {
    return {
        subject: sub,
        senderName: names,
        senderEmail: email,
        body: body,
        date: date,
        time: time,
        id: id
    }
}

const formatDate = (date) => {
    const time = date.getHours() + ':' + date.getMinutes()

    date = dayjs(date)
    const today = dayjs()
    const isToday = today.isSame(date, 'day')
    const isYesterday = today.subtract(1, 'day').isSame(date, 'day')
    const isThisWeek = today.isSame(date, 'week')
    const weekDay = date.day()
    const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const formatDate = new Intl.DateTimeFormat("en-GB").format(date) //TODO: create own function? looks scrappy->maybe infefficient
    const string = isToday ? "Today" : isYesterday ? "Yesterday" : isThisWeek ? WEEK_DAYS[weekDay] : formatDate
    return [string, time]
}

const myProfilePicture = (auth) => {
    return google.people({version: 'v1', auth}).people.get({
        resourceName: "people/me",
        personFields: "photos"
    }).then(p => {
        return p.data.photos[0].url
    });
}


const TEST_EPFL_MAILS = [
    formatResponse("Fait ton devoir", "Emmanuel", "emmanuel.abbe@epfl.ch", "body", "Today", "04:20", 232355),
    formatResponse("Please solve P vs NP problem by tmrw. Thx!", "Mika Goos", "mika.goos@epfl.ch", "body", "Today", "04:20", 232323),
    formatResponse("Votre code est entierement identique à celui de Pantalos!?", "Chapellier", "jean-cedric.chappelier@epfl.ch", "body", "Yesterday", "06:09", 44444),
    formatResponse("I am confused", "Karl Aberer", "karl.aberer@epfl.ch", "body", "Yesterday", "06:09", 11122),
    formatResponse("martin wants to discuss about ice cream flavours", "Martin Vetterli", "martin.vetterli@epfl.ch", "body", "Today", "04:20", 232323),
    formatResponse("I am proud to say that the rats have finally taken over the BC building. RISE MY MINIONS!", "Viktor", "viktor.kuncak@epfl.ch", "body", "Yesterday", "06:09", 78945),
    formatResponse("Scala is very cool", "Odersky", "martin.odersky@epfl.ch", "body", "Yesterday", "06:09", 445645),
    formatResponse("I have bred 200 more rats, will be out under the BC floors by tomorrow", "Viktor", "viktor.kuncak@epfl.ch", "body", "Yesterday", "06:09", 6656),
    formatResponse("Jaimerais un deuxieme entretien avec Pantalos... ", "Chappelier", "jean-cedric.chappelier@epfl.ch", "body", "Yesterday", "06:09", 88888)
]


/**
 * fetches most recent count mails and returns a promise
 * @param count
 * @param label
 * @param startIndex
 * @return {Promise<Object[]>} list of json objects containing email info. (subject, sender, body)
 */
const fetchMail = (count, label, startIndex = 0) => {
    //TODO: remove this during production. for testing only!
    if(label==="EPFL") return Promise.resolve(TEST_EPFL_MAILS)
    return authorize().then(a => getRecentEmails(a, count, label, startIndex))
}

module.exports = fetchMail