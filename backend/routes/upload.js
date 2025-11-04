const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { authenticateToken } = require('../middleware/auth');
const prisma = require('../config/database');

const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadToCloudinary = (buffer, folder, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { 
        folder, 
        resource_type: resourceType,
        transformation: resourceType === 'image' ? [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' }
        ] : undefined
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};

router.post('/photo', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/photos');
    
    let user = await prisma.user.findFirst();
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL,
          name: 'Saurav Kumar',
          profilePhoto: result.secure_url
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { profilePhoto: result.secure_url }
      });
    }


    res.json({ 
      message: 'Profile photo uploaded successfully', 
      url: result.secure_url,
      user: { profilePhoto: result.secure_url }
    });
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ message: 'Failed to upload profile photo', error: error.message });
  }
});

router.post('/cv', authenticateToken, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Only PDF files are allowed for CV' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/cv', 'raw');
    
    let user = await prisma.user.findFirst();
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL,
          name: 'Saurav Kumar',
          cvUrl: result.secure_url
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { cvUrl: result.secure_url }
      });
    }

    res.json({ 
      message: 'CV uploaded successfully', 
      url: result.secure_url,
      user: { cvUrl: result.secure_url }
    });
  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ message: 'Failed to upload CV' });
  }
});

router.post('/project-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/projects');

    res.json({ 
      message: 'Project image uploaded successfully', 
      url: result.secure_url
    });
  } catch (error) {
    console.error('Error uploading project image:', error);
    res.status(500).json({ message: 'Failed to upload project image' });
  }
});

router.post('/certificate-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/certificates');

    res.json({ 
      message: 'Certificate image uploaded successfully', 
      url: result.secure_url
    });
  } catch (error) {
    console.error('Error uploading certificate image:', error);
    res.status(500).json({ message: 'Failed to upload certificate image' });
  }
});

module.exports = router;
