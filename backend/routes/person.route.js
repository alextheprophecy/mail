let express = require("express"),
    router = express.Router();

const {getPicture, getSciper} = require("../controller/epflApi")
/**
 * Get person image URL
 */
router.get("/person", (req, res, next) => {
    getPicture(getSciper()).then((url) => {
        console.log(url)
        res.status(200).send(url)
    })
});

module.exports = router;