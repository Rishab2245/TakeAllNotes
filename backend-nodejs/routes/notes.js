const express = require('express');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Validation middleware
const validateNote = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('content').optional().trim()
];

// @desc    Get all notes for authenticated user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    const query = { 
      userId: req.user._id,
      isArchived: { $ne: true }
    };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const notes = await Note.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    
    // Get total count for pagination
    const total = await Note.countDocuments(query);
    
    res.status(200).json({
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json({ note });

  } catch (error) {
    console.error('Get note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid note ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: errors.array()[0].msg 
      });
    }

    const { title, content, tags, isPinned } = req.body;

    const note = await Note.create({
      title,
      content: content || '',
      tags: tags || [],
      isPinned: isPinned || false,
      userId: req.user._id
    });

    res.status(201).json({
      message: 'Note created successfully',
      note
    });

  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: errors.array()[0].msg 
      });
    }

    const { title, content, tags, isPinned, isArchived } = req.body;

    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      {
        title,
        content,
        tags,
        isPinned,
        isArchived
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json({
      message: 'Note updated successfully',
      note
    });

  } catch (error) {
    console.error('Update note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid note ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });

  } catch (error) {
    console.error('Delete note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid note ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Archive/Unarchive note
// @route   PATCH /api/notes/:id/archive
// @access  Private
const toggleArchive = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    note.isArchived = !note.isArchived;
    await note.save();

    res.status(200).json({
      message: `Note ${note.isArchived ? 'archived' : 'unarchived'} successfully`,
      note
    });

  } catch (error) {
    console.error('Toggle archive error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid note ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Pin/Unpin note
// @route   PATCH /api/notes/:id/pin
// @access  Private
const togglePin = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json({
      message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`,
      note
    });

  } catch (error) {
    console.error('Toggle pin error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid note ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Routes
router.get('/', getNotes);
router.get('/:id', getNote);
router.post('/', validateNote, createNote);
router.put('/:id', validateNote, updateNote);
router.delete('/:id', deleteNote);
router.patch('/:id/archive', toggleArchive);
router.patch('/:id/pin', togglePin);

module.exports = router;

