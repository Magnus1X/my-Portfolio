const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Normalize URLs by adding https:// when scheme is missing
const normalizeUrl = (value) => {
  if (!value) return value;
  const v = String(value).trim();
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

// Helper: remove keys that are empty strings to avoid invalid updates
const stripEmptyStrings = (obj) => {
  Object.keys(obj || {}).forEach((k) => {
    if (obj[k] === '') delete obj[k]
  })
  return obj
}

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' }
      ]
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Create new project (admin only)
router.post('/', authenticateToken, [
  body('title').isLength({ min: 1, max: 200 }),
  body('description').isLength({ min: 1, max: 1000 }),
  // Allow either absolute URLs (http/https) or relative upload paths like /uploads/xyz.png
  body('imageUrl').optional().isString().isLength({ max: 1000 }).custom((value) => {
    if (!value) return true
    if (value.startsWith('/uploads/')) return true
    if (/^https?:\/\//.test(value)) return true
    throw new Error('imageUrl must be a valid URL or /uploads path')
  }),
  body('liveUrl').optional({ nullable: true, checkFalsy: true }).customSanitizer((v) => normalizeUrl(v)).isURL(),
  body('githubUrl').optional({ nullable: true, checkFalsy: true }).customSanitizer((v) => normalizeUrl(v)).isURL(),
  body('techStack').isLength({ min: 1, max: 500 }),
  body('order').optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }).toInt(),
  body('featured').optional({ nullable: true, checkFalsy: true }).isBoolean().toBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    // Normalize techStack to string
    let techStack = req.body.techStack
    if (Array.isArray(techStack)) {
      techStack = techStack.join(', ')
    }

    const project = await prisma.project.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        liveUrl: req.body.liveUrl,
        githubUrl: req.body.githubUrl,
        techStack,
        order: req.body.order || 0,
        featured: req.body.featured || false
      }
    });

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('Error creating project:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Project title must be unique' });
    }
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// Update project (admin only)
router.put('/:id', authenticateToken, [
  body('title').optional().isLength({ min: 1, max: 200 }),
  body('description').optional().isLength({ min: 1, max: 1000 }),
  body('imageUrl').optional().isString().isLength({ max: 1000 }).custom((value) => {
    if (!value) return true
    if (value.startsWith('/uploads/')) return true
    if (/^https?:\/\//.test(value)) return true
    throw new Error('imageUrl must be a valid URL or /uploads path')
  }),
  body('liveUrl').optional({ nullable: true, checkFalsy: true }).customSanitizer((v) => normalizeUrl(v)).isURL(),
  body('githubUrl').optional({ nullable: true, checkFalsy: true }).customSanitizer((v) => normalizeUrl(v)).isURL(),
  body('techStack').optional().isLength({ min: 1, max: 500 }),
  body('order').optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }).toInt(),
  body('featured').optional({ nullable: true, checkFalsy: true }).isBoolean().toBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = stripEmptyStrings({ ...req.body });
    if (Array.isArray(updateData.techStack)) {
      updateData.techStack = updateData.techStack.join(', ')
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData
    });

    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    console.error('Error updating project:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Project not found' });
    } else {
      res.status(500).json({ message: 'Failed to update project' });
    }
  }
});

// Delete project (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Project not found' });
    } else {
      res.status(500).json({ message: 'Failed to delete project' });
    }
  }
});

module.exports = router;
