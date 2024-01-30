const {getPictureFromEmail} = require("../api/epfl.api");

const PICTURE_TYPES = {
    myWebsite: "my-website",
    epfl: "epfl",
    wikiSearch: "wikipedia-search",
    iconColour: "icon-colour"
}

/**
 * gives the picture of a
 * @param email
 * @return {Promise<{type: string, value: *} | {type: string, value: string}>}
 */
const getPicture = (email) => {
    //TODO: implement user profile picture saved on my website itself

    return getPictureFromEmail(email).then(p => {
        //fetch EPFL profile picture
        return {type: PICTURE_TYPES.epfl, value: p}

    }).catch(e => {
            //TODO: fetch company search profile picture (lookup using wikipedia API)


            //return colour for profile Icon
            return {type: PICTURE_TYPES.iconColour, value: getColour(email)}
        }
    )
}

const SATURATION = 25
const LIGHTNESS = 40
const getColour = (string) => {
    const hashed = hash(string) % 360
    return `hsl(${(hashed % 360)}, ${SATURATION}%, ${LIGHTNESS}%)`;
}


/**
 * very simple hash function
 * @param {string} str
 * @return {number}
 */
const hash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
    return hash;
}

module.exports = {
    getPicture
}