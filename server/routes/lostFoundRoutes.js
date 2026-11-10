const express = require("express");
const router = express.Router();
const {
  getLostFoundItems,
  createLostFoundItem,
  updateStatus,
  deleteLostFoundItem,
} = require("../controllers/lostFoundController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getLostFoundItems).post(protect, createLostFoundItem);
router.route("/:id").delete(protect, deleteLostFoundItem);
router.route("/:id/status").patch(protect, updateStatus);

module.exports = router;
