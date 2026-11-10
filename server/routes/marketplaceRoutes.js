const express = require("express");
const router = express.Router();
const {
  getMarketplaceItems,
  createMarketplaceItem,
  deleteMarketplaceItem,
} = require("../controllers/marketplaceController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getMarketplaceItems).post(protect, createMarketplaceItem);
router.route("/:id").delete(protect, deleteMarketplaceItem);

module.exports = router;
