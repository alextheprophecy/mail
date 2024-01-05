let express = require("express"),
    router = express.Router();

//Basic Mail Handling
/**
 * Get mails (subject + sender)
 */
router.get("/mails", (req, res, next) => {
});

/**
 * Delete a mail
 */
router.delete("/mails", (req, res, next) => {
    const {mailId} = req.body
});

/**
 * Send a mail
 */
router.post("/mails", (req, res, next) => {
    const {receiver, subject, body} = req.body
});


//More specific mail handling for website
/**
 * Mark mail as read
 */
router.post("/mails/read", (req, res, next) => {
    const {mailId} = req.body
});

/**
 * Get mail summary + body + (audio)
 */
router.get("/mails/read", (req, res, next) => {
    const {mailId} = req.body
});

module.exports = router;