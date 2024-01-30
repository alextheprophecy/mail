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
 * @param name
 * @return {Promise<{type: string, value: *} | {type: string, value: string}>}
 */
const getPicture = (email, name) => {
    return Promise.resolve({type: PICTURE_TYPES.iconColour, value: getColour(email+name)})

    //TODO: implement user profile picture saved on my website itself
    //TODO: lookup email address domain. if epfl->epfl image logic etc.

    return getPictureFromEmail(email).then(p => {
        //fetch EPFL profile picture
        return {type: PICTURE_TYPES.epfl, value: p}

    }).catch(() => {
            //TODO: fetch company search profile picture (lookup using wikipedia API)

            //return colour for profile Icon
            return {type: PICTURE_TYPES.iconColour, value: getColour(email+name)}
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
    getPicture
}