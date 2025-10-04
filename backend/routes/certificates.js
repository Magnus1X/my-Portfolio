const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all certificates (public)
router.get('/', async (req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: [
        { issueDate: 'desc' },
        { order: 'asc' }
      ]
    });
    res.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ message: 'Failed to fetch certificates' });
  }
});

// Create new certificate (admin only)
router.post('/', authenticateToken, [
  body('title').isLength({ min: 1, max: 200 }),
  body('issuer').isLength({ min: 1, max: 200 }),
  body('issueDate').isISO8601(),
  body('credentialId').optional().isLength({ max: 100 }),
  body('credentialUrl').optional({ nullable: true, checkFalsy: true }).isURL(),
  // Allow either absolute URLs (http/https) or relative upload paths like /uploads/xyz.png
  body('imageUrl').optional().isString().isLength({ max: 1000 }).custom((value) => {
    if (!value) return true
    if (value.startsWith('/uploads/')) return true
    if (/^https?:\/\//.test(value)) return true
    throw new Error('imageUrl must be a valid URL or /uploads path')
  }),
  body('order').optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }).toInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const certificate = await prisma.certificate.create({
      data: {
        title: req.body.title,
        issuer: req.body.issuer,
        issueDate: new Date(req.body.issueDate),
        credentialId: req.body.credentialId,
        credentialUrl: req.body.credentialUrl,
        imageUrl: req.body.imageUrl,
        order: req.body.order || 0
      }
    });

    res.status(201).json({ message: 'Certificate created successfully', certificate });
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(500).json({ message: 'Failed to create certificate' });
  }
});

// Update certificate (admin only)
// Helper: remove keys that are empty strings to avoid invalid updates
const stripEmptyStrings = (obj) => {
  Object.keys(obj || {}).forEach((k) => {
    if (obj[k] === '') delete obj[k]
  })
  return obj
}

router.put('/:id', authenticateToken, [
  body('title').optional().isLength({ min: 1, max: 200 }),
  body('issuer').optional().isLength({ min: 1, max: 200 }),
  body('issueDate').optional({ nullable: true, checkFalsy: true }).isISO8601(),
  body('credentialId').optional().isLength({ max: 100 }),
  body('credentialUrl').optional({ nullable: true, checkFalsy: true }).isURL(),
  body('imageUrl').optional().isString().isLength({ max: 1000 }).custom((value) => {
    if (!value) return true
    if (value.startsWith('/uploads/')) return true
    if (/^https?:\/\//.test(value)) return true
    throw new Error('imageUrl must be a valid URL or /uploads path')
  }),
  body('order').optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }).toInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = stripEmptyStrings({ ...req.body });
    
    if (updateData.issueDate) {
      updateData.issueDate = new Date(updateData.issueDate);
    }

    const certificate = await prisma.certificate.update({
      where: { id },
      data: updateData
    });

    res.json({ message: 'Certificate updated successfully', certificate });
  } catch (error) {
    console.error('Error updating certificate:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Certificate not found' });
    } else {
      res.status(500).json({ message: 'Failed to update certificate' });
    }
  }
});

// Delete certificate (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.certificate.delete({
      where: { id }
    });

    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Certificate not found' });
    } else {
      res.status(500).json({ message: 'Failed to delete certificate' });
    }
  }
});

module.exports = router;
