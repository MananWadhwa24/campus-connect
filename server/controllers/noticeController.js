const Notice = require("../models/Notice");

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public
const getNotices = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const notices = await Notice.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notices.length,
      notices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private (Authenticated users / Faculty / Admin)
const createNotice = async (req, res, next) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide both title and description for the notice",
      });
    }

    const notice = await Notice.create({
      title,
      category: category || "General",
      description,
      postedBy: req.user._id,
      authorName: req.user.name || "Campus Administration",
    });

    return res.status(201).json({
      success: true,
      message: "Notice published successfully",
      notice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private (Author or Admin)
const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    // Check authorization: author or admin/faculty
    if (
      notice.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "faculty"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this notice",
      });
    }

    await notice.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotices,
  createNotice,
  deleteNotice,
};
