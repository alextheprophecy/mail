let express = require("express"),
    router = express.Router();
const {getPicture} = require("../controller/picture/picture.handler");

/**
 * Get person picture
 */
router.get("/person", (req, res, next) => {
    const email = req.query.email
    const name = req.query.name

    getPicture(email, name).then((pic) => {
        res.status(200).send(pic)
    })
});

module.exports = router;