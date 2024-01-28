const epflApi = require("epfl-people-api")

const getPicture = (sciper) => {
    return epflApi.hasPhoto(sciper).then(b => {
        if (b) return epflApi.getPhotoUrl(sciper)
        else throw new Error("no picture for this sciper")
    })
}

const getSciperFromEmail = (email) => {
    return epflApi.findByEmail(email, 'en').then(u => u.sciper)
}

const getPictureFromEmail = (email) => {
    return getSciperFromEmail(email).then(s => getPicture(Number(s)))
}

module.exports = {
    getPictureFromEmail
}