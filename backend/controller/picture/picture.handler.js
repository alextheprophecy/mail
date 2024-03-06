const t = require('@tensorflow/tfjs-node')
const {getPictureFromEmail} = require("../api/epfl.api");

const faceapi = require("@vladmandic/face-api");
const axios = require("axios");
const path = require("path");
const process = require("process");

const PICTURE_TYPES = {
    myWebsite: "my-website",
    epfl: "epfl",
    wikiSearch: "wikipedia-search",
    iconColour: "icon-colour"
}

//TODO: (optimisation) create arraylist as cache for profile images
const getFaceFromPicture = (pictureUrl) => {
    const p = path.join(process.cwd(), 'bin/models');
    return faceapi.nets.tinyFaceDetector.loadFromDisk(p).then(() => {
        return axios.get(pictureUrl, {responseType: 'arraybuffer'}).then(a => {
            const b = Buffer.from(a.data)
            return faceapi.tinyFaceDetector(t.node.decodeImage(b)).then((r) => {
                const f = r[0]
                return {imgW : f.imageDims.width, imgH : f.imageDims.height,
                    faceW: f.box.width, faceH: f.box.height, faceX: f.box.x, faceY: f.box.y, url:pictureUrl}
            })
        })
    }).catch(e => console.log(e))
}
//getFaceFromPicture("https://img.freepik.com/premium-photo/shot-group-young-women-standing-together-outside-created-with-generative-ai_762026-34413.jpg").then(a=>console.log(a))//("https://people.epfl.ch/private/common/photos/links/107537.jpg")

/**
 * gives the picture of a
 * @param email
 * @param name
 * @return {Promise<{type: string, value: *} | {type: string, value: string}>}
 */
const getPicture = (email, name) => {

    //TODO: implement user profile picture saved on my website itself
    //TODO: lookup email address domain. if epfl->epfl image logic etc.

    return getPictureFromEmail(email).then(p => {
        //fetch EPFL profile picture
        return Promise.resolve({type: PICTURE_TYPES.epfl, value: getFaceFromPicture(p)})

    }).catch(() => {
            //TODO: fetch company search profile picture (lookup using wikipedia API)

            //return colour for profile Icon
            return Promise.resolve({type: PICTURE_TYPES.iconColour, value: getColour(email + name)})
        }
    )
}

const SATURATION = 25
const LIGHTNESS = 40
const getColour = (string) => {
    const hashed = hash(string) % 360
    //TODO: fix ISSUE: hash can be equal to playground.background-colour hue
    return `hsl(${(hashed % 360)}, ${SATURATION}%, ${LIGHTNESS}%)`;
}

/**
 * very simple hash function
 * @param {string} str
 * @return {number}
 */
const hash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);//*(i%2===0?2:1) to complexify algorithm
    return hash;
}


module.exports = {
    getFaceFromPicture,
    getPicture
}