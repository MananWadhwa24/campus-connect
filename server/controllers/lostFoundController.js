const LostFound = require("../models/LostFound");

// @desc    Get all lost & found reports
// @route   GET /api/lost-found
// @access  Public
const getLostFoundItems = async (req, res, next) => {
  try {
    const { type, status, search } = req.query;
    let query = {};

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const items = await LostFound.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Report a lost or found item
// @route   POST /api/lost-found
// @access  Private
const createLostFoundItem = async (req, res, next) => {
  try {
    const { name, description, location, type, contact } = req.body;

    if (!name || !description || !location || !type) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields (name, description, location, type)",
      });
    }

    const item = await LostFound.create({
      name,
      description,
      location,
      type,
      contact: contact || req.user.email,
      reportedBy: req.user._id,
      reporterName: req.user.name || "Student",
    });

    return res.status(201).json({
      success: true,
      message: `${type} item reported successfully`,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status (e.g., mark as Resolved)
// @route   PATCH /api/lost-found/:id/status
// @access  Private
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Only reporter or admin can change status
    if (
      item.reportedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this report",
      });
    }

    item.status = status || "Resolved";
    await item.save();

    return res.status(200).json({
      success: true,
      message: `Report marked as ${item.status}`,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a report
// @route   DELETE /api/lost-found/:id
// @access  Private
const deleteLostFoundItem = async (req, res, next) => {
  try {
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    if (
      item.reportedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this report",
      });
    }

    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLostFoundItems,
  createLostFoundItem,
  updateStatus,
  deleteLostFoundItem,
};
