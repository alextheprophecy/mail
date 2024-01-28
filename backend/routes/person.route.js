let express = require("express"),
    router = express.Router();
const {getImage} = require("../controller/image/image.handler");

/**
 * Get person image
 */
router.get("/person", (req, res, next) => {
    const {name, email} = req.body
    getImage(name, email).then((image) => {
        res.status(200).send(image)
    })
});

module.exports = router;