const Message = require("../models/Message");

// @desc    Get recent chat messages
// @route   GET /api/chat/messages
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(50);

    // Return in chronological order
    return res.status(200).json({
      success: true,
      count: messages.length,
      messages: messages.reverse(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Post a message via REST
// @route   POST /api/chat/messages
// @access  Private
const createMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text cannot be empty",
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      senderName: req.user.name || "Student",
      text: text.trim(),
    });

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  createMessage,
};
