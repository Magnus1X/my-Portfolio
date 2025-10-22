const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult, param } = require('express-validator');
const prisma = require('../config/database');
const nodemailer = require('nodemailer');

const router = express.Router();

const isEmailConfigured = () => {
  return Boolean(
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS &&
    (process.env.EMAIL_FROM || process.env.EMAIL_USER)
  )
}

// Prefer SMTP host/port from env when available
const smtpConfigFromEnv = () => {
  const host = process.env.EMAIL_HOST
  const port = Number(process.env.EMAIL_PORT)
  if (host && port) {
    const secure = port === 465
    return {
      host,
      port,
      secure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'TLSv1.2'
      }
    }
  }
  return null
}

const createTransporter = async () => {
  if (!isEmailConfigured()) {
    return nodemailer.createTransport({ jsonTransport: true })
  }

  const smtp = smtpConfigFromEnv()
  const transporter = smtp
    ? nodemailer.createTransport(smtp)
    : nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
          ciphers: 'TLSv1.2'
        }
      })

  try {
    await transporter.verify()
    return transporter
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Email transport verification failed, using dev JSON transport:', err.message)
      return nodemailer.createTransport({ jsonTransport: true })
    }
    throw err
  }
}

// List messages (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: [{ createdAt: 'desc' }]
    })
    res.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ message: 'Failed to fetch messages' })
  }
})

// Mark message as read (admin only)
router.patch('/:id/read', authenticateToken, [
  param('id').isString(),
  body('read').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const id = req.params.id
    const read = typeof req.body.read === 'boolean' ? req.body.read : true

    const updated = await prisma.message.update({
      where: { id },
      data: { read }
    })
    res.json({ message: 'Message updated', item: updated })
  } catch (error) {
    console.error('Error marking message read:', error)
    res.status(500).json({ message: 'Failed to update message' })
  }
})

// Reply to a message (admin only)
router.post('/:id/reply', authenticateToken, [
  param('id').isString(),
  body('reply').isLength({ min: 1, max: 5000 }),
  body('subject').optional().isLength({ min: 1, max: 200 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const id = req.params.id
    const { reply, subject } = req.body

    const message = await prisma.message.findUnique({ where: { id } })
    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

    const transporter = await createTransporter();
    const fromAddress = `${process.env.EMAIL_FROM || process.env.EMAIL_USER}`
    const mailOptions = {
      from: `Saurav Kumar <${fromAddress}>`,
      to: message.email,
      replyTo: fromAddress,
      subject: subject || `Re: ${message.subject || 'Your message'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Hi ${message.name},</p>
          <div style="white-space: pre-line;">${reply}</div>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">Replying to your original message:</p>
          <blockquote style="background:#f5f5f5; padding:10px; border-left:3px solid #ccc;">${message.content.replace(/\n/g,'<br>')}</blockquote>
        </div>
      `
    }

    let simulated = false
    try {
      await transporter.sendMail(mailOptions)
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Reply email send failed, simulating in development:', err.message)
        const devTransporter = nodemailer.createTransport({ jsonTransport: true })
        await devTransporter.sendMail(mailOptions)
        simulated = true
      } else {
        throw err
      }
    }

    const updated = await prisma.message.update({
      where: { id },
      data: { replied: true }
    })

    res.json({ message: 'Reply sent', item: updated, hint: simulated ? 'Email simulated in development. Set EMAIL_USER/EMAIL_PASS/EMAIL_FROM or use EMAIL_HOST/EMAIL_PORT.' : undefined })
  } catch (error) {
    console.error('Error replying to message:', error)
    res.status(500).json({ message: 'Failed to send reply' })
  }
})

router.delete('/:id', authenticateToken, [
  param('id').isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const id = req.params.id

    const existing = await prisma.message.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ message: 'Message not found' })
    }

    await prisma.message.delete({ where: { id } })
    return res.json({ message: 'Message deleted' })
  } catch (error) {
    console.error('Error deleting message:', error)
    return res.status(500).json({ message: 'Failed to delete message' })
  }
})

module.exports = router;