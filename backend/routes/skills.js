const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all skills (public)
router.get('/', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Failed to fetch skills' });
  }
});

// Create new skill (admin only)
router.post('/', authenticateToken, [
  body('name').isLength({ min: 1, max: 100 }),
  body('svgIcon').isLength({ min: 1 }),
  body('category').optional().isLength({ max: 50 }),
  body('order').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const skill = await prisma.skill.create({
      data: {
        name: req.body.name,
        svgIcon: req.body.svgIcon,
        category: req.body.category || 'Technical',
        order: req.body.order || 0
      }
    });

    res.status(201).json({ message: 'Skill created successfully', skill });
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ message: 'Failed to create skill' });
  }
});

// Update skill (admin only)
router.put('/:id', authenticateToken, [
  body('name').optional().isLength({ min: 1, max: 100 }),
  body('svgIcon').optional().isLength({ min: 1 }),
  body('category').optional().isLength({ max: 50 }),
  body('order').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    const skill = await prisma.skill.update({
      where: { id },
      data: updateData
    });

    res.json({ message: 'Skill updated successfully', skill });
  } catch (error) {
    console.error('Error updating skill:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Skill not found' });
    } else {
      res.status(500).json({ message: 'Failed to update skill' });
    }
  }
});

// Delete skill (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.skill.delete({
      where: { id }
    });

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Skill not found' });
    } else {
      res.status(500).json({ message: 'Failed to delete skill' });
    }
  }
});

module.exports = router;
