const Note = require("../models/Note");

// @desc    Get all notes (with optional search)
// @route   GET /api/notes
// @access  Public (or protected)
const getNotes = async (req, res, next) => {
  try {
    const { search, branch, semester } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { branch: { $regex: search, $options: "i" } },
        { semester: { $regex: search, $options: "i" } },
      ];
    }

    if (branch) {
      query.branch = { $regex: branch, $options: "i" };
    }

    if (semester) {
      query.semester = { $regex: semester, $options: "i" };
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { title, description, subject, semester, branch } = req.body;

    if (!title || !description || !semester || !branch) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields (title, description, semester, branch)",
      });
    }

    const note = await Note.create({
      title,
      description,
      subject: subject || title,
      semester,
      branch,
      uploadedBy: req.user._id,
      uploaderName: req.user.name || "Student",
    });

    return res.status(201).json({
      success: true,
      message: "Note added successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private (Owner or Admin)
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Check ownership or admin
    if (
      note.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this note",
      });
    }

    await note.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  createNote,
  deleteNote,
};
