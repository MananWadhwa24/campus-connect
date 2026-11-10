const express = require("express");
const router = express.Router();
const {
  getNotes,
  createNote,
  deleteNote,
} = require("../controllers/noteController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router
  .route("/")
  .get(getNotes)
  .post(protect, upload.single("file"), createNote);

router.route("/:id").delete(protect, deleteNote);

module.exports = router;
