const MarketplaceItem = require("../models/MarketplaceItem");

// @desc    Get all marketplace items (with optional search)
// @route   GET /api/marketplace
// @access  Public
const getMarketplaceItems = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    const items = await MarketplaceItem.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new marketplace listing
// @route   POST /api/marketplace
// @access  Private
const createMarketplaceItem = async (req, res, next) => {
  try {
    const { name, description, price, category, location, contact } = req.body;

    if (!name || !description || price === undefined || !location) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields (name, description, price, location)",
      });
    }

    const item = await MarketplaceItem.create({
      name,
      description,
      price: Number(price),
      category: category || "General",
      location,
      seller: req.user._id,
      sellerName: req.user.name || "Student",
      contact: contact || req.user.email,
    });

    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a marketplace listing
// @route   DELETE /api/marketplace/:id
// @access  Private (Owner or Admin)
const deleteMarketplaceItem = async (req, res, next) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Check ownership or admin
    if (
      item.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this listing",
      });
    }

    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMarketplaceItems,
  createMarketplaceItem,
  deleteMarketplaceItem,
};
