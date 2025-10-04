const express = require('express');
const { uploadSingle } = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const prisma = require('../config/database');

const router = express.Router();

// Upload profile photo (admin only)
router.post('/photo', authenticateToken, uploadSingle('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    // Update user profile photo in database
    let user = await prisma.user.findFirst();
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL,
          name: 'Saurav Kumar',
          profilePhoto: fileUrl
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { profilePhoto: fileUrl }
      });
    }

    res.json({ 
      message: 'Profile photo uploaded successfully', 
      url: fileUrl,
      user: { profilePhoto: fileUrl }
    });
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ message: 'Failed to upload profile photo' });
  }
});

// Upload CV (admin only)
router.post('/cv', authenticateToken, uploadSingle('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Only PDF files are allowed for CV' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    // Update user CV URL in database
    let user = await prisma.user.findFirst();
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL,
          name: 'Saurav Kumar',
          cvUrl: fileUrl
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { cvUrl: fileUrl }
      });
    }

    res.json({ 
      message: 'CV uploaded successfully', 
      url: fileUrl,
      user: { cvUrl: fileUrl }
    });
  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ message: 'Failed to upload CV' });
  }
});

// Upload project image (admin only)
router.post('/project-image', authenticateToken, uploadSingle('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({ 
      message: 'Project image uploaded successfully', 
      url: fileUrl
    });
  } catch (error) {
    console.error('Error uploading project image:', error);
    res.status(500).json({ message: 'Failed to upload project image' });
  }
});

// Upload certificate image (admin only)
router.post('/certificate-image', authenticateToken, uploadSingle('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({ 
      message: 'Certificate image uploaded successfully', 
      url: fileUrl
    });
  } catch (error) {
    console.error('Error uploading certificate image:', error);
    res.status(500).json({ message: 'Failed to upload certificate image' });
  }
});

module.exports = router;
