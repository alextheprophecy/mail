let express = require("express"),
    router = express.Router();

router.post("/login", (req, res, next) => {
    const {username, password} = req.body
});

router.post("/register", (req, res, next) => {
    const {username, password} = req.body
});

module.exports = router;