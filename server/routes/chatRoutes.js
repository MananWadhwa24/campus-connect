const express = require("express");
const router = express.Router();
const { getMessages, createMessage } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.route("/messages").get(protect, getMessages).post(protect, createMessage);

module.exports = router;
