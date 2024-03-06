let express = require("express"),
    router = express.Router();
const {getFaceFromPicture, getPicture} = require("../controller/picture/picture.handler");

/**
 * Get person picture
 */
router.get("/person", (req, res, next) => {
    const email = req.query.email
    const name = req.query.name

    getFaceFromPicture("https://people.epfl.ch/private/common/photos/links/349143.jpg?ts=1709761104").then(p=>{
        res.status(200).send(p)
    })
    /*
    getPicture(email, name).then((pic) => {
        res.status(200).send(pic)
    })*/
});

module.exports = router;