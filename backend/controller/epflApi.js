const epflApi = require("epfl-people-api")

const getPicture = (sciper) => {
    return epflApi.hasPhoto(sciper).then(b=>{
        if(b)return epflApi.getPhotoUrl(sciper)
        else return "face.png"
    })
}

const getSciper = () => {
    return 134136
}

module.exports = {
    getPicture,
    getSciper
}