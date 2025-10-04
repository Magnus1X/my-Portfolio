const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user info (public)
router.get('/', async (req, res) => {
  try {
    let user = await prisma.user.findFirst();
    
    if (!user) {
      // Create default user if none exists
      user = await prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL,
          name: 'Saurav Kumar',
          tagline: 'Full Stack Developer & AI Engineer',
          location: 'India',
          summary: 'Passionate developer creating innovative solutions with modern technologies.',
          linkedin: '',
          github: '',
          twitter: '',
          instagram: '',
          codeforces: '',
          leetcode: ''
        }
      });
    }

    // Don't expose sensitive data
    const { id, createdAt, updatedAt, ...publicUser } = user;
    res.json(publicUser);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Failed to fetch user information' });
  }
});

// Helper to normalize social handles to full URLs
const normalizeSocialUrl = (platform, value) => {
  if (!value) return value
  const v = String(value).trim()
  if (/^https?:\/\//i.test(v)) return v
  switch (platform) {
    case 'linkedin': {
      // Accept 'in/handle' or just 'handle'
      const handle = v.replace(/^in\//i, '')
      return `https://www.linkedin.com/in/${handle}`
    }
    case 'github': {
      return `https://github.com/${v}`
    }
    case 'twitter': {
      return `https://twitter.com/${v}`
    }
    case 'instagram': {
      return `https://instagram.com/${v}`
    }
    default:
      return v
  }
}

// Update user info (admin only)
router.put('/', authenticateToken, [
  body('name').optional().isLength({ min: 1, max: 100 }),
  body('tagline').optional().isLength({ max: 200 }),
  body('location').optional().isLength({ max: 100 }),
  body('summary').optional().isLength({ max: 1000 }),
  body('linkedin').optional({ nullable: true, checkFalsy: true }).customSanitizer((v) => normalizeSocialUrl('linkedin', v)).isURL(),
  body('github').optional({ nullable: true, checkFalsy: true }).customSanitizer((v) => normalizeSocialUrl('github', v)).isURL(),
  body('twitter').optional({ nullable: true, checkFalsy: true }).customSanitizer((v) => normalizeSocialUrl('twitter', v)).isURL(),
  body('instagram').optional({ nullable: true, checkFalsy: true }).customSanitizer((v) => normalizeSocialUrl('instagram', v)).isURL(),
  body('codeforces').optional().isString().isLength({ max: 100 }),
  body('leetcode').optional().isString().isLength({ max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const updateData = req.body;
    
    let user = await prisma.user.findFirst();
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL,
          ...updateData
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });
    }

    const { id, createdAt, updatedAt, ...publicUser } = user;
    res.json({ message: 'User information updated successfully', user: publicUser });
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ message: 'Failed to update user information' });
  }
});

module.exports = router;
